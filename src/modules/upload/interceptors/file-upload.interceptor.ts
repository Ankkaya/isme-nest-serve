import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  PayloadTooLargeException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

@Injectable()
export class FileSizeValidationInterceptor implements NestInterceptor {
  constructor(private readonly maxSize: number = 10 * 1024 * 1024) {} // 默认 10MB

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;
    const files = request.files;

    if (file && file.size > this.maxSize) {
      throw new PayloadTooLargeException(
        `文件大小不能超过 ${this.maxSize / 1024 / 1024}MB`,
      );
    }

    if (files && Array.isArray(files)) {
      for (const f of files) {
        if (f.size > this.maxSize) {
          throw new PayloadTooLargeException(
            `文件 "${f.originalname}" 大小不能超过 ${this.maxSize / 1024 / 1024}MB`,
          );
        }
      }
    }

    return next.handle();
  }
}

export const multerConfig: MulterOptions = {
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10, // 最多 10 个文件
  },
  fileFilter: (req, file, callback) => {
    callback(null, true);
  },
}; 