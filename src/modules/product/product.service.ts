import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Between } from 'typeorm';
import { Product } from './product.entity';
import { 
  CreateProductDto, 
  UpdateProductDto, 
  GetProductDto, 
  UpdateStockDto, 
  UpdateStatusDto 
} from './dto';
import { CustomException, ErrorCode } from '@/common/exceptions/custom.exception';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  /**
   * 创建商品
   */
  async create(createProductDto: CreateProductDto): Promise<Product> {
    // 检查商品名称是否已存在
    const existingProduct = await this.productRepository.findOne({
      where: { name: createProductDto.name },
    });

    if (existingProduct) {
      throw new CustomException(ErrorCode.ERR_10001, '商品名称已存在');
    }

    const product = this.productRepository.create({
      ...createProductDto,
      costPrice: createProductDto.costPrice || 0,
      stock: createProductDto.stock || 0,
      status: createProductDto.status || 1,
    });

    return await this.productRepository.save(product);
  }

  /**
   * 分页查询商品列表
   */
  async findAll(query: GetProductDto) {
    const { pageNo = 1, pageSize = 10, name, status, minPrice, maxPrice, minStock, maxStock } = query;

    const queryBuilder = this.productRepository.createQueryBuilder('product');

    // 名称模糊查询
    if (name) {
      queryBuilder.andWhere('product.name LIKE :name', { name: `%${name}%` });
    }

    // 状态筛选
    if (status) {
      queryBuilder.andWhere('product.status = :status', { status });
    }

    // 价格范围筛选
    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere('product.price BETWEEN :minPrice AND :maxPrice', { 
        minPrice, 
        maxPrice 
      });
    } else if (minPrice !== undefined) {
      queryBuilder.andWhere('product.price >= :minPrice', { minPrice });
    } else if (maxPrice !== undefined) {
      queryBuilder.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    // 库存范围筛选
    if (minStock !== undefined && maxStock !== undefined) {
      queryBuilder.andWhere('product.stock BETWEEN :minStock AND :maxStock', { 
        minStock, 
        maxStock 
      });
    } else if (minStock !== undefined) {
      queryBuilder.andWhere('product.stock >= :minStock', { minStock });
    } else if (maxStock !== undefined) {
      queryBuilder.andWhere('product.stock <= :maxStock', { maxStock });
    }

    // 排序和分页
    queryBuilder
      .skip((pageNo - 1) * pageSize)
      .take(pageSize)
      .orderBy('product.createTime', 'DESC')
      .getManyAndCount();

    const [products, total] = await queryBuilder.getManyAndCount();

    return {
      pageData: products,
      total,
      pageNo,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  /**
   * 根据ID查询商品详情
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    
    if (!product) {
      throw new CustomException(ErrorCode.ERR_10002, '商品不存在');
    }

    return product;
  }

  /**
   * 更新商品信息
   */
  async update(id: number, updateProductDto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // 如果更新名称，检查是否与其他商品重名
    if (updateProductDto.name && updateProductDto.name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name: updateProductDto.name },
      });

      if (existingProduct) {
        throw new CustomException(ErrorCode.ERR_10001, '商品名称已存在');
      }
    }

    const updatedProduct = this.productRepository.merge(product, updateProductDto);
    return await this.productRepository.save(updatedProduct);
  }

  /**
   * 删除商品
   */
  async remove(id: number): Promise<boolean> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return true;
  }

  /**
   * 更新商品库存
   */
  async updateStock(id: number, updateStockDto: UpdateStockDto): Promise<Product> {
    const product = await this.findOne(id);
    product.stock = updateStockDto.stock;
    return await this.productRepository.save(product);
  }

  /**
   * 更新商品状态
   */
  async updateStatus(id: number, updateStatusDto: UpdateStatusDto): Promise<Product> {
    const product = await this.findOne(id);
    product.status = updateStatusDto.status;
    return await this.productRepository.save(product);
  }

  /**
   * 批量更新商品状态
   */
  async batchUpdateStatus(ids: number[], status: number): Promise<boolean> {
    await this.productRepository.update(ids, { status });
    return true;
  }

  /**
   * 减少库存（用于下单等场景）
   */
  async decreaseStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);

    if (product.stock < quantity) {
      throw new CustomException(ErrorCode.ERR_10003, '库存不足');
    }

    product.stock -= quantity;
    product.sales += quantity;
    return await this.productRepository.save(product);
  }

  /**
   * 增加库存（用于退货等场景）
   */
  async increaseStock(id: number, quantity: number): Promise<Product> {
    const product = await this.findOne(id);
    product.stock += quantity;
    
    // 如果是退货，减少销量
    if (product.sales >= quantity) {
      product.sales -= quantity;
    }
    
    return await this.productRepository.save(product);
  }

  /**
   * 获取热销商品
   */
  async getHotProducts(limit: number = 10): Promise<Product[]> {
    return await this.productRepository.find({
      where: { status: 1 },
      order: { sales: 'DESC' },
      take: limit,
    });
  }

  /**
   * 获取库存不足的商品
   */
  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    return await this.productRepository.find({
      where: { status: 1 },
      order: { stock: 'ASC' },
    }).then(products => products.filter(product => product.stock <= threshold));
  }
} 