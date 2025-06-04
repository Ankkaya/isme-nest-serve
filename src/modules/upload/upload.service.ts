import { Injectable } from '@nestjs/common';
import { MinioService } from './minio.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UploadService {
  constructor(private readonly minioService: MinioService) {}

  /**
   * 上传单个文件
   * @param file 上传的文件
   * @param bucketName 桶名称，默认为 'uploads'
   */
  async uploadSingleFile(
    file: Express.Multer.File,
    bucketName: string = 'uploads',
  ): Promise<{
    originalName: string;
    fileName: string;
    url: string;
    size: number;
    mimetype: string;
  }> {
    try {
      // 生成唯一文件名
      const fileExtension = this.getFileExtension(file.originalname);
      const fileName = `${Date.now()}-${uuidv4()}${fileExtension}`;

      // 上传到 MinIO
      const url = await this.minioService.uploadFile(
        bucketName,
        fileName,
        file.buffer,
        file.size,
        file.mimetype,
      );

      return {
        originalName: file.originalname,
        fileName,
        url,
        size: file.size,
        mimetype: file.mimetype,
      };
    } catch (error) {
      throw new Error(`文件上传失败: ${error.message}`);
    }
  }

  /**
   * 上传多个文件
   * @param files 上传的文件数组
   * @param bucketName 桶名称，默认为 'uploads'
   */
  async uploadMultipleFiles(
    files: Express.Multer.File[],
    bucketName: string = 'uploads',
  ): Promise<Array<{
    originalName: string;
    fileName: string;
    url: string;
    size: number;
    mimetype: string;
  }>> {
    const uploadPromises = files.map((file) =>
      this.uploadSingleFile(file, bucketName),
    );

    return Promise.all(uploadPromises);
  }

  /**
   * 上传头像
   * @param file 头像文件
   */
  async uploadAvatar(file: Express.Multer.File): Promise<{
    originalName: string;
    fileName: string;
    url: string;
    size: number;
    mimetype: string;
  }> {
    // 验证文件类型
    if (!this.isValidImageType(file.mimetype)) {
      throw new Error('头像只支持 jpg、jpeg、png、gif 格式');
    }

    // 验证文件大小（5MB）
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('头像文件大小不能超过 5MB');
    }

    return this.uploadSingleFile(file, 'avatars');
  }

  /**
   * 删除文件
   * @param bucketName 桶名称
   * @param fileName 文件名
   */
  async deleteFile(bucketName: string, fileName: string): Promise<void> {
    try {
      await this.minioService.deleteFile(bucketName, fileName);
    } catch (error) {
      throw new Error(`删除文件失败: ${error.message}`);
    }
  }

  /**
   * 获取文件列表
   * @param bucketName 桶名称
   * @param prefix 文件名前缀
   */
  async getFileList(bucketName: string, prefix?: string): Promise<any[]> {
    try {
      return await this.minioService.listFiles(bucketName, prefix);
    } catch (error) {
      throw new Error(`获取文件列表失败: ${error.message}`);
    }
  }

  /**
   * 获取文件信息
   * @param bucketName 桶名称
   * @param fileName 文件名
   */
  async getFileInfo(bucketName: string, fileName: string): Promise<any> {
    try {
      return await this.minioService.getFileInfo(bucketName, fileName);
    } catch (error) {
      throw new Error(`获取文件信息失败: ${error.message}`);
    }
  }

  /**
   * 获取文件扩展名
   * @param filename 文件名
   */
  private getFileExtension(filename: string): string {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(lastDotIndex) : '';
  }

  /**
   * 验证是否为有效的图片类型
   * @param mimetype MIME 类型
   */
  private isValidImageType(mimetype: string): boolean {
    const validTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
    ];
    return validTypes.includes(mimetype);
  }

  /**
   * 验证文件类型
   * @param mimetype MIME 类型
   * @param allowedTypes 允许的类型数组
   */
  private isValidFileType(mimetype: string, allowedTypes: string[]): boolean {
    return allowedTypes.includes(mimetype);
  }
} 