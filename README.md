# WebApp 智能客服中心

```sh
npm install
npm run dev
```

`npm run build` 建置本機展示頁面，輸出到 `demo-dist/`。
`npm run build:lib` 建置 React 套件，輸出到 `dist/`。
可用 `npm pack` 產生 tarball，在宿主專案以 `npm i <tarball>` 安裝。

```jsx
import { SupportCenter } from 'webapp-support-center'
import 'webapp-support-center/styles.css'

<SupportCenter initialQuestionId="charge.start_failed" />
```

展示頁支援 `?questionId=charge.start_failed`。正式宿主可傳入操作、返回及郵件處理函式。交易資料由宿主驗證授權後透過 `loadReportContext` 傳入。正式客服電話可用 `supportPhone` 設定。各項操作與發行進度見 [PR 規劃](./docs/PR-PLAN.md)。

## 接入回報 API

將宿主已接好 API 的非同步函式傳給 `onSubmitReport`。

```jsx
<SupportCenter onSubmitReport={submitSupportReport} />
```

函式會收到 `categoryId`、`questionId`、`description` 和有填寫的選填欄位，
例如 `phone` 或 `cdrId`。API 確認成功後 resolve，失敗時 throw 或 reject，
UI 會顯示結果。API 路徑、認證和請求格式由宿主處理。省略此 prop 時使用 Email 回報。
