import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Attribute } from './attribute.entity';
import { 
  CreateAttributeDto, 
  UpdateAttributeDto, 
  QueryAttributeDto,
  BatchDeleteAttributeDto,
  BatchUpdateStatusDto
} from './dto';

@Injectable()
export class AttributeService {
  constructor(
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {}

  /**
   * 创建商品属性
   */
  async create(createAttributeDto: CreateAttributeDto): Promise<Attribute> {
    // 检查属性名称是否已存在
    const existingAttribute = await this.attributeRepository.findOne({
      where: { name: createAttributeDto.name }
    });

    if (existingAttribute) {
      throw new BadRequestException('属性名称已存在');
    }

    const attribute = this.attributeRepository.create({
      ...createAttributeDto,
      sort: createAttributeDto.sort ?? 0,
      status: createAttributeDto.status ?? 1,
    });

    return await this.attributeRepository.save(attribute);
  }

  /**
   * 查询属性列表（分页）
   */
  async findAll(queryAttributeDto: QueryAttributeDto) {
    const { name, status, valueStatus, page = 1, limit = 10 } = queryAttributeDto;
    
    const queryBuilder = this.attributeRepository.createQueryBuilder('attribute');
    
    // 条件查询
    if (name) {
      queryBuilder.andWhere('attribute.name LIKE :name', { name: `%${name}%` });
    }
    
    if (status !== undefined) {
      queryBuilder.andWhere('attribute.status = :status', { status });
    }

    // 关联查询属性值
    if (valueStatus !== undefined) {
      // 如果指定了属性值状态，只关联该状态的属性值
      queryBuilder.leftJoinAndSelect('attribute.attributeValues', 'attributeValue', 'attributeValue.status = :valueStatus');
      // 筛选包含该状态属性值的属性
      queryBuilder.andWhere('EXISTS (SELECT 1 FROM attribute_values av WHERE av.attributeId = attribute.id AND av.status = :valueStatus)', { valueStatus });
    } else {
      // 如果没有指定属性值状态，关联所有属性值
      queryBuilder.leftJoinAndSelect('attribute.attributeValues', 'attributeValue');
    }

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    
    // 排序
    queryBuilder.orderBy('attribute.sort', 'ASC');
    queryBuilder.addOrderBy('attribute.createTime', 'DESC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * 根据ID查询属性详情
   */
  async findOne(id: number): Promise<Attribute> {
    const attribute = await this.attributeRepository.findOne({
      where: { id },
      relations: ['attributeValues']
    });

    if (!attribute) {
      throw new NotFoundException('属性不存在');
    }

    return attribute;
  }

  /**
   * 更新属性
   */
  async update(id: number, updateAttributeDto: UpdateAttributeDto): Promise<Attribute> {
    const attribute = await this.findOne(id);

    // 如果更新名称，检查是否重复
    if (updateAttributeDto.name && updateAttributeDto.name !== attribute.name) {
      const existingAttribute = await this.attributeRepository.findOne({
        where: { name: updateAttributeDto.name }
      });

      if (existingAttribute) {
        throw new BadRequestException('属性名称已存在');
      }
    }

    Object.assign(attribute, updateAttributeDto);
    return await this.attributeRepository.save(attribute);
  }

  /**
   * 删除属性
   */
  async remove(id: number): Promise<void> {
    const attribute = await this.findOne(id);
    
    // 检查是否有关联的属性值
    if (attribute.attributeValues && attribute.attributeValues.length > 0) {
      throw new BadRequestException('该属性下还有属性值，无法删除');
    }

    await this.attributeRepository.remove(attribute);
  }

  /**
   * 批量删除属性
   */
  async batchDelete(batchDeleteDto: BatchDeleteAttributeDto): Promise<void> {
    const { ids } = batchDeleteDto;
    
    // 查询要删除的属性
    const attributes = await this.attributeRepository.find({
      where: ids.map(id => ({ id })),
      relations: ['attributeValues']
    });

    if (attributes.length !== ids.length) {
      throw new NotFoundException('部分属性不存在');
    }

    // 检查是否有属性包含属性值
    const attributesWithValues = attributes.filter(attr => 
      attr.attributeValues && attr.attributeValues.length > 0
    );

    if (attributesWithValues.length > 0) {
      const names = attributesWithValues.map(attr => attr.name).join('、');
      throw new BadRequestException(`属性 ${names} 下还有属性值，无法删除`);
    }

    await this.attributeRepository.remove(attributes);
  }

  /**
   * 批量更新状态
   */
  async batchUpdateStatus(batchUpdateStatusDto: BatchUpdateStatusDto): Promise<void> {
    const { ids, status } = batchUpdateStatusDto;
    
    const result = await this.attributeRepository.update(ids, { status });
    
    if (result.affected === 0) {
      throw new NotFoundException('没有找到要更新的属性');
    }
  }

  /**
   * 获取所有启用的属性（用于下拉选择）
   */
  async findAllEnabled(): Promise<Attribute[]> {
    return await this.attributeRepository.find({
      where: { status: 1 },
      order: { sort: 'DESC', createTime: 'DESC' },
      relations: ['attributeValues']
    });
  }

  /**
   * 获取全部属性列表（不分页）
   */
  async findAllList(status?: number): Promise<Attribute[]> {
    const whereCondition = status !== undefined ? { status } : {};
    
    return await this.attributeRepository.find({
      where: whereCondition,
      order: { sort: 'DESC', createTime: 'DESC' },
      relations: ['attributeValues']
    });
  }
} 