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
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  GetCategoryDto,
  MoveCategoryDto,
  UpdateStatusDto,
  BatchUpdateStatusDto,
  CategoryTreeDto,
  UpdateShowInNavDto,
  BatchUpdateShowInNavDto,
} from './dto';
import { JwtGuard, PreviewGuard, RoleGuard } from '@/common/guards';
import { Roles } from '@/common/decorators/roles.decorator';

@Controller('category')
@UseGuards(JwtGuard, RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  /**
   * 创建分类
   */
  @Post()
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  /**
   * 获取分类列表（分页查询）
   */
  @Get()
  findAll(@Query() query: GetCategoryDto) {
    return this.categoryService.findAll(query);
  }

  /**
   * 获取分类树形结构
   */
  @Get('tree')
  getTree(@Query() query: CategoryTreeDto) {
    return this.categoryService.getTree(query);
  }

  /**
   * 获取顶级分类
   */
  @Get('top-level')
  getTopLevelCategories(@Query('status') status?: string) {
    return this.categoryService.getTopLevelCategories(status as any);
  }

  /**
   * 获取分类详情
   */
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.findOne(id);
  }

  /**
   * 获取分类的所有子分类
   */
  @Get(':id/children')
  getAllChildren(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getAllChildren(id);
  }

  /**
   * 更新分类信息
   */
  @Patch(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  /**
   * 移动分类位置
   */
  @Patch(':id/move')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  move(
    @Param('id', ParseIntPipe) id: number,
    @Body() moveCategoryDto: MoveCategoryDto,
  ) {
    return this.categoryService.move(id, moveCategoryDto);
  }

  /**
   * 更新分类状态
   */
  @Patch(':id/status')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
  ) {
    return this.categoryService.updateStatus(id, updateStatusDto);
  }

  /**
   * 批量更新分类状态
   */
  @Patch('batch/status')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  batchUpdateStatus(@Body() batchUpdateDto: BatchUpdateStatusDto) {
    return this.categoryService.batchUpdateStatus(batchUpdateDto);
  }

  /**
   * 更新分类显示状态
   */
  @Patch(':id/show-in-nav')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  updateShowInNav(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateShowInNavDto: UpdateShowInNavDto,
  ) {
    return this.categoryService.updateShowInNav(id, updateShowInNavDto);
  }

  /**
   * 批量更新分类显示状态
   */
  @Patch('batch/show-in-nav')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN', 'SYS_ADMIN')
  batchUpdateShowInNav(@Body() batchUpdateDto: BatchUpdateShowInNavDto) {
    return this.categoryService.batchUpdateShowInNav(batchUpdateDto);
  }

  /**
   * 删除分类
   */
  @Delete(':id')
  @UseGuards(PreviewGuard)
  @Roles('SUPER_ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.remove(id);
  }
} 