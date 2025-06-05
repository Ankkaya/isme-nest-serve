# 商品属性模块

商品属性模块提供了完整的商品属性管理功能，用于定义商品的各种规格和特征属性。

## 功能特性

- ✅ 属性增删改查
- ✅ 属性状态管理（启用/禁用）
- ✅ 属性排序功能
- ✅ 批量操作（删除、状态更新）
- ✅ 关联属性值管理
- ✅ 分页查询
- ✅ 模糊搜索
- ✅ 权限控制

## 数据库表结构

### attributes 表

| 字段名      | 类型         | 说明                   |
| ----------- | ------------ | ---------------------- |
| id          | bigint       | 属性ID（主键）         |
| name        | varchar(255) | 属性名称               |
| description | text         | 属性描述               |
| sort        | int          | 排序权重               |
| status      | tinyint(1)   | 状态（1=启用，0=禁用） |
| createTime  | timestamp    | 创建时间               |
| updateTime  | timestamp    | 更新时间               |

## API 接口

### 1. 创建属性

**POST** `/attributes`

```json
{
  "name": "颜色",
  "description": "商品颜色属性",
  "sort": 100,
  "status": 1
}
```

### 2. 获取属性列表（分页）

**GET** `/attributes?page=1&limit=10&name=颜色&status=1`

**查询参数：**

- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10，最大：100）
- `name`: 属性名称（模糊查询）
- `status`: 属性状态（1=启用，0=禁用）

### 3. 获取所有启用的属性

**GET** `/attributes/enabled`

返回所有状态为启用的属性，用于下拉选择等场景。

### 4. 获取属性详情

**GET** `/attributes/:id`

返回指定属性的详细信息，包括关联的属性值。

### 5. 更新属性信息

**PATCH** `/attributes/:id`

```json
{
  "name": "产品颜色",
  "description": "商品颜色规格属性",
  "sort": 99
}
```

### 6. 删除属性

**DELETE** `/attributes/:id`

**注意：** 只能删除没有关联属性值的属性。

### 7. 批量删除属性

**DELETE** `/attributes/batch/delete`

```json
{
  "ids": [1, 2, 3]
}
```

**注意：** 所有指定的属性都必须没有关联的属性值才能删除。

### 8. 批量更新属性状态

**PATCH** `/attributes/batch/status`

```json
{
  "ids": [1, 2, 3],
  "status": 0
}
```

## 权限说明

| 操作     | 所需权限               |
| -------- | ---------------------- |
| 查看属性 | 所有已登录用户         |
| 创建属性 | SUPER_ADMIN, SYS_ADMIN |
| 更新属性 | SUPER_ADMIN, SYS_ADMIN |
| 删除属性 | SUPER_ADMIN            |
| 状态管理 | SUPER_ADMIN, SYS_ADMIN |

## 使用示例

### 前端获取属性列表

```javascript
// 获取所有启用的属性
const enabledAttributes = await fetch('/api/attributes/enabled');

// 分页查询属性
const attributeList = await fetch('/api/attributes?page=1&limit=10&status=1');

// 搜索特定属性
const searchResult = await fetch('/api/attributes?name=颜色&page=1&limit=10');
```

### 创建属性

```javascript
// 创建新属性
const newAttribute = await fetch('/api/attributes', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '尺寸',
    description: '商品尺寸规格',
    sort: 90,
    status: 1,
  }),
});
```

### 属性状态管理

```javascript
// 禁用单个属性
const disableAttribute = await fetch('/api/attributes/1/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 0,
  }),
});

// 批量启用属性
const batchEnableAttributes = await fetch('/api/attributes/batch/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: [1, 2, 3],
    status: 1,
  }),
});
```

### 属性管理

```javascript
// 更新属性信息
const updateAttribute = await fetch('/api/attributes/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '商品颜色',
    description: '更新后的商品颜色属性描述',
    sort: 95,
  }),
});

// 删除属性（需要先删除关联的属性值）
const deleteAttribute = await fetch('/api/attributes/1', {
  method: 'DELETE',
});

// 批量删除属性
const batchDeleteAttributes = await fetch('/api/attributes/batch/delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: [4, 5, 6],
  }),
});
```

## 注意事项

1. **名称唯一性**：属性名称必须唯一，不允许重复
2. **删除限制**：只能删除没有关联属性值的属性
3. **级联删除**：建议在删除属性前先删除所有关联的属性值
4. **状态管理**：禁用的属性不会在前端选择器中显示
5. **排序规则**：按照 sort 降序 -> createTime 降序 排列

## 业务规则

1. **属性创建**：创建时会自动检查名称唯一性
2. **属性更新**：更新名称时会检查新名称是否与其他属性重复
3. **属性删除**：删除前会检查是否存在关联的属性值
4. **批量操作**：批量删除时，如果任何一个属性包含属性值，整个操作将失败

## 数据库索引

为了提高查询性能，建议在以下字段上创建索引：

```sql
-- 属性名称索引
CREATE INDEX idx_attribute_name ON attributes(name);

-- 状态索引
CREATE INDEX idx_attribute_status ON attributes(status);

-- 排序索引
CREATE INDEX idx_attribute_sort ON attributes(sort);

-- 复合索引：状态+排序
CREATE INDEX idx_attribute_status_sort ON attributes(status, sort);
```

## 扩展建议

1. **属性分组**：可以增加属性分组功能，便于管理大量属性
2. **属性模板**：创建属性模板，快速应用到商品分类
3. **属性验证规则**：为不同类型的属性添加验证规则
4. **属性权重**：为属性添加权重设置，影响搜索和展示顺序
