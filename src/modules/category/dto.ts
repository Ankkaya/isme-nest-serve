import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsBoolean,
  Min,
  Max,
  Length,
  IsUrl,
  IsArray,
  IsInt,
  IsIn,
  ArrayNotEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateCategoryDto {
  @IsString({ message: '分类名称必须是字符串' })
  @IsNotEmpty({ message: '分类名称不能为空' })
  @Length(1, 100, { message: '分类名称长度必须在1-100个字符之间' })
  name: string;

  @IsOptional()
  @IsString({ message: '分类描述必须是字符串' })
  @Length(0, 500, { message: '分类描述长度不能超过500个字符' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: '分类图标URL格式不正确' })
  icon?: string;

  @IsOptional()
  @IsUrl({}, { message: '分类图片URL格式不正确' })
  image?: string;

  @IsOptional()
  @IsInt({ message: '父级分类ID必须是整数' })
  @Min(1, { message: '父级分类ID必须大于0' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  parentId?: number;

  @IsOptional()
  @IsInt({ message: '排序权重必须是整数' })
  @Min(0, { message: '排序权重不能小于0' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  sort?: number;

  @IsOptional()
  @IsBoolean({ message: '是否显示在导航中必须是布尔值' })
  @IsOptional()
  showInNav?: boolean;

  @IsOptional()
  @IsInt({ message: '分类状态必须是整数' })
  @IsIn([0, 1], { message: '分类状态只能是0（禁用）或1（启用）' })
  status?: number;
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString({ message: '分类名称必须是字符串' })
  @Length(1, 100, { message: '分类名称长度必须在1-100个字符之间' })
  name?: string;

  @IsOptional()
  @IsString({ message: '分类描述必须是字符串' })
  @Length(0, 500, { message: '分类描述长度不能超过500个字符' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: '分类图标URL格式不正确' })
  icon?: string;

  @IsOptional()
  @IsUrl({}, { message: '分类图片URL格式不正确' })
  image?: string;

  @IsOptional()
  @IsInt({ message: '父级分类ID必须是整数' })
  @Min(1, { message: '父级分类ID必须大于0' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  parentId?: number;

  @IsOptional()
  @IsInt({ message: '排序权重必须是整数' })
  @Min(0, { message: '排序权重不能小于0' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  sort?: number;

  @IsOptional()
  @IsBoolean({ message: '是否显示在导航中必须是布尔值' })
  @IsOptional()
  showInNav?: boolean;

  @IsOptional()
  @IsInt({ message: '分类状态必须是整数' })
  @IsIn([0, 1], { message: '分类状态只能是0（禁用）或1（启用）' })
  status?: number;
}

export class GetCategoryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '页码必须是整数' })
  @Min(1, { message: '页码不能小于1' })
  pageNo?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '每页条数必须是整数' })
  @Min(1, { message: '每页条数不能小于1' })
  @Max(100, { message: '每页条数不能超过100' })
  pageSize?: number;

  @IsOptional()
  @IsString({ message: '分类名称必须是字符串' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分类状态必须是整数' })
  @IsIn([0, 1], { message: '分类状态只能是0（禁用）或1（启用）' })
  status?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '父级分类ID必须是整数' })
  @Min(0, { message: '父级分类ID不能小于0' })
  parentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分类层级必须是整数' })
  @Min(1, { message: '分类层级不能小于1' })
  @Max(5, { message: '分类层级不能超过5' })
  level?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: '是否显示在导航中必须是布尔值' })
  showInNav?: boolean;
}

export class MoveCategoryDto {
  @IsOptional()
  @IsInt({ message: '新父级分类ID必须是整数' })
  @Min(1, { message: '新父级分类ID必须大于0' })
  @Transform(({ value }) => value ? parseInt(value) : null)
  newParentId?: number;

  @IsOptional()
  @IsInt({ message: '新排序权重必须是整数' })
  @Min(0, { message: '新排序权重不能小于0' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  newSort?: number;
}

export class UpdateStatusDto {
  @IsInt({ message: '分类状态必须是整数' })
  @IsIn([0, 1], { message: '分类状态只能是0（禁用）或1（启用）' })
  status: number;
}

export class BatchUpdateStatusDto {
  @IsArray({ message: 'ids必须是数组' })
  @ArrayNotEmpty({ message: 'ids数组不能为空' })
  @IsInt({ each: true, message: 'ids数组中的每个元素必须是整数' })
  ids: number[];

  @IsInt({ message: '分类状态必须是整数' })
  @IsIn([0, 1], { message: '分类状态只能是0（禁用）或1（启用）' })
  status: number;
}

export class CategoryTreeDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '最大层级必须是整数' })
  @Min(1, { message: '最大层级不能小于1' })
  @Max(5, { message: '最大层级不能超过5' })
  maxLevel?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '分类状态必须是整数' })
  @IsIn([0, 1], { message: '分类状态只能是0（禁用）或1（启用）' })
  status?: number;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: '是否显示在导航中必须是布尔值' })
  showInNav?: boolean;

  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean({ message: '是否包含商品数量必须是布尔值' })
  includeProductCount?: boolean;
}

export class UpdateShowInNavDto {
  @IsBoolean({ message: '是否显示在导航中必须是布尔值' })
  showInNav: boolean;
}

export class BatchUpdateShowInNavDto {
  @IsArray({ message: 'ids必须是数组' })
  @ArrayNotEmpty({ message: 'ids数组不能为空' })
  @IsInt({ each: true, message: 'ids数组中的每个元素必须是整数' })
  ids: number[];

  @IsBoolean({ message: '是否显示在导航中必须是布尔值' })
  showInNav: boolean;
} 