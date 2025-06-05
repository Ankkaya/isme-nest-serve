import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttributeValueService } from './attribute-value.service';
import { AttributeValueController } from './attribute-value.controller';
import { AttributeValue } from './attribute-value.entity';
import { Attribute } from '../attribute/attribute.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AttributeValue, Attribute])],
  controllers: [AttributeValueController],
  providers: [AttributeValueService],
  exports: [AttributeValueService],
})
export class AttributeValueModule {} 