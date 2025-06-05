# 商品属性值模块

商品属性值模块提供了完整的属性值管理功能，用于管理商品属性的具体取值选项。

## 功能特性

- ✅ 属性值增删改查
- ✅ 属性值状态管理（启用/禁用）
- ✅ 属性值排序功能
- ✅ 批量操作（删除、状态更新）
- ✅ 按属性分组管理
- ✅ 分页查询
- ✅ 模糊搜索
- ✅ 权限控制

## 数据库表结构

### attribute_values 表

| 字段名      | 类型         | 说明                   |
| ----------- | ------------ | ---------------------- |
| id          | bigint       | 属性值ID（主键）       |
| attributeId | bigint       | 属性ID（外键）         |
| value       | varchar(255) | 属性值名称             |
| description | text         | 属性值描述             |
| sort        | int          | 排序权重               |
| status      | tinyint(1)   | 状态（1=启用，0=禁用） |
| createTime  | timestamp    | 创建时间               |
| updateTime  | timestamp    | 更新时间               |

## API 接口

### 1. 创建属性值

**POST** `/attribute-values`

```json
{
  "attributeId": 1,
  "value": "红色",
  "description": "红色选项",
  "sort": 100,
  "status": 1
}
```

### 2. 获取属性值列表（分页）

**GET** `/attribute-values?page=1&limit=10&attributeId=1&value=红&status=1`

**查询参数：**

- `page`: 页码（默认：1）
- `limit`: 每页数量（默认：10，最大：100）
- `attributeId`: 属性ID（筛选特定属性的属性值）
- `value`: 属性值名称（模糊查询）
- `status`: 属性值状态（1=启用，0=禁用）

### 3. 根据属性ID获取属性值

**GET** `/attribute-values/attribute/:attributeId`

返回指定属性下所有启用状态的属性值，按排序权重排列。

### 4. 获取属性值详情

**GET** `/attribute-values/:id`

返回指定属性值的详细信息，包括关联的属性信息。

### 5. 更新属性值信息

**PATCH** `/attribute-values/:id`

```json
{
  "value": "深红色",
  "description": "深红色选项",
  "sort": 99
}
```

### 6. 删除属性值

**DELETE** `/attribute-values/:id`

删除指定的属性值。

### 7. 批量删除属性值

**DELETE** `/attribute-values/batch/delete`

```json
{
  "ids": [1, 2, 3]
}
```

批量删除多个属性值。

### 8. 批量更新属性值状态

**PATCH** `/attribute-values/batch/status`

```json
{
  "ids": [1, 2, 3],
  "status": 0
}
```

## 权限说明

| 操作       | 所需权限               |
| ---------- | ---------------------- |
| 查看属性值 | 所有已登录用户         |
| 创建属性值 | SUPER_ADMIN, SYS_ADMIN |
| 更新属性值 | SUPER_ADMIN, SYS_ADMIN |
| 删除属性值 | SUPER_ADMIN            |
| 状态管理   | SUPER_ADMIN, SYS_ADMIN |

## 使用示例

### 前端获取属性值列表

```javascript
// 获取指定属性的所有属性值
const attributeValues = await fetch('/api/attribute-values/attribute/1');

// 分页查询属性值
const attributeValueList = await fetch('/api/attribute-values?page=1&limit=10&status=1');

// 搜索特定属性值
const searchResult = await fetch('/api/attribute-values?value=红色&page=1&limit=10');

// 获取特定属性的属性值
const colorValues = await fetch('/api/attribute-values?attributeId=1&status=1');
```

### 创建属性值

```javascript
// 为颜色属性创建新的属性值
const newAttributeValue = await fetch('/api/attribute-values', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attributeId: 1, // 颜色属性ID
    value: '蓝色',
    description: '蓝色选项',
    sort: 90,
    status: 1,
  }),
});

// 为尺寸属性创建新的属性值
const newSizeValue = await fetch('/api/attribute-values', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attributeId: 2, // 尺寸属性ID
    value: 'XL',
    description: 'XL码',
    sort: 80,
    status: 1,
  }),
});
```

### 属性值状态管理

```javascript
// 禁用单个属性值
const disableAttributeValue = await fetch('/api/attribute-values/1/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 0,
  }),
});

// 批量启用属性值
const batchEnableAttributeValues = await fetch('/api/attribute-values/batch/status', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: [1, 2, 3],
    status: 1,
  }),
});
```

### 属性值管理

