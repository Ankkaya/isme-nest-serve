import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsEnum,
  IsPositive,
  Min,
  Max,
  Length,
  IsUrl,
  IsInt,
  IsIn,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

/**
 * 创建商品DTO
 */
export class CreateProductDto {
  @IsString({ message: '商品名称必须是字符串' })
  @IsNotEmpty({ message: '商品名称不能为空' })
  @Length(1, 255, { message: '商品名称长度必须在1-255个字符之间' })
  name: string;

  @IsOptional()
  @IsString({ message: '商品描述必须是字符串' })
  @Length(0, 1000, { message: '商品描述长度不能超过1000个字符' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: '主图URL格式不正确' })
  image?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: '销售价格必须是数字且最多保留2位小数' })
  @IsPositive({ message: '销售价格必须大于0' })
  @Transform(({ value }) => parseFloat(value))
  price: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '成本价格必须是数字且最多保留2位小数' })
  @Min(0, { message: '成本价格不能小于0' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  costPrice?: number;

  @IsOptional()
  @IsInt({ message: '库存数量必须是整数' })
  @Min(0, { message: '库存数量不能小于0' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  stock?: number;

  @IsOptional()
  @IsInt({ message: '商品状态必须是整数' })
  @IsIn([0, 1], { message: '商品状态只能是0（禁用）或1（启动）' })
  status?: number;
}

/**
 * 更新商品DTO
 */
export class UpdateProductDto {
  @IsOptional()
  @IsString({ message: '商品名称必须是字符串' })
  @Length(1, 255, { message: '商品名称长度必须在1-255个字符之间' })
  name?: string;

  @IsOptional()
  @IsString({ message: '商品描述必须是字符串' })
  @Length(0, 1000, { message: '商品描述长度不能超过1000个字符' })
  description?: string;

  @IsOptional()
  @IsUrl({}, { message: '主图URL格式不正确' })
  image?: string;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '销售价格必须是数字且最多保留2位小数' })
  @IsPositive({ message: '销售价格必须大于0' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  price?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 }, { message: '成本价格必须是数字且最多保留2位小数' })
  @Min(0, { message: '成本价格不能小于0' })
  @Transform(({ value }) => parseFloat(value))
  @IsOptional()
  costPrice?: number;

  @IsOptional()
  @IsInt({ message: '库存数量必须是整数' })
  @Min(0, { message: '库存数量不能小于0' })
  @Transform(({ value }) => parseInt(value))
  @IsOptional()
  stock?: number;

  @IsOptional()
  @IsInt({ message: '商品状态必须是整数' })
  @IsIn([0, 1], { message: '商品状态只能是0（禁用）或1（启动）' })
  @IsOptional()
  status?: number;
}

/**
 * 查询商品DTO
 */
export class GetProductDto {
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
  @IsString({ message: '商品名称必须是字符串' })
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '商品状态必须是整数' })
  @IsIn([0, 1], { message: '商品状态只能是0（禁用）或1（启动）' })
  status?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '最低价格必须是数字' })
  @Min(0, { message: '最低价格不能小于0' })
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: '最高价格必须是数字' })
  @Min(0, { message: '最高价格不能小于0' })
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '最低库存必须是整数' })
  @Min(0, { message: '最低库存不能小于0' })
  minStock?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: '最高库存必须是整数' })
  @Min(0, { message: '最高库存不能小于0' })
  maxStock?: number;
}

/**
 * 更新库存DTO
 */
export class UpdateStockDto {
  @IsInt({ message: '库存数量必须是整数' })
  @Min(0, { message: '库存数量不能小于0' })
  @Transform(({ value }) => parseInt(value))
  stock: number;
}

/**
 * 更新状态DTO
 */
export class UpdateStatusDto {
  @IsInt({ message: '商品状态必须是整数' })
  @IsIn([0, 1], { message: '商品状态只能是0（禁用）或1（启动）' })
  status: number;
} 