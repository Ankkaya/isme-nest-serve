import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { MinioService } from './minio.service';

describe('UploadModule', () => {
  let controller: UploadController;
  let service: UploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
      ],
      controllers: [UploadController],
      providers: [UploadService, MinioService],
    }).compile();

    controller = module.get<UploadController>(UploadController);
    service = module.get<UploadService>(UploadService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('UploadController', () => {
    it('should be defined', () => {
      expect(controller).toBeDefined();
    });
  });

  describe('UploadService', () => {
    it('should be defined', () => {
      expect(service).toBeDefined();
    });
  });
}); 