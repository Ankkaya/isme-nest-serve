import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn({ type: 'bigint', unsigned: true, comment: '分类ID' })
  id: number;

  // 基础信息
  @Column({ type: 'varchar', length: 100, nullable: false, comment: '分类名称' })
  @Index('idx_name')
  name: string;

  @Column({ type: 'varchar', length: 500, nullable: true, comment: '分类描述' })
  description: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '分类图标URL' })
  icon: string;

  @Column({ type: 'varchar', length: 255, nullable: true, comment: '分类图片URL' })
  image: string;

  // 层级关系
  @Column({ 
    type: 'bigint', 
    unsigned: true, 
    nullable: true, 
    comment: '父级分类ID' 
  })
  @Index('idx_parent_id')
  parentId: number;

  @ManyToOne(() => Category, (category) => category.children)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent)
  children: Category[];

  @Column({ 
    type: 'int', 
    unsigned: true, 
    default: 1, 
    nullable: false, 
    comment: '分类层级（1为顶级）' 
  })
  @Index('idx_level')
  level: number;

  @Column({ 
    type: 'varchar', 
    length: 500, 
    nullable: true, 
    comment: '分类路径（如：1,2,3）' 
  })
  path: string;

  // 排序与显示
  @Column({ 
    type: 'int', 
    unsigned: true, 
    default: 0, 
    nullable: false, 
    comment: '排序权重（数字越大越靠前）' 
  })
  @Index('idx_sort')
  sort: number;

  @Column({ 
    type: 'boolean', 
    default: true, 
    nullable: false, 
    comment: '是否显示在导航中' 
  })
  showInNav: boolean;

  // 状态控制
  @Column({ 
    type: 'tinyint', 
    width: 1,
    default: 1, 
    nullable: false, 
    comment: '分类状态（1=启用，0=禁用）' 
  })
  @Index('idx_status')
  status: number;

  // 统计信息
  @Column({ 
    type: 'int', 
    unsigned: true, 
    default: 0, 
    nullable: false, 
    comment: '商品数量' 
  })
  productCount: number;

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