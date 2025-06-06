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
import { AttributeService } from './attribute.service';
import { 
  CreateAttributeDto, 
  UpdateAttributeDto, 
  QueryAttributeDto,
  BatchDeleteAttributeDto,
  BatchUpdateStatusDto
} from './dto';

@Controller('attributes')
export class AttributeController {
  constructor(private readonly attributeService: AttributeService) {}

  /**
   * 创建商品属性
   */
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createAttributeDto: CreateAttributeDto) {
    const attribute = await this.attributeService.create(createAttributeDto);
    return {
      code: 200,
      message: '创建成功',
      data: attribute
    };
  }

  /**
   * 查询属性列表
   */
  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() queryAttributeDto: QueryAttributeDto) {
    const result = await this.attributeService.findAll(queryAttributeDto);
    return {
      pageData: result.data,
        total: result.total,

    };
  }

  /**
   * 获取所有启用的属性（用于下拉选择）
   */
  @Get('enabled')
  async findAllEnabled() {
    const attributes = await this.attributeService.findAllEnabled();
    return {
      code: 200,
      message: '查询成功',
      data: attributes
    };
  }

  /**
   * 获取全部属性列表（不分页）
   */
  @Get('list')
  async findAllList(@Query('status') status?: string) {
    const statusNum = status !== undefined ? parseInt(status, 10) : undefined;
    const attributes = await this.attributeService.findAllList(statusNum);
    return  attributes
    
  }

  /**
   * 查询属性详情
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const attribute = await this.attributeService.findOne(id);
    return {
      code: 200,
      message: '查询成功',
      data: attribute
    };
  }

  /**
   * 更新属性
   */
  @Patch(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateAttributeDto: UpdateAttributeDto
  ) {
    const attribute = await this.attributeService.update(id, updateAttributeDto);
    return {
      code: 200,
      message: '更新成功',
      data: attribute
    };
  }

  /**
   * 删除属性
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.attributeService.remove(id);
    return {
      code: 200,
      message: '删除成功'
    };
  }

  /**
   * 批量删除属性
   */
  @Delete('batch/delete')
  @UsePipes(new ValidationPipe({ transform: true }))
  async batchDelete(@Body() batchDeleteDto: BatchDeleteAttributeDto) {
    await this.attributeService.batchDelete(batchDeleteDto);
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
  async batchUpdateStatus(@Body() batchUpdateStatusDto: BatchUpdateStatusDto) {
    await this.attributeService.batchUpdateStatus(batchUpdateStatusDto);
    return {
      code: 200,
      message: '批量更新状态成功'
    };
  }
} 