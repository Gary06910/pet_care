# 沐爪宠物洗护预约页

这是一个宠物洗护门店展示与预约项目，页面品牌为“沐爪宠物洗护”。项目使用 Next.js、React、TypeScript 和 Tailwind CSS 构建，已部署到 Netlify。

线上地址：https://pet-care-gary06910.netlify.app

## 功能

- 门店服务展示：基础香浴、造型精修、皮毛 SPA、接送服务。
- 洗护流程说明：到店评估、分区清洁、吹干修整、交付反馈。
- 价格套餐展示：小型犬基础洗护、猫咪温和洗护、造型美容套餐。
- 在线预约表单：提交称呼、电话、宠物类型、预约项目、日期、时间和宠物情况。
- 预约数据入库：`/api/appointments` 会把表单数据写入 PostgreSQL 数据库。
- 门店信息展示：地址、电话、微信和门店地图。
- 顾客评价轮播：桌面端自动滚动，用户开启减少动态效果时改为可横向滚动列表。

## 技术栈

- Next.js
- React
- TypeScript
- Tailwind CSS v4
- PostgreSQL，当前使用 `pg` 连接
- Netlify，使用 `@netlify/plugin-nextjs` 适配 Next.js 部署

## 项目结构

```text
src/app/page.tsx                  主页面与预约表单
src/app/api/appointments/route.ts 预约提交接口
src/app/layout.tsx                页面元信息与语言设置
src/app/globals.css               全局样式、颜色变量和轮播动画
public/assets/                    页面图片资源
netlify.toml                      Netlify 构建与 Next.js 插件配置
.env.example                      环境变量示例
```

## 本地运行

先安装依赖：

```bash
npm install
```

复制环境变量示例，并填入真实数据库连接串：

```bash
cp .env.example .env.local
```

启动开发服务器：

```bash
npm run dev
```

常用命令：

```bash
npm run build
npm run lint
npm run start
```

## 环境变量

预约接口需要配置：

```env
DATABASE_URL=""
```

本地开发时放在 `.env.local`。部署到 Netlify 时，需要在 Netlify 项目的环境变量中配置 `DATABASE_URL`，并让它对生产环境和函数运行环境生效。

不要把真实数据库连接串提交到 GitHub。

## 部署

项目已配置 `netlify.toml`：

```toml
[build]
command = "npm run build"
publish = ".next"

[[plugins]]
package = "@netlify/plugin-nextjs"
```

Netlify 会在云端运行 `npm run build`，并通过 `@netlify/plugin-nextjs` 部署 Next.js 页面和 API 路由。

## 说明

当前预约接口会向 `public.appointments` 表写入数据。数据库表结构需要包含以下字段：

- `customer_name`
- `phone`
- `pet_type`
- `service`
- `visit_date`
- `time_slot`
- `note`
- `id`
- `created_at`
