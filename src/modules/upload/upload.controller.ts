import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
  Body,
  Get,
  Query,
  Delete,
  Param,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  /**
   * 上传单个文件
   */
  @Post('single')
  @UseInterceptors(FileInterceptor('file'))
  async uploadSingle(
    @UploadedFile() file: Express.Multer.File,
    @Body('bucket') bucket?: string,
  ) {
    if (!file) {
      throw new HttpException('请选择要上传的文件', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.uploadService.uploadSingleFile(file, bucket);
      return {
        code: 200,
        message: '文件上传成功',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 上传多个文件
   */
  @Post('multiple')
  @UseInterceptors(FilesInterceptor('files', 10)) // 最多 10 个文件
  async uploadMultiple(
    @UploadedFiles() files: Express.Multer.File[],
    @Body('bucket') bucket?: string,
  ) {
    if (!files || files.length === 0) {
      throw new HttpException('请选择要上传的文件', HttpStatus.BAD_REQUEST);
    }

    try {
      const results = await this.uploadService.uploadMultipleFiles(files, bucket);
      return {
        code: 200,
        message: '文件上传成功',
        data: results,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 上传头像
   */
  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new HttpException('请选择头像文件', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.uploadService.uploadAvatar(file);
      return {
        code: 200,
        message: '头像上传成功',
        data: result,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  /**
   * 获取文件列表
   */
  @Get('list')
  async getFileList(
    @Query('bucket') bucket: string = 'uploads',
    @Query('prefix') prefix?: string,
  ) {
    try {
      const files = await this.uploadService.getFileList(bucket, prefix);
      return {
        code: 200,
        message: '获取文件列表成功',
        data: files,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 获取文件信息
   */
  @Get('info/:bucket/:fileName')
  async getFileInfo(
    @Param('bucket') bucket: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      const fileInfo = await this.uploadService.getFileInfo(bucket, fileName);
      return {
        code: 200,
        message: '获取文件信息成功',
        data: fileInfo,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * 删除文件
   */
  @Delete(':bucket/:fileName')
  async deleteFile(
    @Param('bucket') bucket: string,
    @Param('fileName') fileName: string,
  ) {
    try {
      await this.uploadService.deleteFile(bucket, fileName);
      return {
        code: 200,
        message: '文件删除成功',
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
} 