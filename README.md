# 🌱 家庭菜园产量记录系统

一个给家里 2-3 个人一起使用的菜园收获记录网页 App。
每个人都可以用手机或电脑打开同一个网址，记录每天摘了多少菜、统计产量、画图表、导出 Excel。

技术栈：React + Vite + Tailwind CSS + Supabase + Recharts + xlsx，前端部署在 GitHub Pages（免费、不需要服务器、不需要域名）。

---

## 目录

1. [项目结构](#项目结构)
2. [整体架构说明](#整体架构说明)
3. [从零开始部署 —— 第一步：创建 GitHub 仓库](#第一步创建-github-仓库)
4. [第二步：创建 Supabase 项目并建表](#第二步创建-supabase-项目并建表)
5. [第三步：本地运行项目](#第三步本地运行项目)
6. [第四步：部署到 GitHub Pages](#第四步部署到-github-pages)
7. [部署后手机如何访问](#部署后手机如何访问)
8. [常见问题](#常见问题)
9. [安全说明](#安全说明)

---

## 项目结构

```
family-garden-tracker/
├── index.html
├── package.json
├── vite.config.js          # GitHub Pages 部署的 base 路径在这里配置
├── tailwind.config.js
├── postcss.config.js
├── .env.example            # 环境变量示例，复制为 .env 后填写
├── .gitignore
├── supabase.sql            # Supabase 建表 SQL，一次性在后台运行
├── README.md
└── src/
    ├── main.jsx             # React 入口，使用 HashRouter
    ├── App.jsx               # 路由配置
    ├── index.css             # Tailwind + 全局样式
    ├── lib/
    │   ├── supabase.js       # Supabase 客户端初始化（在这里使用环境变量）
    │   ├── dateUtils.js       # 日期分组工具（天/周/月/年）
    │   ├── export.js          # Excel 导出逻辑
    │   └── units.js           # 常用单位列表
    ├── context/
    │   ├── AuthContext.jsx    # 密码登录 + 记录人姓名（存 localStorage）
    │   └── DataContext.jsx    # 蔬菜品种 / 收获记录的增删改查
    ├── components/
    │   ├── Login.jsx           # 登录页
    │   ├── Layout.jsx          # 顶部导航 + 手机端底部导航
    │   └── RecordEditModal.jsx # 编辑收获记录的弹窗
    └── pages/
        ├── QuickEntry.jsx   # 今日记录 / 快速录入
        ├── Vegetables.jsx   # 品种管理
        ├── History.jsx      # 历史记录 + 筛选
        ├── Stats.jsx        # 数据统计（按天/周/月/年/品种）
        ├── Charts.jsx       # 图表分析（柱状图/折线图）
        ├── ExportPage.jsx   # Excel 导出
        └── Settings.jsx     # 设置（姓名、退出登录）
```

## 整体架构说明

- **数据存储**：所有数据存放在 Supabase（一个免费的云端 PostgreSQL 数据库 + API 服务），网页直接通过浏览器调用 Supabase 提供的 API 读写数据，不需要你自己写后端服务器。
- **前端托管**：打包后的静态网页文件托管在 GitHub Pages，访问网址形如 `https://你的用户名.github.io/family-garden-tracker/`。
- **登录方式**：不是真正的账号系统，只是一个"访问密码"，密码写在环境变量 `VITE_APP_PASSWORD` 里，正确后整个浏览器会记住登录状态（存在 `localStorage`）。
- **多人协作**：家里所有人访问的是同一个网址、同一个 Supabase 数据库，所以大家看到的是同一份菜园数据，新增/编辑/删除会实时反映给所有人（刷新页面即可看到别人新增的记录）。

---

## 第一步：创建 GitHub 仓库

1. 注册/登录 [GitHub](https://github.com)。
2. 右上角点击 `+` -> `New repository`。
3. 仓库名建议填 `family-garden-tracker`（如果你用别的名字，后面有两个地方需要同步修改，下文会提醒）。
4. Visibility 选 `Public`（GitHub Pages 免费版需要公开仓库，除非你有付费的 GitHub 账号）。
5. 不需要勾选 "Add a README"，点击 `Create repository`。
6. 把这个项目的所有代码上传到这个仓库。如果你是新手，最简单的方式：

   ```bash
   # 在项目根目录下执行
   git init
   git add .
   git commit -m "init: 家庭菜园产量记录系统"
   git branch -M main
   git remote add origin https://github.com/你的用户名/family-garden-tracker.git
   git push -u origin main
   ```

> ⚠️ 如果你的仓库名不是 `family-garden-tracker`，需要同步修改两个地方：
> 1. `vite.config.js` 里的 `base: '/family-garden-tracker/'` 改成 `'/你的仓库名/'`
> 2. 没有其它地方需要改了，部署脚本会自动读取 `vite.config.js` 的配置

---

## 第二步：创建 Supabase 项目并建表

### 2.1 注册 Supabase 并创建项目

1. 打开 [https://supabase.com](https://supabase.com)，注册/登录账号（可以用 GitHub 账号直接登录）。
2. 点击 `New project`。
3. 填写项目名称，例如 `family-garden`。
4. 设置数据库密码（随便设置一个，记下来，但这个项目用不太到它，因为我们用的是 anon key 而不是直连数据库）。
5. 选择离你最近的区域（Region），例如新加坡或者其它亚洲节点。
6. 点击 `Create new project`，等待一两分钟项目初始化完成。

### 2.2 运行建表 SQL

1. 项目创建好之后，进入项目后台。
2. 左侧菜单点击 `SQL Editor`。
3. 点击 `New query`。
4. 打开本项目根目录下的 `supabase.sql` 文件，把里面**全部内容**复制粘贴到查询框里。
5. 点击右下角 `Run`（或按 Ctrl/Cmd + Enter）。
6. 看到 "Success. No rows returned" 或类似成功提示即可。这会创建 `vegetables` 和 `harvest_records` 两张表，并设置好基本的访问权限（RLS 策略），还会插入 3 个示例蔬菜品种方便你测试。

你也可以在左侧菜单的 `Table Editor` 里看到刚刚创建的两张表，确认建表成功。

### 2.3 找到 Supabase URL 和 anon key

1. 左侧菜单点击 `Project Settings`（齿轮图标）。
2. 点击 `API`。
3. 你会看到：
   - **Project URL**：形如 `https://xxxxxxxxxxxx.supabase.co`，这个就是 `VITE_SUPABASE_URL`
   - **Project API keys** 里的 **anon public**：一长串字符，这个就是 `VITE_SUPABASE_ANON_KEY`

⚠️ 不要使用 `service_role` 那个 key！那个 key 拥有完全权限，绝对不能放进前端代码里，只能用 `anon public` 这个 key。

---

## 第三步：本地运行项目

### 3.1 安装 Node.js

确保电脑上安装了 [Node.js](https://nodejs.org)（建议 18 或更高版本）。

### 3.2 安装依赖

```bash
npm install
```

### 3.3 配置环境变量

1. 复制一份 `.env.example`，改名为 `.env`：

   ```bash
   cp .env.example .env
   ```

2. 打开 `.env` 文件，填写三个值：

   ```bash
   VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=你的anon-public-key
   VITE_APP_PASSWORD=设置一个家庭访问密码
   ```

   > `.env` 文件已经在 `.gitignore` 里被忽略，不会被提交到 GitHub，这样你的密码和 key 不会被公开看到源码的人直接读到（不过下面"安全说明"部分会解释，打包后的网页代码里仍然包含这些值，请仔细阅读）。

### 3.4 启动开发服务器

```bash
npm run dev
```

终端会显示一个本地地址，通常是 `http://localhost:5173`，浏览器打开即可看到登录页，输入你在 `.env` 里设置的 `VITE_APP_PASSWORD` 即可进入。

---

## 第四步：部署到 GitHub Pages

这个项目已经配置好了 `gh-pages` 工具，部署只需要一行命令。

### 4.1 确认 `.env` 已正确配置

部署时会用你本地 `.env` 文件里的值来打包网页，所以**部署前请确保第三步的 `.env` 已经填写正确**。

### 4.2 执行部署命令

```bash
npm run deploy
```

这条命令会自动做两件事（已经在 `package.json` 里配置好）：
1. `predeploy` 自动先执行 `npm run build`，把项目打包成静态文件放进 `dist` 目录
2. `deploy` 把 `dist` 目录的内容推送到一个叫 `gh-pages` 的分支

### 4.3 在 GitHub 仓库里开启 Pages

第一次部署完成后：

1. 打开你的 GitHub 仓库页面。
2. 点击 `Settings` -> 左侧 `Pages`。
3. 在 "Build and deployment" 的 "Source" 里，选择 `Deploy from a branch`。
4. Branch 选择 `gh-pages`，文件夹选择 `/ (root)`，点击 `Save`。
5. 等待一两分钟，页面顶部会出现一个绿色提示，给出你的网址，形如：

   ```
   https://你的用户名.github.io/family-garden-tracker/
   ```

之后每次代码有更新，只需要再次运行 `npm run deploy` 即可重新发布。

---

## 部署后手机如何访问

1. 在手机浏览器（Safari / Chrome 都可以）里直接打开上面那个网址。
2. 输入家庭访问密码进入。
3. 建议把网址添加到手机主屏幕，这样打开起来和 App 差不多方便：
   - **iPhone（Safari）**：打开网页 -> 点击底部分享按钮 -> "添加到主屏幕"
   - **安卓（Chrome）**：打开网页 -> 右上角菜单 -> "添加到主屏幕"
4. 把这个网址发给家里其他人，大家都登录同一个密码、看到同一份数据。

---

## 常见问题

**Q: 打开网页一直显示"加载中"或者数据读取失败？**
A: 大概率是 `.env` 里的 `VITE_SUPABASE_URL` 或 `VITE_SUPABASE_ANON_KEY` 没填对，或者还没运行 `supabase.sql` 建表。检查浏览器控制台（F12）的报错信息会有提示。

**Q: 部署后页面空白，或者刷新页面变成 404？**
A: 检查 `vite.config.js` 里的 `base` 是否和你的 GitHub 仓库名一致。这个项目使用 `HashRouter`（网址里会带 `#`），正常情况下刷新不会 404。

**Q: 我想修改家庭访问密码怎么办？**
A: 修改本地 `.env` 里的 `VITE_APP_PASSWORD`，然后重新执行 `npm run deploy`。注意：旧密码登录过的设备 `localStorage` 里仍然记录着"已登录"状态，如果想让所有人都用新密码重新登录，需要清除浏览器缓存或者退出登录。

**Q: 多人同时编辑会冲突吗？**
A: 这个项目没有做实时同步和复杂的并发冲突处理，属于"够用就好"的家庭小工具。两个人几乎同时提交一般不会有问题，但如果两人同时编辑同一条记录，后保存的会覆盖先保存的。日常使用（一天里大家分别记录自己摘的菜）完全没问题。

**Q: 想加更多统计维度或者修改样式怎么办？**
A: 代码结构很简单，统计逻辑在 `src/pages/Stats.jsx`，图表在 `src/pages/Charts.jsx`，样式用的是 Tailwind 的 className，直接改就可以。

---

## 安全说明

请认真阅读这一部分。

- 这个项目的"密码登录"只是一个**前端的访问门槛**，用来防止陌生人随便打开网址就能看到/修改数据，**不是真正意义上的账号安全系统**。
- `VITE_SUPABASE_URL`、`VITE_SUPABASE_ANON_KEY`、`VITE_APP_PASSWORD` 这三个值，在 `npm run build` 打包之后，都会被写进最终生成的 JS 文件里，也就是说：**任何能访问你部署后网址的人，理论上都可以在浏览器开发者工具里看到这些值**，进而绕过密码、直接用 anon key 读写你的 Supabase 数据库。
- `supabase.sql` 里配置的 RLS 策略是"允许 anon 角色自由读写"，这是为了让一个没有后端服务器的纯前端项目能正常工作。这种方式**只适合家庭内部使用、数据不敏感**的小项目（比如这里的菜园产量记录）。
- **请不要**用这种架构存放：身份证号、银行卡信息、住址、医疗记录等真正敏感的个人隐私数据。
- 如果未来你希望有更强的安全性（比如真正的账号密码登录、每个人只能看自己的数据），建议引入 [Supabase Auth](https://supabase.com/docs/guides/auth) 做正式的用户认证，并把 RLS 策略改成基于 `auth.uid()` 的精细权限控制，这超出了本项目"家庭小工具"的定位，但 Supabase 官方文档里有详细教程。

---

祝你的家庭菜园大丰收 🍅🥒🥬
