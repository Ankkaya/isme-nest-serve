SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for products
-- ----------------------------
DROP TABLE IF EXISTS `products`;
CREATE TABLE products (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '商品ID',
  
  -- 基础信息
  name VARCHAR(255) NOT NULL COMMENT '商品名称',
  description TEXT COMMENT '商品描述',
  image VARCHAR(255) COMMENT '主图URL',
  
  -- 价格信息
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '销售价格',
  cost_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00 COMMENT '成本价格',
  
  -- 销售数据
  stock INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '库存数量',
  sales INT UNSIGNED NOT NULL DEFAULT 0 COMMENT '累计销量',
  
  -- 状态控制 (1=启动，0=禁用)
  status TINYINT(1) NOT NULL DEFAULT 1 COMMENT '商品状态（1=启动，0=禁用）',
  
  -- 时间戳
  createTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updateTime TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引优化
  INDEX idx_name (name),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品数据表';

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类ID',
  `name` varchar(100) NOT NULL COMMENT '分类名称',
  `description` varchar(500) DEFAULT NULL COMMENT '分类描述',
  `icon` varchar(255) DEFAULT NULL COMMENT '分类图标URL',
  `image` varchar(255) DEFAULT NULL COMMENT '分类图片URL',
  `parentId` bigint(20) unsigned DEFAULT NULL COMMENT '父级分类ID',
  `level` int(10) unsigned NOT NULL DEFAULT '1' COMMENT '分类层级（1为顶级）',
  `path` varchar(500) DEFAULT NULL COMMENT '分类路径（如：1,2,3）',
  `sort` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '排序权重（数字越大越靠前）',
  `showInNav` tinyint(1) NOT NULL DEFAULT '1' COMMENT '是否显示在导航中',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '分类状态（1=启用，0=禁用）',
  `productCount` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '商品数量',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_parent_id` (`parentId`),
  KEY `idx_level` (`level`),
  KEY `idx_sort` (`sort`),
  KEY `idx_status` (`status`),
  KEY `idx_parent_status_sort` (`parentId`,`status`,`sort`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (24, '商品属性', 'ProductAttribute', 'MENU', 21, '/product/attribute', NULL, NULL, '/src/views/peach/product/attribute/index.vue', '', NULL, NULL, NULL, 1, 1, 3);
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (25, '分配属性值', 'AttributeValue', 'MENU', 24, '/product/attribute/value', NULL, NULL, '/src/views/peach/product/attribute/attribute-value.vue', '', NULL, NULL, NULL, 0, 1, 0);
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (26, '商品规格', 'ProductSpecification', 'MENU', 21, '/product/specification', NULL, NULL, '/src/views/peach/product/specification/index.vue', '', NULL, NULL, NULL, 1, 1, 4);
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (27, '分配规格值', 'SpecificationValue', 'MENU', 26, '/product/specification/value', NULL, NULL, '/src/views/peach/product/specification/specification-value.vue', '', NULL, NULL, NULL, 0, 1, 0);

-- ----------------------------
-- Records of categories (示例数据)
-- ----------------------------
INSERT INTO `categories` VALUES 
(1, '电子产品', '各类电子产品分类', 'https://example.com/icons/electronics.png', 'https://example.com/images/electronics.jpg', NULL, 1, '', 100, 1, 1, 0, NOW(), NOW()),
(2, '服装鞋帽', '服装鞋帽用品', 'https://example.com/icons/clothing.png', 'https://example.com/images/clothing.jpg', NULL, 1, '', 99, 1, 1, 0, NOW(), NOW()),
(3, '家居用品', '家居日用品', 'https://example.com/icons/home.png', 'https://example.com/images/home.jpg', NULL, 1, '', 98, 1, 1, 0, NOW(), NOW()),
(4, '智能手机', '各品牌智能手机', NULL, NULL, 1, 2, '1', 90, 1, 1, 0, NOW(), NOW()),
(5, '笔记本电脑', '各品牌笔记本电脑', NULL, NULL, 1, 2, '1', 89, 1, 1, 0, NOW(), NOW()),
(6, '男装', '男士服装', NULL, NULL, 2, 2, '2', 80, 1, 1, 0, NOW(), NOW()),
(7, '女装', '女士服装', NULL, NULL, 2, 2, '2', 79, 1, 1, 0, NOW(), NOW()),
(8, 'iPhone', '苹果手机系列', NULL, NULL, 4, 3, '1,4', 70, 1, 1, 0, NOW(), NOW()),
(9, '华为手机', '华为手机系列', NULL, NULL, 4, 3, '1,4', 69, 1, 1, 0, NOW(), NOW());

-- ----------------------------
-- Records of permission
-- ----------------------------
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (21, '商品中心', 'Product', 'MENU', NULL, NULL, NULL, 'i-fe:music', NULL, '', NULL, NULL, NULL, 1, 1, 0);
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (22, '商品列表', 'ProductList', 'MENU', 21, '/product/list', NULL, NULL, '/src/views/peach/product/list/index.vue', '', NULL, NULL, NULL, 1, 1, 1);
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (23, '商品分类', 'ProductCategory', 'MENU', 21, '/product/category', NULL, NULL, '/src/views/peach/product/category/index.vue', '', NULL, NULL, NULL, 1, 1, 2);
INSERT INTO `isme`.`permission` (`id`, `name`, `code`, `type`, `parentId`, `path`, `redirect`, `icon`, `component`, `layout`, `keepAlive`, `method`, `description`, `show`, `enable`, `order`) VALUES (24, '商品属性', 'ProductAttribute', 'MENU', 21, '/product/attribute', NULL, NULL, '/src/views/peach/product/attribute/index.vue', '', NULL, NULL, NULL, 1, 1, 3);

SET FOREIGN_KEY_CHECKS = 1;