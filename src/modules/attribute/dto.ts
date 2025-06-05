import { IsString, IsOptional, IsNumber, IsArray, IsNotEmpty, Min, Max } from 'class-validator';
import { Transform } from 'class-transformer';

// 创建属性DTO
export class CreateAttributeDto {
  @IsString()
  @IsNotEmpty({ message: '属性名称不能为空' })
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: '排序权重必须是数字' })
  @Min(0, { message: '排序权重不能小于0' })
  @IsOptional()
  sort?: number;

  @IsNumber({}, { message: '状态必须是数字' })
  @Min(0, { message: '状态最小值为0' })
  @Max(1, { message: '状态最大值为1' })
  @IsOptional()
  status?: number;
}

// 更新属性DTO
export class UpdateAttributeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber({}, { message: '排序权重必须是数字' })
  @Min(0, { message: '排序权重不能小于0' })
  @IsOptional()
  sort?: number;

  @IsNumber({}, { message: '状态必须是数字' })
  @Min(0, { message: '状态最小值为0' })
  @Max(1, { message: '状态最大值为1' })
  @IsOptional()
  status?: number;
}

// 查询属性DTO
export class QueryAttributeDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsNumber({}, { message: '状态必须是数字' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  status?: number;

  @IsNumber({}, { message: '页码必须是数字' })
  @Min(1, { message: '页码最小值为1' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsNumber({}, { message: '每页数量必须是数字' })
  @Min(1, { message: '每页数量最小值为1' })
  @Max(100, { message: '每页数量最大值为100' })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}

// 批量操作DTO
export class BatchOperationDto {
  @IsArray({ message: 'ids必须是数组' })
  @IsNumber({}, { each: true, message: 'id必须是数字' })
  ids: number[];
}

// 批量删除DTO
export class BatchDeleteAttributeDto extends BatchOperationDto {}

// 批量更新状态DTO
export class BatchUpdateStatusDto extends BatchOperationDto {
  @IsNumber({}, { message: '状态必须是数字' })
  @Min(0, { message: '状态最小值为0' })
  @Max(1, { message: '状态最大值为1' })
  status: number;
} 