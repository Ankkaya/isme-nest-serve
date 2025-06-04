import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '商品ID' })
  id: number;

  // 基础信息
  @Column({ type: 'varchar', length: 255, nullable: false, comment: '商品名称' })
  @Index('idx_name')
  name: string;

  @Column({ type: 'text', nullable: true, comment: '商品描述' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '主图URL' })
  image: string;

  // 价格信息
  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0.00, 
    nullable: false, 
    comment: '销售价格' 
  })
  price: number;

  @Column({ 
    type: 'decimal', 
    precision: 10, 
    scale: 2, 
    default: 0.00, 
    nullable: false, 
    comment: '成本价格' 
  })
  costPrice: number;

  // 销售数据
  @Column({ 
    type: 'int', 
    unsigned: true, 
    default: 0, 
    nullable: false, 
    comment: '库存数量' 
  })
  stock: number;

  @Column({ 
    type: 'int', 
    unsigned: true, 
    default: 0, 
    nullable: false, 
    comment: '累计销量' 
  })
  sales: number;

  // 状态控制
  @Column({ 
    type: 'tinyint', 
    width: 1,
    default: 1, 
    nullable: false, 
    comment: '商品状态（1=启动，0=禁用）' 
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
} 