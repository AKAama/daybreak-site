# 南京破晓 DAYBREAK

街头篮球厂牌官网 + 单管理员内容后台。Next.js 15（App Router）/ Payload 3 / PostgreSQL 16 / Tailwind CSS 4。

前台页面：首页、球员阵容与详情页、球队风采相册与灯箱详情页、关于我们；后台在 `/admin`。

## 本地开发

1. 需要 Node.js 22+ 与一个可访问的 PostgreSQL 16+。没有现成库时用仓库自带的 compose 起一个：

   ```bash
   docker compose up -d db
   ```

2. 准备环境变量：`cp .env.example .env`，填入 `PAYLOAD_SECRET`（`openssl rand -base64 48`）。
   缺失时应用会直接拒绝启动，不会退回任何内置默认值。
3. `npm ci`
4. `npm run migrate`（首次会应用 `src/migrations` 里的初始迁移）
5. 可选：`SEED_ADMIN_PASSWORD=至少12位 npm run seed` 写入一批演示内容（纯色占位图 + 草稿/已发布样本），
   加上 `SEED_HERO_VIDEO=/path/to/demo.mp4` 可一并验证 Hero 视频与静态回退。
   该脚本会创建后台账号 `admin@example.com`，仅供本地使用。
6. `npm run dev` → http://localhost:3000 ，后台 http://localhost:3000/admin
   未执行 seed 时，直接访问 `/admin` 走「创建第一个用户」流程即可。

改完集合或全局配置后：`npm run migrate:create` 生成迁移，`npm run generate:types` 刷新 `src/payload-types.ts`。
本地想跳过迁移直接改表，可临时设 `PAYLOAD_DB_PUSH=true`；生产禁用。

## 常用脚本

| 命令 | 作用 |
| --- | --- |
| `npm run dev` / `build` / `start` | 开发、构建、运行 |
| `npm run migrate` / `migrate:create` | 应用 / 生成数据库迁移 |
| `npm run generate:types` / `generate:importmap` | 刷新 Payload 类型与后台 import map |
| `npm run seed` | 写入本地演示内容 |
| `npm run lint` / `typecheck` / `format` | 代码检查、类型检查、格式化 |

## 部署

```bash
PAYLOAD_SECRET=... POSTGRES_PASSWORD=... NEXT_PUBLIC_SITE_URL=https://your-domain docker compose up --build -d
```

- 镜像分三段：`npm ci` → `next build` → 只带生产依赖运行；构建阶段用 `PAYLOAD_ALLOW_PLACEHOLDER_SECRET`
  允许占位密钥，运行时仍必须注入真实 `PAYLOAD_SECRET`。
- `web` 启动时先执行 `npx payload migrate` 再起服务，生产 `push` 关闭，表结构只认版本管理里的迁移文件。
- 媒体默认写在命名卷 `uploads`（容器内 `/app/media`）。生产环境建议由 Caddy/Nginx 直接对外提供该目录，
  或设置 `S3_BUCKET` 等变量切到 S3 兼容存储（设置 `S3_BUCKET` 即启用，`next.config.mjs` 会按 endpoint 放行图片域名）。
- 反代需要转发 `/admin` 与 `/api`，并配置 HTTPS。登录接口的频率限制交给反代（如 Caddy `rate_limit`），
  应用层未自行实现。

## 自动部署（GitHub Actions）

推送到 `main`（或手动跑 Actions 里的 **Build and deploy**）会：

1. 在 GitHub-hosted runner 上构建 `linux/amd64` 镜像（避免腾讯云 4G 内存不够跑 `next build`）
2. 推到阿里云个人版容器镜像服务：`crpi-3xux8vqn35fw00z9.cn-shanghai.personal.cr.aliyuncs.com/project_hub/daybreak-site:<package.json version>-<shortsha>`，并更新 `latest`
3. SSH 到生产机 `/opt/daybreak-site`，`docker pull` 后只重建 `web`（`.env`、Postgres、RustFS/S3、媒体卷不动）

