import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Attribute } from '../attribute/attribute.entity';

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '属性值ID' })
  id: number;

  @Column({ type: 'bigint', unsigned: true, nullable: false, comment: '属性ID' })
  @Index('idx_attribute_id')
  attributeId: number;

  @Column({ type: 'varchar', length: 255, nullable: false, comment: '属性值名称' })
  @Index('idx_value')
  value: string;

  @Column({ type: 'text', nullable: true, comment: '属性值描述' })
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

  // 关联属性
  @ManyToOne(() => Attribute, (attribute) => attribute.attributeValues)
  @JoinColumn({ name: 'attributeId' })
  attribute: Attribute;
} 