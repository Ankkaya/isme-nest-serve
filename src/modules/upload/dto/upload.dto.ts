import { IsString, IsOptional, IsArray } from 'class-validator';

export class UploadFileDto {
  @IsString()
  @IsOptional()
  bucket?: string;
}

export class FileResponseDto {
  originalName: string;
  fileName: string;
  url: string;
  size: number;
  mimetype: string;
}

export class UploadResponseDto {
  code: number;
  message: string;
  data: FileResponseDto | FileResponseDto[];
}

export class FileListQueryDto {
  @IsString()
  @IsOptional()
  bucket?: string = 'uploads';

  @IsString()
  @IsOptional()
  prefix?: string;
}

export class DeleteFileDto {
  @IsString()
  bucket: string;

  @IsString()
  fileName: string;
} 