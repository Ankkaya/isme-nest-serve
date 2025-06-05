import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { AttributeValue } from '../attribute-value/attribute-value.entity';

@Entity('attributes')
export class Attribute {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '属性ID' })
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: '属性名称' })
  @Index('idx_name')
  name: string;

  @Column({ type: 'text', nullable: true, comment: '属性描述' })
  description: string;

  @Column({ 
    type: 'int', 
    unsigned: true, 
    default: 0, 
    nullable: false, 
    comment: '排序权重' 
  })
  sort: number;

  @Column({ 
    type: 'tinyint', 
    width: 1,
    default: 1, 
    nullable: false, 
    comment: '状态（1=启用，0=禁用）' 
  })
  @Index('idx_status')
  status: number;

  // 时间戳
  @CreateDateColumn({ 
    type: 'timestamp', 
    comment: '创建时间' 
  })
  createTime: Date;

  @UpdateDateColumn({ 
    type: 'timestamp', 
    comment: '更新时间' 
  })
  updateTime: Date;

  // 关联属性值
  @OneToMany(() => AttributeValue, (attributeValue) => attributeValue.attribute)
  attributeValues: AttributeValue[];
} 