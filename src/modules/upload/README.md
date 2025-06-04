# MinIO 文件上传模块

## 功能特性

- ✅ 单文件上传
- ✅ 多文件上传
- ✅ 头像上传（带文件类型和大小验证）
- ✅ 文件删除
- ✅ 文件列表查询
- ✅ 文件信息获取
- ✅ 自动生成唯一文件名
- ✅ 支持自定义桶名称

## 环境配置

在 `.env` 文件中添加以下 MinIO 配置：

```env
# MinIO 配置
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
```

## API 接口

### 1. 上传单个文件

**接口：** `POST /upload/single`

**参数：**

- `file`: 文件（form-data）
- `bucket`: 桶名称（可选，默认为 'uploads'）

**响应：**

```json
{
  "code": 200,
  "message": "文件上传成功",
  "data": {
    "originalName": "example.jpg",
    "fileName": "1701234567890-uuid.jpg",
    "url": "http://localhost:9000/uploads/1701234567890-uuid.jpg",
    "size": 102400,
    "mimetype": "image/jpeg"
  }
}
```

### 2. 上传多个文件

**接口：** `POST /upload/multiple`

**参数：**

- `files`: 文件数组（form-data，最多10个）
- `bucket`: 桶名称（可选，默认为 'uploads'）

**响应：**

```json
{
  "code": 200,
  "message": "文件上传成功",
  "data": [
    {
      "originalName": "file1.jpg",
      "fileName": "1701234567890-uuid1.jpg",
      "url": "http://localhost:9000/uploads/1701234567890-uuid1.jpg",
      "size": 102400,
      "mimetype": "image/jpeg"
    },
    {
      "originalName": "file2.png",
      "fileName": "1701234567891-uuid2.png",
      "url": "http://localhost:9000/uploads/1701234567891-uuid2.png",
      "size": 204800,
      "mimetype": "image/png"
    }
  ]
}
```

### 3. 上传头像

**接口：** `POST /upload/avatar`

**参数：**

- `avatar`: 头像文件（form-data）
- 限制：只支持 jpg、jpeg、png、gif、webp 格式，最大 5MB

**响应：**

```json
{
  "code": 200,
  "message": "头像上传成功",
  "data": {
    "originalName": "avatar.jpg",
    "fileName": "1701234567890-uuid.jpg",
    "url": "http://localhost:9000/avatars/1701234567890-uuid.jpg",
    "size": 102400,
    "mimetype": "image/jpeg"
  }
}
```

### 4. 获取文件列表

**接口：** `GET /upload/list`

**参数：**

- `bucket`: 桶名称（可选，默认为 'uploads'）
- `prefix`: 文件名前缀（可选）

### 5. 获取文件信息

**接口：** `GET /upload/info/:bucket/:fileName`

### 6. 删除文件

**接口：** `DELETE /upload/:bucket/:fileName`

## 使用示例

### 前端 JavaScript 示例

```javascript
// 上传单个文件
const uploadSingle = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('bucket', 'uploads'); // 可选

  const response = await fetch('/upload/single', {
    method: 'POST',
    body: formData,
  });

  return response.json();
};

// 上传多个文件
const uploadMultiple = async (files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  formData.append('bucket', 'documents'); // 可选

  const response = await fetch('/upload/multiple', {
    method: 'POST',
    body: formData,
  });

  return response.json();
};

// 上传头像
const uploadAvatar = async (avatarFile) => {
  const formData = new FormData();
  formData.append('avatar', avatarFile);

  const response = await fetch('/upload/avatar', {
    method: 'POST',
    body: formData,
  });

  return response.json();
};
```

### curl 示例

```bash
# 上传单个文件
curl -X POST \
  http://localhost:3000/upload/single \
  -F "file=@/path/to/your/file.jpg" \
  -F "bucket=uploads"

# 上传头像
curl -X POST \
  http://localhost:3000/upload/avatar \
  -F "avatar=@/path/to/avatar.jpg"

# 获取文件列表
curl -X GET "http://localhost:3000/upload/list?bucket=uploads"

# 删除文件
curl -X DELETE "http://localhost:3000/upload/uploads/filename.jpg"
```

## MinIO 服务搭建

### 使用 Docker 快速启动 MinIO

```bash
docker run -p 9000:9000 -p 9001:9001 \
  --name minio \
  -e "MINIO_ROOT_USER=minioadmin" \
  -e "MINIO_ROOT_PASSWORD=minioadmin" \
  -v /data:/data \
  minio/minio server /data --console-address ":9001"
```

访问 MinIO 控制台：http://localhost:9001

- 用户名：minioadmin
- 密码：minioadmin

## 注意事项

1. 请确保 MinIO 服务正常运行
2. 检查网络连接和防火墙设置
3. 文件上传大小限制可以在 NestJS 中配置
4. 建议在生产环境中使用 HTTPS
5. 定期备份重要文件