```javascript
// 更新属性值信息
const updateAttributeValue = await fetch('/api/attribute-values/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    value: '鲜红色',
    description: '鲜艳的红色选项',
    sort: 95,
  }),
});

// 删除属性值
const deleteAttributeValue = await fetch('/api/attribute-values/1', {
  method: 'DELETE',
});

// 批量删除属性值
const batchDeleteAttributeValues = await fetch('/api/attribute-values/batch/delete', {
  method: 'DELETE',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: [4, 5, 6],
  }),
});

// 移动属性值到其他属性
const moveAttributeValue = await fetch('/api/attribute-values/1', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    attributeId: 2, // 移动到新的属性
    value: '红色',
    sort: 100,
  }),
});
```

### 批量操作示例

```javascript
// 为同一属性批量创建多个属性值
const colorValues = ['红色', '蓝色', '绿色', '黄色', '黑色'];
const attributeId = 1; // 颜色属性ID

const createPromises = colorValues.map((color, index) => {
  return fetch('/api/attribute-values', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attributeId: attributeId,
      value: color,
      description: `${color}选项`,
      sort: 100 - index * 10, // 递减排序
      status: 1,
    }),
  });
});

const results = await Promise.all(createPromises);
```

## 注意事项

1. **属性关联**：必须关联到已存在的属性，属性ID不能为空
2. **同属性下唯一性**：同一属性下的属性值名称必须唯一
3. **属性存在性检查**：创建和更新时会验证关联的属性是否存在
4. **状态管理**：禁用的属性值不会在前端选择器中显示
5. **排序规则**：按照 sort 降序 -> createTime 降序 排列

## 业务规则

1. **属性值创建**：
   - 检查关联属性是否存在
   - 检查同属性下属性值名称唯一性
2. **属性值更新**：
   - 可以移动到其他属性（如果指定了新的 attributeId）
   - 更新属性值名称时检查唯一性
3. **属性值删除**：

   - 可以直接删除，不受商品使用情况限制
   - 建议在删除前检查商品使用情况

4. **批量操作**：
   - 批量操作会验证所有属性值的存在性
   - 如果任何一个操作失败，整个批量操作将回滚

## 数据库索引

为了提高查询性能，建议在以下字段上创建索引：

```sql
-- 属性ID索引
CREATE INDEX idx_attribute_value_attribute_id ON attribute_values(attributeId);

-- 属性值名称索引
CREATE INDEX idx_attribute_value_value ON attribute_values(value);

-- 状态索引
CREATE INDEX idx_attribute_value_status ON attribute_values(status);

-- 排序索引
CREATE INDEX idx_attribute_value_sort ON attribute_values(sort);

-- 复合索引：属性ID+状态+排序
CREATE INDEX idx_attribute_value_attr_status_sort ON attribute_values(attributeId, status, sort);

-- 复合索引：属性ID+值（用于唯一性检查）
CREATE INDEX idx_attribute_value_attr_value ON attribute_values(attributeId, value);
```

## 扩展建议

1. **属性值图片**：为属性值添加图片字段，支持颜色样本等可视化展示
2. **属性值分组**：为属性值添加分组功能，便于管理大量选项
3. **属性值关联**：实现属性值之间的关联关系，如尺码与库存的对应
4. **属性值验证**：添加属性值格式验证，如颜色值的十六进制校验
5. **属性值继承**：支持从父级属性值继承某些配置
6. **多语言支持**：为属性值添加多语言名称支持

## 与商品的关联使用

```javascript
// 获取商品可选的所有属性和属性值
async function getProductAttributes(categoryId) {
  // 1. 获取分类相关的属性
  const attributes = await fetch(`/api/attributes/enabled`);

  // 2. 为每个属性获取属性值
  const attributesWithValues = await Promise.all(
    attributes.data.map(async (attr) => {
      const values = await fetch(`/api/attribute-values/attribute/${attr.id}`);
      return {
        ...attr,
        values: values.data,
      };
    }),
  );

  return attributesWithValues;
}

// 使用示例
const productAttributes = await getProductAttributes(1);
console.log(productAttributes);
/*
[
  {
    id: 1,
    name: "颜色",
    description: "商品颜色属性",
    values: [
      { id: 1, value: "红色", description: "红色选项" },
      { id: 2, value: "蓝色", description: "蓝色选项" }
    ]
  },
  {
    id: 2,
    name: "尺码",
    description: "商品尺码属性", 
    values: [
      { id: 3, value: "S", description: "S码" },
      { id: 4, value: "M", description: "M码" }
    ]
  }
]
*/
```
