# 使用说明

该文件描述如何运行并使用 `index.html` 页面查询 WD 值。

已添加文件：

- `index.html` — 页面主文件，包含手机号输入和查询按钮。
- `script.js` — 前端逻辑：手机号校验并调用 GET 接口获取并显示 `data` 值。
- `styles.css` — 基本样式。

使用步骤

1. 在浏览器中打开 `index.html`（推荐通过本地静态服务器而非直接 file:// 方式）。

2. 在输入框填入手机号（例如：13958119568），点击“查询”。

3. 页面将调用接口：

   `https://wd.api-app-prod.yuanlingshijie.com/dev/getWd?mobile=13958119568`

   并在页面上显示返回 JSON 中的 `data`（格式化为两位小数）。

本地启动建议（PowerShell）

如果你有 Python：

```powershell
# 在仓库根目录运行（会以 8000 端口提供静态文件）
python -m http.server 8000
```

然后在浏览器中访问 http://localhost:8000/index.html

关于 CORS

如果在浏览器控制台见到 CORS（跨域）相关错误，说明远端接口未开放浏览器直连的跨域权限。解决办法：

- 方案 A（临时）：在后端搭一个简单的代理，把请求在服务器端发出并返回给前端。
- 方案 B（开发时）：使用浏览器插件临时放宽 CORS（不推荐用于生产）。

如果需要，我可以再帮你添加一个小的 Node 代理示例（包括 `package.json` 和启动步骤）。
