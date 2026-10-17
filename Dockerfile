# ---- 依赖 ----
FROM node:22-alpine AS deps
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
# npm ci：严格按 lockfile 安装，避免构建结果随 registry 漂移
RUN npm ci --registry=https://registry.npmjs.org/

# ---- 构建 ----
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
# next build 会加载 payload.config 做类型/路由生成，但构建期拿不到运行时密钥，
# 因此只在构建阶段允许占位符；运行时仍必须提供真实 PAYLOAD_SECRET。
ENV PAYLOAD_ALLOW_PLACEHOLDER_SECRET=true
RUN npm run build && npm prune --omit=dev

# ---- 运行 ----
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
COPY --from=builder /app ./
# 本地媒体卷（uploads:/app/media）需要被非 root 进程写入，
# 命名卷首次创建时会沿用镜像内目录的属主，所以在这里先改好
RUN mkdir -p media && chown -R nextjs:nodejs media
USER nextjs
EXPOSE 3000
CMD ["npm", "run", "start", "--", "-H", "0.0.0.0"]