需要在仓库 Settings → Secrets and variables → Actions 配置：

| Secret | 说明 |
|--------|------|
| `ALIYUN_CR_USERNAME` | 阿里云 ACR「访问凭证」用户名 |
| `ALIYUN_CR_PASSWORD` | ACR Registry 专用密码 |
| `DEPLOY_SSH_KEY` | 可登录生产机的私钥（已建议使用专用部署密钥） |

生产机 compose 通过 `DAYBREAK_IMAGE`（写入 `.image.env`）指定镜像标签；手工更新可：

```bash
cd /opt/daybreak-site
DAYBREAK_IMAGE=crpi-.../daybreak-site:<tag> bash -c 'printf "DAYBREAK_IMAGE=%s\n" "$DAYBREAK_IMAGE" > .image.env && docker pull "$DAYBREAK_IMAGE" && docker compose --env-file .env --env-file .image.env up -d --force-recreate --no-deps web'
```


## 数据模型

| 名称 | 说明 |
| --- | --- |
| Users | 唯一管理员；`read/update/delete` 仅管理员，禁止通过 API 自建账号 |
| Media | 照片/视频，`card`/`thumb`/`hero` 三种尺寸，限制上传类型，被引用时禁止删除 |
| Players | 姓名、英文名、号码、位置、肖像、简介；`status` 草稿/已发布，slug 自动生成 |
| Albums | 标题、活动日期、封面、关联球员、照片数组；无封面或无照片时不允许发布 |
| Homepage（全局） | Slogan、Hero 图片/视频、精选球员、精选相册、简介 |
| SiteSettings（全局） | 站点标题、Logo、联系邮箱、社媒账号、默认分享图 |

草稿内容对匿名请求双重隔离：集合级 `read` 访问控制（覆盖 REST/GraphQL）+ 前台查询显式带 `status` 过滤。

## 与 PRD 的偏差

| PRD 条目 | 实际做法 | 原因 |
| --- | --- | --- |
| 第 8 节 样式方案 Tailwind | 已采用 Tailwind v4（`@theme` 定义色板与断点，组件类写在 `globals.css` 的 `@layer` 中） | 与 PRD 一致 |
| 第 8 节 动画 Motion | 未引入动画库，动效使用 CSS `transition` + `prefers-reduced-motion` | V1 只做必要动效，避免多一个运行时依赖 |
| 第 8 节 灯箱 PhotoSwipe | 已采用 PhotoSwipe v5，`<a data-pswp-width>` 结构在无 JS 时退化为直接打开原图 | 与 PRD 一致 |
| 第 8 节 字体 | 英文标题用 `next/font` 自托管 Barlow Condensed；中文走系统黑体 | 避免 Google Fonts 跨境阻塞，且 CJK 字体全量自托管需数 MB |
| 第 6 节 相册照片按球员筛选 | 未实现，仅保留相册级 `players` 关联 | PRD 标注为后续迭代 |
| 第 5.1 节 草稿发布 | 用 `status` 字段 + 访问控制实现，未启用 Payload 的 versions/draft 能力 | 单管理员场景，避免版本表与恢复 UI 的额外复杂度 |
| 第 9 节 登录保护 | 交给反向代理限流；应用层只做了密码长度（≥12）与 `PAYLOAD_SECRET` 强制校验 | 与部署层职责划分一致 |

## 上线前检查

- 替换 seed 的占位文案与纯色图，核对成立年份、社媒账号与联系邮箱。
- 后台上传正式 Logo（建议透明底 PNG/SVG），当前兜底用的是仓库里的 `public/logo.jpg`。
- 设置强随机 `PAYLOAD_SECRET`、强数据库密码，数据库只监听内网；配置 HTTPS 与备份。
- 确认 `media` 卷有备份，或已切到 S3。
- 用真实照片跑一遍移动端与「减少动态效果」下的首屏。
