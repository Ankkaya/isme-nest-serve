import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as Minio from 'minio';

@Injectable()
export class MinioService {
  private minioClient: Minio.Client;

  constructor(private configService: ConfigService) {
    this.minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_ENDPOINT', 'localhost'),
      port: this.configService.get<number>('MINIO_PORT', 9000),
      useSSL: this.configService.get<boolean>('MINIO_USE_SSL', false),
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY', 'minioadmin'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY', 'minioadmin'),
    });
  }

  /**
   * 上传文件到 MinIO
   * @param bucketName 桶名称
   * @param objectName 对象名称
   * @param buffer 文件缓冲区
   * @param size 文件大小
   * @param contentType 文件类型
   */
  async uploadFile(
    bucketName: string,
    objectName: string,
    buffer: Buffer,
    size: number,
    contentType?: string,
  ): Promise<string> {
    try {
      // 检查桶是否存在，不存在则创建
      const bucketExists = await this.minioClient.bucketExists(bucketName);
      if (!bucketExists) {
        await this.minioClient.makeBucket(bucketName, 'us-east-1');
      }

      // 上传文件
      await this.minioClient.putObject(
        bucketName,
        objectName,
        buffer,
        size,
        contentType ? { 'Content-Type': contentType } : undefined,
      );

      // 返回文件访问 URL
      return await this.getFileUrl(bucketName, objectName);
    } catch (error) {
      throw new Error(`文件上传失败: ${error.message}`);
    }
  }

  /**
   * 获取文件访问 URL
   * @param bucketName 桶名称
   * @param objectName 对象名称
   * @param expiry 过期时间（秒），默认为 7 天
   */
  async getFileUrl(
    bucketName: string,
    objectName: string,
    expiry: number = 7 * 24 * 60 * 60,
  ): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(
        bucketName,
        objectName,
        expiry,
      );
    } catch (error) {
      throw new Error(`获取文件 URL 失败: ${error.message}`);
    }
  }

  /**
   * 删除文件
   * @param bucketName 桶名称
   * @param objectName 对象名称
   */
  async deleteFile(bucketName: string, objectName: string): Promise<void> {
    try {
      await this.minioClient.removeObject(bucketName, objectName);
    } catch (error) {
      throw new Error(`删除文件失败: ${error.message}`);
    }
  }

  /**
   * 列出桶中的文件
   * @param bucketName 桶名称
   * @param prefix 文件名前缀
   */
  async listFiles(bucketName: string, prefix?: string): Promise<any[]> {
    try {
      const files = [];
      const stream = this.minioClient.listObjects(bucketName, prefix, true);
      
      return new Promise((resolve, reject) => {
        stream.on('data', (obj) => files.push(obj));
        stream.on('error', reject);
        stream.on('end', () => resolve(files));
      });
    } catch (error) {
      throw new Error(`列出文件失败: ${error.message}`);
    }
  }

  /**
   * 获取文件信息
   * @param bucketName 桶名称
   * @param objectName 对象名称
   */
  async getFileInfo(bucketName: string, objectName: string): Promise<any> {
    try {
      return await this.minioClient.statObject(bucketName, objectName);
    } catch (error) {
      throw new Error(`获取文件信息失败: ${error.message}`);
    }
  }
} 