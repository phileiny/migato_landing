# Migato 等候名單 Landing Page

純靜態單頁，收 email 進等候名單。託管於 GitHub Pages（常駐、免費）。

- `index.html` — 單檔頁面（樣式內嵌，無建置步驟）
- `assets/` — 品牌圖（Migato 生活照、起源故事圖）
- `waitlist-sheet.gs` — Google Apps Script 收件端點（email 寫進你的 Google 試算表）
- `.nojekyll` — 讓 GitHub Pages 直接出純靜態，不跑 Jekyll

---

## 上線三步

### 1. Google Sheets 收 email（5 分鐘）

email 提交會 append 進你的 Google 試算表 —— 一張活的名單，可隨時看/排序/篩選/匯出，免費無上限。

1. 用 `phileiny@gmail.com` 開一張新試算表，命名「米果等候名單」
2. 試算表選單 → 擴充功能 → Apps Script，把 `waitlist-sheet.gs` 全部內容貼進去，存檔
3. 右上「部署」→「新增部署作業」→ 類型「網頁應用程式」
   - 執行身分：我（你自己）；誰可以存取：**任何人**（重要，否則送不進來）
4. 部署 → 授權 → 複製它給的網址，長相 `https://script.google.com/macros/s/AKfyc..../exec`
5. 把 `index.html` 裡**一處** `YOUR_APPS_SCRIPT_URL`（搜尋得到，只有 1 個）換成這個 /exec 網址
6. （可選）想同時收通知信：把 `waitlist-sheet.gs` 裡 `MailApp.sendEmail` 那行的註解拿掉，重新部署

> 詳細設定步驟也寫在 `waitlist-sheet.gs` 檔頭註解。改了 .gs 要「管理部署作業 → 編輯 → 版本選新版本」才生效。

### 2. GitHub Pages 部署（5 分鐘，免費常駐）

這是獨立 repo，所有檔案都在 root，Pages 直接吃 root 即可。

1. 建一個 public repo（例如 `migato-landing`），把本資料夾 push 上去
2. repo → Settings → Pages
3. Source 選 **Deploy from a branch**，Branch 選 `main` / `/(root)`，Save
4. 等 1–2 分鐘 → 拿到 `https://<帳號>.github.io/migato-landing/`，即 live

> 改檔 `git push` 後，Pages 會自動重新部署。

### 3. （可選）自訂子網域

`migato.aidream.com.tw` 已被會關機的 VM／OTA 用掉，**不要**拿來指 landing page。
建議用子網域 `hi.migato.aidream.com.tw`（呼應喚醒詞「嗨米果」）：
- repo → Settings → Pages → Custom domain 填 `hi.migato.aidream.com.tw`（會自動產生 `CNAME` 檔）
- 到 DNS 幫 `hi.migato` 加一筆 **CNAME** 指向 `<帳號>.github.io`
- 勾選 **Enforce HTTPS**（Pages 會自動發憑證）
- ⚠️ 不要動到 `migato.aidream.com.tw` 那筆 A record（指向 VM／OTA）
- 6 月只求起跑：先用 `github.io` 網址導流也完全可以，網域之後再接

---

## 本機預覽

```bash
python3 -m http.server 8000
# 開 http://localhost:8000
```

## 之後可做（非本次，守 YAGNI）

- 圖片壓縮（目前 PNG 較大，可轉 WebP 加速載入）
- GA / Meta Pixel 追蹤轉換
- 多語版本、A/B 文案
- 名單匯入 migato-platform（等正式會員系統時）
