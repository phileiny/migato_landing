/**
 * 米果等候名單 — Google Sheets 收件端點（Google Apps Script）
 *
 * 作用：landing page 的表單送 email 進來，這支 script 把每一筆 append 成試算表的一列。
 * 你會有一張活的試算表可以隨時看 / 排序 / 篩選 / 匯出 CSV，免費無上限。
 *
 * ── 設定步驟（一次性，約 5 分鐘）─────────────────────────────
 * 1. 用 phileiny@gmail.com 開一張新的 Google 試算表，命名「米果等候名單」
 * 2. 試算表選單 → 擴充功能 → Apps Script
 * 3. 把本檔全部內容貼進去（覆蓋預設的 myFunction），存檔
 * 4. 右上「部署」→「新增部署作業」→ 類型選「網頁應用程式」
 *      - 執行身分：我（你自己）
 *      - 誰可以存取：「任何人」（重要，否則 landing 送不進來）
 * 5. 部署 → 授權（會跳 Google 帳號授權，按進階 → 前往…允許）
 * 6. 複製它給的「網頁應用程式」網址，長相：
 *      https://script.google.com/macros/s/AKfyc..../exec
 * 7. 把這個 /exec 網址貼給 Claude，Claude 幫你換進 index.html
 *
 * 改了這支 script 後要「重新部署」（管理部署作業 → 編輯 → 版本選「新版本」）才會生效。
 * ───────────────────────────────────────────────────────
 */

var SHEET_NAME = 'waitlist';
var HEADERS = ['時間', 'Email', '來源'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(30000); // 防併發同時寫同一列
  try {
    var params = (e && e.parameter) || {};

    // 蜜罐：機器人會填 _gotcha，填了就當成功但不記錄
    if (params._gotcha) {
      return _json({ ok: true });
    }

    var email = (params.email || '').trim();
    if (!email) {
      return _json({ ok: false, error: 'no email' });
    }

    var sheet = _getSheet();
    sheet.appendRow([new Date(), email, params._source || '']);

    // ── 想同時收通知信就把下面這行的註解拿掉 ──
    // MailApp.sendEmail('phileiny@gmail.com', '米果等候名單新登記', email + '（來源：' + (params._source || '') + '）');

    return _json({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

// 直接用瀏覽器開 /exec 時給個友善回應，方便確認部署成功
function doGet() {
  return _json({ ok: true, service: 'migato-waitlist' });
}

function _getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS); // 第一次自動補表頭
  }
  return sheet;
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
