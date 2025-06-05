import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, In, Not } from 'typeorm';
import { Category } from './category.entity';
import { 
  CreateCategoryDto, 
  UpdateCategoryDto, 
  GetCategoryDto,
  MoveCategoryDto,
  UpdateStatusDto,
  BatchUpdateStatusDto,
  CategoryTreeDto,
  UpdateShowInNavDto,
  BatchUpdateShowInNavDto
} from './dto';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  /**
   * 创建分类
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // 检查分类名称是否已存在（同一层级下不能重名）
    const existingCategory = await this.checkNameExists(
      createCategoryDto.name, 
      createCategoryDto.parentId
    );

    if (existingCategory) {
      throw new CustomException(ErrorCode.ERR_10001, '同一层级下分类名称已存在');
    }

    // 处理父级分类
    let parentCategory: Category = null;
    let level = 1;
    let path = '';

    if (createCategoryDto.parentId) {
      parentCategory = await this.findOne(createCategoryDto.parentId);
      level = parentCategory.level + 1;
      
      if (level > 5) {
        throw new CustomException(ErrorCode.ERR_10001, '分类层级不能超过5级');
      }
      
      path = parentCategory.path ? `${parentCategory.path},${parentCategory.id}` : `${parentCategory.id}`;
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      level,
      path,
      sort: createCategoryDto.sort || 0,
      showInNav: createCategoryDto.showInNav !== undefined ? createCategoryDto.showInNav : true,
      status: createCategoryDto.status || 1,
    });

    return await this.categoryRepository.save(category);
  }

  /**
   * 分页查询分类列表
   */
  async findAll(query: GetCategoryDto) {
    const { 
      pageNo = 1, 
      pageSize = 10, 
      name, 
      status, 
      parentId, 
      level, 
      showInNav 
    } = query;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent')
      .leftJoinAndSelect('category.children', 'children');

    // 名称模糊查询
    if (name) {
      queryBuilder.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('category.status = :status', { status });
    }

    // 父级分类筛选
    if (parentId !== undefined) {
      if (parentId === 0) {
        queryBuilder.andWhere('category.parentId IS NULL');
      } else {
        queryBuilder.andWhere('category.parentId = :parentId', { parentId });
      }
    }

    // 层级筛选
    if (level) {
      queryBuilder.andWhere('category.level = :level', { level });
    }

    // 导航显示筛选
    if (showInNav !== undefined) {
      queryBuilder.andWhere('category.showInNav = :showInNav', { showInNav });
    }

    // 排序和分页
    queryBuilder
      .orderBy('category.sort', 'DESC')
      .addOrderBy('category.createTime', 'DESC')
      .skip((pageNo - 1) * pageSize)
      .take(pageSize);

    const [categories, total] = await queryBuilder.getManyAndCount();

    return {
      pageData: categories,
      total,
      pageNo,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 获取分类树形结构
   */
  async getTree(query: CategoryTreeDto) {
    const { maxLevel = 3, status, showInNav, includeProductCount = false, name } = query;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    if (name) {
      queryBuilder.andWhere('category.name LIKE :name', { name: `%${name}%` });
    }

    // 只获取指定层级内的分类
    queryBuilder.andWhere('category.level <= :maxLevel', { maxLevel });

    // 状态筛选
    if (status === 0 || status === 1) {
      queryBuilder.andWhere('category.status = :status', { status });
    }

    // 导航显示筛选
    if (showInNav !== undefined) {
      queryBuilder.andWhere('category.showInNav = :showInNav', { showInNav });
    }

    // 排序
    queryBuilder.orderBy('category.level', 'ASC')
      .addOrderBy('category.sort', 'ASC')
      .addOrderBy('category.createTime', 'ASC');

    const categories = await queryBuilder.getMany();

    // 构建树形结构
    return this.buildTree(categories);
  }

  /**
   * 根据ID查询分类详情
   */
  async findOne(id: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({ 
      where: { id },
      relations: ['parent', 'children']
    });
    
    if (!category) {
      throw new CustomException(ErrorCode.ERR_10002, '分类不存在');
    }

    return category;
  }

  /**
   * 更新分类信息
   */
  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // 如果更新名称，检查是否与同层级其他分类重名
    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const existingCategory = await this.checkNameExists(
        updateCategoryDto.name, 
        updateCategoryDto.parentId !== undefined ? updateCategoryDto.parentId : category.parentId,
        id
      );

      if (existingCategory) {
        throw new CustomException(ErrorCode.ERR_10001, '同一层级下分类名称已存在');
      }
    }

    // 如果更新了父级分类，需要重新计算层级和路径
    if (updateCategoryDto.parentId !== undefined && updateCategoryDto.parentId !== category.parentId) {
      // 检查是否会形成循环引用
      if (await this.wouldCreateCircularReference(id, updateCategoryDto.parentId)) {
        throw new CustomException(ErrorCode.ERR_10001, '不能将分类移动到其子分类下');
      }

      // 更新层级和路径
      await this.updateCategoryHierarchy(id, updateCategoryDto.parentId);
    }

    const updatedCategory = this.categoryRepository.merge(category, updateCategoryDto);
    return await this.categoryRepository.save(updatedCategory);
  }

  /**
   * 删除分类
   */
  async remove(id: number): Promise<boolean> {
    const category = await this.findOne(id);

    // 检查是否有子分类
    const childrenCount = await this.categoryRepository.count({
      where: { parentId: id }
    });

    if (childrenCount > 0) {
      throw new CustomException(ErrorCode.ERR_10001, '请先删除子分类');
    }

    // 检查是否有关联的商品（这里需要根据实际的商品表结构来实现）
    // if (category.productCount > 0) {
    //   throw new CustomException(ErrorCode.ERR_10001, '请先移除该分类下的商品');
    // }

    await this.categoryRepository.remove(category);
    return true;
  }

  /**
   * 移动分类位置
   */
  async move(id: number, moveCategoryDto: MoveCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    // 检查是否会形成循环引用
    if (moveCategoryDto.newParentId !== undefined) {
      if (await this.wouldCreateCircularReference(id, moveCategoryDto.newParentId)) {
        throw new CustomException(ErrorCode.ERR_10001, '不能将分类移动到其子分类下');
      }

      // 更新层级和路径
      await this.updateCategoryHierarchy(id, moveCategoryDto.newParentId);
    }

    // 更新排序权重
    if (moveCategoryDto.newSort !== undefined) {
      category.sort = moveCategoryDto.newSort;
    }

    return await this.categoryRepository.save(category);
  }

  /**
   * 更新分类状态
   */
  async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<Category> {
    const category = await this.findOne(id);
    category.status = updateStatusDto.status;

      await this.updateChildrenStatus(id, updateStatusDto.status);
    
    return await this.categoryRepository.save(category);
  }

  /**
   * 批量更新分类状态
   */
  async batchUpdateStatus(batchUpdateDto: BatchUpdateStatusDto): Promise<boolean> {
    const { ids, status } = batchUpdateDto;

    for (const id of ids) {
      // 检查分类是否存在
      await this.findOne(id);

        await this.updateChildrenStatus(id, status);
    
    }

    await this.categoryRepository.update(ids, { status });
    return true;
  }

  /**
   * 更新分类显示状态
   */
  async updateShowInNav(id: number, updateShowInNavDto: UpdateShowInNavDto): Promise<Category> {
    const category = await this.findOne(id);
    category.showInNav = updateShowInNavDto.showInNav;

    await this.updateChildrenShowInNav(id, updateShowInNavDto.showInNav);
    
    return await this.categoryRepository.save(category);
  }

  /**
   * 批量更新分类显示状态
   */
  async batchUpdateShowInNav(batchUpdateDto: BatchUpdateShowInNavDto): Promise<boolean> {
    const { ids, showInNav } = batchUpdateDto;

    for (const id of ids) {
      // 检查分类是否存在
      await this.findOne(id);

      await this.updateChildrenShowInNav(id, showInNav);
      
    }

    await this.categoryRepository.update(ids, { showInNav });
    return true;
  }

  /**
   * 获取顶级分类
   */
  async getTopLevelCategories(status?: number): Promise<Category[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .where('category.parentId IS NULL');

    if (status !== undefined) {
      queryBuilder.andWhere('category.status = :status', { status });
    }

    return await queryBuilder
      .orderBy('category.sort', 'DESC')
      .addOrderBy('category.createTime', 'ASC')
      .getMany();
  }

  /**
   * 获取分类的所有子分类（递归）
   */
  async getAllChildren(id: number): Promise<Category[]> {
    const children = await this.categoryRepository.find({
      where: { parentId: id }
    });

    let allChildren = [...children];

    for (const child of children) {
      const subChildren = await this.getAllChildren(child.id);
      allChildren = allChildren.concat(subChildren);
    }

    return allChildren;
  }

  /**
   * 检查分类名称是否存在（同一层级下）
   */
  private async checkNameExists(
    name: string, 
    parentId?: number, 
    excludeId?: number
  ): Promise<Category> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .where('category.name = :name', { name });

    if (parentId) {
      queryBuilder.andWhere('category.parentId = :parentId', { parentId });
    } else {
      queryBuilder.andWhere('category.parentId IS NULL');
    }

    if (excludeId) {
      queryBuilder.andWhere('category.id != :excludeId', { excludeId });
    }

    return await queryBuilder.getOne();
  }

  /**
   * 检查是否会形成循环引用
   */
  private async wouldCreateCircularReference(
    categoryId: number, 
    newParentId?: number
  ): Promise<boolean> {
    if (!newParentId || newParentId === categoryId) {
      return false;
    }

    // 获取所有子分类ID
    const allChildren = await this.getAllChildren(categoryId);
    const childrenIds = allChildren.map(child => child.id);

    return childrenIds.includes(newParentId);
  }

  /**
   * 更新分类层级结构
   */
  private async updateCategoryHierarchy(
    categoryId: number, 
    newParentId?: number
  ): Promise<void> {
    const category = await this.findOne(categoryId);
    
    let newLevel = 1;
    let newPath = '';

    if (newParentId) {
      const newParent = await this.findOne(newParentId);
      newLevel = newParent.level + 1;
      newPath = newParent.path ? `${newParent.path},${newParent.id}` : `${newParent.id}`;
    }

    // 更新当前分类
    await this.categoryRepository.update(categoryId, {
      parentId: newParentId,
      level: newLevel,
      path: newPath
    });

    // 递归更新所有子分类
    await this.updateChildrenHierarchy(categoryId, newLevel, newPath);
  }

  /**
   * 递归更新子分类的层级结构
   */
  private async updateChildrenHierarchy(
    parentId: number, 
    parentLevel: number, 
    parentPath: string
  ): Promise<void> {
    const children = await this.categoryRepository.find({
      where: { parentId }
    });

    for (const child of children) {
      const childLevel = parentLevel + 1;
      const childPath = parentPath ? `${parentPath},${parentId}` : `${parentId}`;

      await this.categoryRepository.update(child.id, {
        level: childLevel,
        path: childPath
      });

      // 递归更新子分类的子分类
      await this.updateChildrenHierarchy(child.id, childLevel, childPath);
    }
  }

  /**
   * 更新子分类状态（递归）
   */
  private async updateChildrenStatus(
    parentId: number, 
    status: number
  ): Promise<void> {
    const children = await this.categoryRepository.find({
      where: { parentId }
    });

    for (const child of children) {
      // 更新子分类状态
      await this.categoryRepository.update(child.id, { status });
      
      // 递归更新子分类的子分类
      await this.updateChildrenStatus(child.id, status);
    }
  }

  /**
   * 更新子分类显示状态（递归）
   */
  private async updateChildrenShowInNav(
    parentId: number, 
    showInNav: boolean
  ): Promise<void> {
    const children = await this.categoryRepository.find({
      where: { parentId }
    });

    for (const child of children) {
      // 更新子分类显示状态
      await this.categoryRepository.update(child.id, { showInNav });
      
      // 递归更新子分类的子分类
      await this.updateChildrenShowInNav(child.id, showInNav);
    }
  }

  /**
   * 构建树形结构
   */
  private buildTree(categories: Category[]): Category[] {
    const map = new Map<number, Category>();
    const roots: Category[] = [];

    // 创建ID到分类的映射
    categories.forEach(category => {
      map.set(category.id, { ...category, children: [] });
    });

    // 构建树形结构
    categories.forEach(category => {
      const node = map.get(category.id);
      if (category.parentId && map.has(category.parentId)) {
        const parent = map.get(category.parentId);
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  }
} 