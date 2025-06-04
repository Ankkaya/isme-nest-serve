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
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProductService } from './product.service';
import {
  CreateProductDto,
  UpdateProductDto,
  GetProductDto,
  UpdateStockDto,
  UpdateStatusDto,
} from './dto';
import { Product } from './product.entity';
import { JwtGuard, PreviewGuard, RoleGuard } from '@/common/guards';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('product')
@UseGuards(JwtGuard, RoleGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  /**
   * 创建商品
   */
  @Post()
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  /**
   * 获取商品列表（分页查询）
   */
  @Get()
  findAll(@Query() query: GetProductDto) {
    return this.productService.findAll(query);
  }

  /**
   * 获取商品详情
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productService.findOne(id);
  }

  /**
   * 更新商品信息
   */
  @Patch(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateProductDto);
  }

  /**
   * 删除商品
   */
  @Delete(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productService.remove(id);
  }

  /**
   * 更新商品库存
   */
  @Patch(':id/stock')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  updateStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStockDto: UpdateStockDto,
  ) {
    return this.productService.updateStock(id, updateStockDto);
  }

  /**
   * 更新商品状态
   */
  @Patch(':id/status')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.productService.updateStatus(id, updateStatusDto);
  }

  /**
   * 批量更新商品状态
   */
  @Patch('batch-status')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  batchUpdateStatus(
    @Body() body: { ids: number[]; status: number },
  ) {
    return this.productService.batchUpdateStatus(body.ids, body.status);
  }

  /**
   * 减少库存（下单时调用）
   */
  @Patch(':id/decrease-stock')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN', 'USER')
  decreaseStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { quantity: number },
  ) {
    return this.productService.decreaseStock(id, body.quantity);
  }

  /**
   * 增加库存（退货时调用）
   */
  @Patch(':id/increase-stock')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  increaseStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { quantity: number },
  ) {
    return this.productService.increaseStock(id, body.quantity);
  }

  /**
   * 获取热销商品
   */
  @Get('statistics/hot')
  getHotProducts(@Query('limit', ParseIntPipe) limit: number = 10) {
    return this.productService.getHotProducts(limit);
  }

  /**
   * 获取库存不足的商品
   */
  @Get('statistics/low-stock')
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  getLowStockProducts(@Query('threshold', ParseIntPipe) threshold: number = 10) {
    return this.productService.getLowStockProducts(threshold);
  }
} 