import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  ParseIntPipe,
  ValidationPipe,
  UsePipes
} from '@nestjs/common';
import { AttributeValueService } from './attribute-value.service';
import { 
  CreateAttributeValueDto, 
  UpdateAttributeValueDto, 
  QueryAttributeValueDto,
  BatchDeleteAttributeValueDto,
  BatchUpdateAttributeValueStatusDto
} from './dto';

@Controller('attribute-values')
export class AttributeValueController {
  constructor(private readonly attributeValueService: AttributeValueService) {}

  /**
   * 创建商品属性值
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAttributeValueDto: CreateAttributeValueDto) {
    const attributeValue = await this.attributeValueService.create(createAttributeValueDto);
    return {
      code: 200,
      message: '创建成功',
      data: attributeValue
    };
  }

  /**
   * 查询属性值列表
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() queryAttributeValueDto: QueryAttributeValueDto) {
    const result = await this.attributeValueService.findAll(queryAttributeValueDto);
    return {
      pageData: result.data,
      total: result.total,
    };
  }

  /**
   * 根据属性ID查询属性值
   */
  @Get('attribute/:attributeId')
  async findByAttributeId(@Param('attributeId', ParseIntPipe) attributeId: number) {
    const attributeValues = await this.attributeValueService.findByAttributeId(attributeId);
    return {
      code: 200,
      message: '查询成功',
      data: attributeValues
    };
  }

  /**
   * 查询属性值详情
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const attributeValue = await this.attributeValueService.findOne(id);
    return {
      code: 200,
      message: '查询成功',
      data: attributeValue
    };
  }

  /**
   * 更新属性值
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAttributeValueDto: UpdateAttributeValueDto
  ) {
    const attributeValue = await this.attributeValueService.update(id, updateAttributeValueDto);
    return {
      code: 200,
      message: '更新成功',
      data: attributeValue
    };
  }

  /**
   * 删除属性值
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.attributeValueService.remove(id);
    return {
      code: 200,
      message: '删除成功'
    };
  }

  /**
   * 批量删除属性值
   */
  @Delete('batch/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  async batchDelete(@Body() batchDeleteDto: BatchDeleteAttributeValueDto) {
    await this.attributeValueService.batchDelete(batchDeleteDto);
    return {
      code: 200,
      message: '批量删除成功'
    };
  }

  /**
   * 批量更新状态
   */
  @Patch('batch/status')
  @UsePipes(new ValidationPipe({ transform: true }))
  async batchUpdateStatus(@Body() batchUpdateStatusDto: BatchUpdateAttributeValueStatusDto) {
    await this.attributeValueService.batchUpdateStatus(batchUpdateStatusDto);
    return {
      code: 200,
      message: '批量更新状态成功'
    };
  }
} 