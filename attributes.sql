-- 商品属性表
CREATE TABLE `attributes` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '属性ID',
  `name` varchar(255) NOT NULL COMMENT '属性名称',
  `description` text COMMENT '属性描述',
  `sort` int unsigned NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态（1=启用，0=禁用）',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_name` (`name`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品属性表';

-- 商品属性值表
CREATE TABLE `attribute_values` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '属性值ID',
  `attributeId` bigint unsigned NOT NULL COMMENT '属性ID',
  `value` varchar(255) NOT NULL COMMENT '属性值名称',
  `description` text COMMENT '属性值描述',
  `sort` int unsigned NOT NULL DEFAULT '0' COMMENT '排序权重',
  `status` tinyint(1) NOT NULL DEFAULT '1' COMMENT '状态（1=启用，0=禁用）',
  `createTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_attribute_id` (`attributeId`),
  KEY `idx_value` (`value`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_attribute_values_attribute_id` FOREIGN KEY (`attributeId`) REFERENCES `attributes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='商品属性值表';

-- 插入示例数据
INSERT INTO `attributes` (`name`, `description`, `sort`, `status`) VALUES
('颜色', '商品颜色属性', 100, 1),
('尺码', '商品尺码属性', 90, 1),
('材质', '商品材质属性', 80, 1),
('品牌', '商品品牌属性', 70, 1);

INSERT INTO `attribute_values` (`attributeId`, `value`, `description`, `sort`, `status`) VALUES
(1, '红色', '红色选项', 100, 1),
(1, '蓝色', '蓝色选项', 90, 1),
(1, '绿色', '绿色选项', 80, 1),
(1, '黑色', '黑色选项', 70, 1),
(1, '白色', '白色选项', 60, 1),
(2, 'S', 'S码', 100, 1),
(2, 'M', 'M码', 90, 1),
(2, 'L', 'L码', 80, 1),
(2, 'XL', 'XL码', 70, 1),
(2, 'XXL', 'XXL码', 60, 1),
(3, '棉', '棉质', 100, 1),
(3, '丝绸', '丝绸材质', 90, 1),
(3, '羊毛', '羊毛材质', 80, 1),
(3, '聚酯纤维', '聚酯纤维材质', 70, 1),
(4, '耐克', '耐克品牌', 100, 1),
(4, '阿迪达斯', '阿迪达斯品牌', 90, 1),
(4, '李宁', '李宁品牌', 80, 1),
(4, '安踏', '安踏品牌', 70, 1); 