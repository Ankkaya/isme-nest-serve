# 商品模块 (Product Module)

## 概述

商品模块提供了完整的商品管理功能，包括商品的增删改查、库存管理、状态控制等功能。

## 数据库表结构

基于 `peach.sql` 中的 `products` 表：

```sql
CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  name VARCHAR(255) NOT NULL COMMENT '商品名称',
  description TEXT COMMENT '商品描述',
  image VARCHAR(255) COMMENT '主图URL',
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '销售价格',
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '成本价格',
  stock INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '库存数量',
  sales INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计销量',
  status ENUM('ON', 'OFF') NOT NULL DEFAULT 'ON' COMMENT '商品状态',
  createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
);
```

## API 接口

### 基础 CRUD 操作

#### 1. 创建商品

- **POST** `/product`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`
- **请求体**:

```json
{
  "name": "商品名称",
  "description": "商品描述",
  "image": "图片URL",
  "price": 99.99,
  "costPrice": 50.0,
  "stock": 100,
  "status": "ON"
}
```

#### 2. 获取商品列表

- **GET** `/product`
- **查询参数**:
  - `pageNo`: 页码 (默认: 1)
  - `pageSize`: 每页数量 (默认: 10, 最大: 100)
  - `name`: 商品名称 (模糊查询)
  - `status`: 商品状态 (`ON` | `OFF`)
  - `minPrice`: 最低价格
  - `maxPrice`: 最高价格
  - `minStock`: 最低库存
  - `maxStock`: 最高库存

#### 3. 获取商品详情

- **GET** `/product/:id`

#### 4. 更新商品信息

- **PATCH** `/product/:id`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`

#### 5. 删除商品

- **DELETE** `/product/:id`
- **权限**: `SUPER_ADMIN`

### 库存管理

#### 6. 更新商品库存

- **PATCH** `/product/:id/stock`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`
- **请求体**:

```json
{
  "stock": 200
}
```

#### 7. 减少库存 (下单时使用)

- **PATCH** `/product/:id/decrease-stock`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`, `USER`
- **请求体**:

```json
{
  "quantity": 5
}
```

#### 8. 增加库存 (退货时使用)

- **PATCH** `/product/:id/increase-stock`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`
- **请求体**:

```json
{
  "quantity": 3
}
```

### 状态管理

#### 9. 更新商品状态

- **PATCH** `/product/:id/status`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`
- **请求体**:

```json
{
  "status": "OFF"
}
```

#### 10. 批量更新商品状态

- **PATCH** `/product/batch/status`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`
- **请求体**:

```json
{
  "ids": [1, 2, 3],
  "status": "OFF"
}
```

### 统计功能

#### 11. 获取热销商品

- **GET** `/product/statistics/hot`
- **查询参数**:
  - `limit`: 返回数量 (默认: 10)

#### 12. 获取库存不足的商品

- **GET** `/product/statistics/low-stock`
- **权限**: `SUPER_ADMIN`, `SYS_ADMIN`
- **查询参数**:
  - `threshold`: 库存阈值 (默认: 10)

## 数据验证

### CreateProductDto

- `name`: 必填，1-255字符
- `description`: 可选，最多1000字符
- `image`: 可选，必须是有效URL
- `price`: 必填，大于0，最多2位小数
- `costPrice`: 可选，大于等于0，最多2位小数
- `stock`: 可选，大于等于0的整数
- `status`: 可选，只能是 `ON` 或 `OFF`

### UpdateProductDto

- 所有字段都是可选的，验证规则与创建时相同

### GetProductDto

- `pageNo`: 可选，大于0
- `pageSize`: 可选，1-100之间
- 其他查询字段都是可选的

## 业务逻辑

1. **商品名称唯一性**: 创建和更新时会检查商品名称是否已存在
2. **库存管理**:
   - 减少库存时会检查库存是否充足
   - 减少库存时会自动增加销量
   - 增加库存时会相应减少销量（退货场景）
3. **状态控制**: 只有状态为 `ON` 的商品才会出现在热销商品列表中
4. **权限控制**: 不同操作需要不同的角色权限

## 错误处理

- `ERR_10001`: 商品名称已存在
- `ERR_10002`: 商品不存在
- `ERR_10003`: 库存不足

## 使用示例

```typescript
// 在其他模块中使用商品服务
import { ProductService } from '@/modules/product';

@Injectable()
export class OrderService {
  constructor(private productService: ProductService) {}

  async createOrder(productId: number, quantity: number) {
    // 减少商品库存
    await this.productService.decreaseStock(productId, quantity);
    // ... 其他订单逻辑
  }
}
```
