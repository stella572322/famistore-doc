# Website

This website is built using [Docusaurus](https://docusaurus.io/), a modern static website generator.

## 進站密碼

整個知識庫需輸入一組共用密碼才能瀏覽（程式在 `src/theme/Root.tsx`、`src/components/PasswordGate/`）。

- **換密碼**：執行 `npm run set-password -- '新密碼'`（密碼用單引號包住），再 commit、push 到 `main`，自動部署後生效，舊密碼即失效。程式裡只存雜湊值，不存密碼原文。
- **定位是基本門檻**：擋得住拿到網址的一般人，但頁面內容仍以程式碼形式下載到瀏覽器，懂技術的人可繞過；不適合放真正機密的資料。
- **壞連結檢查**：正式建置的 HTML 不含內容，所以 `npm run build` 會先跑 `npm run check-links`（另外建一份含內容、不部署的版本）來抓壞連結。

## Installation

```bash
yarn
```

## Local Development

```bash
yarn start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

## Build

```bash
yarn build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

## Deployment

Using SSH:

```bash
USE_SSH=true yarn deploy
```

Not using SSH:

```bash
GIT_USER=<Your GitHub username> yarn deploy
```

If you are using GitHub pages for hosting, this command is a convenient way to build the website and push to the `gh-pages` branch.
