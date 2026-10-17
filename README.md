# 南京破晓 DAYBREAK

街头篮球厂牌官网 + 单管理员 Payload CMS。Next.js 15 / Payload 3 / PostgreSQL。

## 本地启动

1. Node.js 22+、PostgreSQL 16+。
2. `cp .env.example .env`，修改 `PAYLOAD_SECRET` 和数据库连接。
3. `npm install`。
4. `npm run dev`，打开 http://localhost:3000 。
5. 访问 http://localhost:3000/admin 创建第一个管理员。
6. 在后台上传 Media，创建 Players、Albums，编辑 Homepage。

首次无内容时首页显示占位卡片；后台添加内容后会自动读取真实数据。

## Docker

复制 `.env.example` 为 `.env`，至少设置 `PAYLOAD_SECRET` 和 `POSTGRES_PASSWORD`，然后 `docker compose up --build -d`。如用 Compose 数据库，`DATABASE_URI` 由 compose 注入。

## Logo

目前使用文字标识。拿到真实 Logo 后放到 `public/logo.svg`，并替换 `src/app/(site)/layout.tsx` 中的 `.brand` 内容。

## 数据模型

- Users：唯一管理员（后台首次创建）
- Media：照片上传、缩略图
- Players：球员信息、球衣号码、肖像
- Albums：相册、照片列表、关联球员
- Homepage：Hero、Slogan、精选球员、精选相册、简介

## 上线前检查

- 替换示例文案和 Logo，核对成立年份（目前 Hero 仅为视觉占位文案）。
- 设置强随机 `PAYLOAD_SECRET`、强数据库密码、HTTPS 与防火墙。
- 备份 PostgreSQL 和 `media` 持久化卷；需要时启用 S3 兼容存储。
- 目前相册点击照片为新标签打开原图；灯箱、动画和图片性能优化属于下一迭代。
- 项目为初始源码脚手架，尚未在本环境完成依赖安装、构建与端到端测试。
