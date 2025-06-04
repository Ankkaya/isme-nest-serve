# 商品分类模块

商品分类模块提供了完整的分类管理功能，支持无限层级的树形结构分类管理。

## 功能特性

- ✅ 无限层级分类（建议不超过5级）
- ✅ 树形结构管理
- ✅ 分类排序功能
- ✅ 状态管理（启用/禁用）
- ✅ 导航显示控制
- ✅ 分类移动功能
- ✅ 批量操作
- ✅ 权限控制

## 数据库表结构

### categories 表

| 字段名       | 类型         | 说明                       |
| ------------ | ------------ | -------------------------- |
| id           | bigint       | 分类ID（主键）             |
| name         | varchar(100) | 分类名称                   |
| description  | varchar(500) | 分类描述                   |
| icon         | varchar(255) | 分类图标URL                |
| image        | varchar(255) | 分类图片URL                |
| parentId     | bigint       | 父级分类ID                 |
| level        | int          | 分类层级（1为顶级）        |
| path         | varchar(500) | 分类路径（如：1,2,3）      |
| sort         | int          | 排序权重（数字越大越靠前） |
| showInNav    | boolean      | 是否显示在导航中           |
| status       | tinyint(1)   | 分类状态（1=启用，0=禁用） |
| productCount | int          | 商品数量                   |
| createTime   | timestamp    | 创建时间                   |
| updateTime   | timestamp    | 更新时间                   |

## API 接口

### 1. 创建分类

**POST** `/category`

```json
{
  "name": "电子产品",
  "description": "各类电子产品分类",
  "icon": "https://example.com/icon.png",
  "image": "https://example.com/image.jpg",
  "parentId": null,
  "sort": 100,
  "showInNav": true,
  "status": 1
}
```

### 2. 获取分类列表（分页）

**GET** `/category?pageNo=1&pageSize=10&name=电子&status=1&level=1`

**查询参数：**

- `pageNo`: 页码（默认：1）
- `pageSize`: 每页数量（默认：10，最大：100）
- `name`: 分类名称（模糊查询）
- `status`: 分类状态（1=启用，0=禁用）
- `parentId`: 父级分类ID（0表示顶级分类）
- `level`: 分类层级
- `showInNav`: 是否显示在导航中

### 3. 获取分类树形结构

**GET** `/category/tree?maxLevel=3&status=1&showInNav=true`

**查询参数：**

- `maxLevel`: 最大层级（默认：3，最大：5）
- `status`: 分类状态筛选
- `showInNav`: 是否只显示导航分类
- `includeProductCount`: 是否包含商品数量

### 4. 获取顶级分类

**GET** `/category/top-level?status=1`

### 5. 获取分类详情

**GET** `/category/:id`

### 6. 获取分类的所有子分类

**GET** `/category/:id/children`

### 7. 更新分类信息

**PATCH** `/category/:id`

```json
{
  "name": "智能手机",
  "description": "各品牌智能手机",
  "sort": 99
}
```

### 8. 移动分类位置

**PATCH** `/category/:id/move`

```json
{
  "newParentId": 2,
  "newSort": 50
}
```

### 9. 更新分类状态

**PATCH** `/category/:id/status`

```json
{
  "status": 0
}
```

### 10. 批量更新分类状态

**PATCH** `/category/batch/status`

```json
{
  "ids": [1, 2, 3],
  "status": 0
}
```

### 11. 更新分类显示状态

**PATCH** `/category/:id/show-in-nav`

```json
{
  "showInNav": false
}
```

**说明：**

- 如果将分类设置为不显示在导航中，其所有子分类也会被设置为不显示
- 这样可以保证导航结构的完整性

### 12. 批量更新分类显示状态

**PATCH** `/category/batch/show-in-nav`

```json
{
  "ids": [1, 2, 3],
  "showInNav": true
}
```

**说明：**

- 批量操作时，如果设置为不显示，同样会影响所选分类的所有子分类
- 建议谨慎使用批量隐藏功能

### 13. 删除分类

**DELETE** `/category/:id`

## 权限说明

| 操作         | 所需权限               |
| ------------ | ---------------------- |
| 查看分类     | 所有已登录用户         |
| 创建分类     | SUPER_ADMIN, SYS_ADMIN |
| 更新分类     | SUPER_ADMIN, SYS_ADMIN |
| 删除分类     | SUPER_ADMIN            |
| 移动分类     | SUPER_ADMIN, SYS_ADMIN |
| 状态管理     | SUPER_ADMIN, SYS_ADMIN |
| 显示状态管理 | SUPER_ADMIN, SYS_ADMIN |

## 使用示例

### 前端获取分类树形结构

```javascript
// 获取完整的分类树
const categoryTree = await fetch('/api/category/tree?maxLevel=3&status=1');

// 获取导航显示的分类
const navCategories = await fetch('/api/category/tree?showInNav=true&maxLevel=2');
```

### 创建多级分类

```javascript
// 1. 创建顶级分类
const topCategory = await fetch('/api/category', {
  method: 'POST',
  body: JSON.stringify({
    name: '电子产品',
    sort: 100,
  }),
});

// 2. 创建子分类
const subCategory = await fetch('/api/category', {
  method: 'POST',
  body: JSON.stringify({
    name: '智能手机',
    parentId: topCategory.id,
    sort: 90,
  }),
});

// 3. 创建三级分类
const thirdCategory = await fetch('/api/category', {
  method: 'POST',
  body: JSON.stringify({
    name: 'iPhone',
    parentId: subCategory.id,
    sort: 80,
  }),
});
```

### 分类显示状态管理

```javascript
// 隐藏单个分类（不在导航中显示）
const hideCategory = await fetch('/api/category/1/show-in-nav', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    showInNav: false,
  }),
});

// 显示单个分类（在导航中显示）
const showCategory = await fetch('/api/category/1/show-in-nav', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    showInNav: true,
  }),
});

// 批量隐藏多个分类
const batchHideCategories = await fetch('/api/category/batch/show-in-nav', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: [1, 2, 3],
    showInNav: false,
  }),
});

// 批量显示多个分类
const batchShowCategories = await fetch('/api/category/batch/show-in-nav', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    ids: [4, 5, 6],
    showInNav: true,
  }),
});
```

## 注意事项

1. **层级限制**：建议分类层级不超过5级，过深的层级会影响性能和用户体验
2. **名称唯一性**：同一层级下的分类名称必须唯一
3. **循环引用检查**：移动分类时会自动检查并防止循环引用
4. **级联操作**：禁用父分类时会自动禁用所有子分类
5. **显示状态级联**：隐藏父分类时会自动隐藏所有子分类，确保导航结构完整性
6. **删除限制**：只能删除没有子分类的分类
7. **路径自动维护**：分类的路径字段会在移动时自动更新

## 数据库索引

为了提高查询性能，建议在以下字段上创建索引：

```sql
-- 分类名称索引
CREATE INDEX idx_category_name ON categories(name);

-- 父级分类索引
CREATE INDEX idx_category_parent_id ON categories(parentId);

-- 层级索引
CREATE INDEX idx_category_level ON categories(level);

-- 状态索引
CREATE INDEX idx_category_status ON categories(status);

-- 排序索引
CREATE INDEX idx_category_sort ON categories(sort);

-- 复合索引：父级+状态+排序
CREATE INDEX idx_category_parent_status_sort ON categories(parentId, status, sort);
```
