import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AttributeValue } from './attribute-value.entity';
import { Attribute } from '../attribute/attribute.entity';
import { 
  CreateAttributeValueDto, 
  UpdateAttributeValueDto, 
  QueryAttributeValueDto,
  BatchDeleteAttributeValueDto,
  BatchUpdateAttributeValueStatusDto
} from './dto';

@Injectable()
export class AttributeValueService {
  constructor(
    @InjectRepository(AttributeValue)
    private readonly attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {}

  /**
   * 创建商品属性值
   */
  async create(createAttributeValueDto: CreateAttributeValueDto): Promise<AttributeValue> {
    // 检查属性是否存在
    const attribute = await this.attributeRepository.findOne({
      where: { id: createAttributeValueDto.attributeId }
    });

    if (!attribute) {
      throw new NotFoundException('属性不存在');
    }

    // 检查同一属性下属性值是否重复
    const existingAttributeValue = await this.attributeValueRepository.findOne({
      where: { 
        attributeId: createAttributeValueDto.attributeId,
        value: createAttributeValueDto.value 
      }
    });

    if (existingAttributeValue) {
      throw new BadRequestException('该属性下已存在相同的属性值');
    }

    const attributeValue = this.attributeValueRepository.create({
      ...createAttributeValueDto,
      sort: createAttributeValueDto.sort ?? 0,
      status: createAttributeValueDto.status ?? 1,
    });

    return await this.attributeValueRepository.save(attributeValue);
  }

  /**
   * 查询属性值列表（分页）
   */
  async findAll(queryAttributeValueDto: QueryAttributeValueDto) {
    const { attributeId, value, status, page = 1, limit = 10 } = queryAttributeValueDto;
    
    const queryBuilder = this.attributeValueRepository.createQueryBuilder('attributeValue');
    
    // 关联属性信息
    queryBuilder.leftJoinAndSelect('attributeValue.attribute', 'attribute');
    
    // 条件查询
    if (attributeId) {
      queryBuilder.andWhere('attributeValue.attributeId = :attributeId', { attributeId });
    }
    
    if (value) {
      queryBuilder.andWhere('attributeValue.value LIKE :value', { value: `%${value}%` });
    }
    
    if (status !== undefined) {
      queryBuilder.andWhere('attributeValue.status = :status', { status });
    }

    // 分页
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);
    
    // 排序
    queryBuilder.orderBy('attributeValue.sort', 'ASC');
    queryBuilder.addOrderBy('attributeValue.createTime', 'DESC');

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
   * 根据ID查询属性值详情
   */
  async findOne(id: number): Promise<AttributeValue> {
    const attributeValue = await this.attributeValueRepository.findOne({
      where: { id },
      relations: ['attribute']
    });

    if (!attributeValue) {
      throw new NotFoundException('属性值不存在');
    }

    return attributeValue;
  }

  /**
   * 根据属性ID查询所有属性值
   */
  async findByAttributeId(attributeId: number): Promise<AttributeValue[]> {
    return await this.attributeValueRepository.find({
      where: { attributeId, status: 1 },
      order: { sort: 'DESC', createTime: 'DESC' }
    });
  }

  /**
   * 更新属性值
   */
  async update(id: number, updateAttributeValueDto: UpdateAttributeValueDto): Promise<AttributeValue> {
    const attributeValue = await this.findOne(id);

    // 如果更新属性ID，检查新属性是否存在
    if (updateAttributeValueDto.attributeId && updateAttributeValueDto.attributeId !== attributeValue.attributeId) {
      const attribute = await this.attributeRepository.findOne({
        where: { id: updateAttributeValueDto.attributeId }
      });

      if (!attribute) {
        throw new NotFoundException('目标属性不存在');
      }
    }

    // 如果更新属性值，检查是否重复
    if (updateAttributeValueDto.value && updateAttributeValueDto.value !== attributeValue.value) {
      const targetAttributeId = updateAttributeValueDto.attributeId ?? attributeValue.attributeId;
      const existingAttributeValue = await this.attributeValueRepository.findOne({
        where: { 
          attributeId: targetAttributeId,
          value: updateAttributeValueDto.value 
        }
      });

      if (existingAttributeValue) {
        throw new BadRequestException('该属性下已存在相同的属性值');
      }
    }

    Object.assign(attributeValue, updateAttributeValueDto);
    return await this.attributeValueRepository.save(attributeValue);
  }

  /**
   * 删除属性值
   */
  async remove(id: number): Promise<void> {
    const attributeValue = await this.findOne(id);
    await this.attributeValueRepository.remove(attributeValue);
  }

  /**
   * 批量删除属性值
   */
  async batchDelete(batchDeleteDto: BatchDeleteAttributeValueDto): Promise<void> {
    const { ids } = batchDeleteDto;
    
    const attributeValues = await this.attributeValueRepository.find({
      where: ids.map(id => ({ id }))
    });

    if (attributeValues.length !== ids.length) {
      throw new NotFoundException('部分属性值不存在');
    }

    await this.attributeValueRepository.remove(attributeValues);
  }

  /**
   * 批量更新状态
   */
  async batchUpdateStatus(batchUpdateStatusDto: BatchUpdateAttributeValueStatusDto): Promise<void> {
    const { ids, status } = batchUpdateStatusDto;
    
    const result = await this.attributeValueRepository.update(ids, { status });
    
    if (result.affected === 0) {
      throw new NotFoundException('没有找到要更新的属性值');
    }
  }

  /**
   * 根据多个属性ID批量查询属性值
   */
  async findByAttributeIds(attributeIds: number[]): Promise<AttributeValue[]> {
    if (attributeIds.length === 0) {
      return [];
    }

    return await this.attributeValueRepository.find({
      where: attributeIds.map(id => ({ attributeId: id, status: 1 })),
      order: { sort: 'DESC', createTime: 'DESC' },
      relations: ['attribute']
    });
  }

  /**
   * 根据属性值ID数组查询详情
   */
  async findByIds(ids: number[]): Promise<AttributeValue[]> {
    if (ids.length === 0) {
      return [];
    }

    return await this.attributeValueRepository.find({
      where: ids.map(id => ({ id })),
      relations: ['attribute']
    });
  }
} 