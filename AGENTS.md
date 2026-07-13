<!-- BEGIN:project-constitution -->
# 我的烹飪手冊 — 系統憲法

> 本文件是本專案的最高行為準則。所有程式碼生成、修改、重構都必須嚴格遵守本憲法的每一條款。

---

## 【專案概述】

本專案是一個「私宴菜單編排系統」，核心理念：
- 以宴席地位（role）為骨架，組裝一份優雅、體面、從容上桌的私宴菜單
- 內建廚房戰情室秘笈（退冰節奏 × 烹調指南）
- 職人技術修煉手冊（正統料理黃金比例 × 操作步驟）
- 支援本機 localStorage 自動保存、版本遷移機制

---

## 【設計與美學原則】

### 第一條 — 襯線優雅 + 無襯線功能（Functional Duality）

擅長梳理複雜資訊（菜單數據、溫度時間、步驟流程），使用網格 (Grid) 與卡片 (Card) 系統，確保排版層級分明、邏輯清晰。

視覺語言分為兩層：
- **襯線層**（`font-serif`）：用於標題、強調、溫度數值，傳達料理的傳統與優雅
- **無襯線層**（`font-sans`）：用於內文、操作說明、數據表格，確保可讀性

### 第二條 — 極簡視覺（Refined Minimalism）

極致留白 (Negative Space)。盡量消除實體邊框 (border)，改用極柔和陰影或毛玻璃效果。

- `border` 只用於細線分割（`border-[color:var(--line)]`）
- 主要使用 `bg-[color:var(--surface)]` + `backdrop-blur-xl` 建立卡片深度
- 字體排版對比清晰，內文使用高雅深灰 `var(--muted)`

### 第三條 — 色彩紀律鎖定（Color Memory Lock）

絕對禁止每次生成不同色碼。已確認的品牌色定義為 CSS 變數（`--accent`, `--accent-warm`, `--accent-cool` 等），並嚴格覆用。

已定義色票（`globals.css :root`）：
```css
--background: #0c141c      /* 深邃夜空 */
--foreground: #f4efe8      /* 溫暖米白 */
--muted: #b6bcc0           /* 柔灰 */
--accent: #9cb8ac         /* 青苔綠 */
--accent-warm: #d4bcb0     /* 暖杏 */
--accent-strong: #efe1d5   /* 象牙 */
--accent-cool: #8ca8bd     /* 霧藍 */
```

### 第四條 — 高級微互動（Subtle Micro-interactions）

所有 hover, active 狀態必須有平滑過渡動畫（輕微上浮、微縮放），流暢且不喧賓奪主。

```css
/* 全域過渡設定 */
transition: color 180ms ease, background-color 180ms ease,
            border-color 180ms ease, transform 180ms ease, box-shadow 180ms ease;
```

### 第五條 — 智慧佔位圖（Smart Placeholders）

在尚未提供真實圖片的開發初期，所有圖片缺口必須生成「智慧佔位圖」。

```html
<!-- 格式：背景色 + 文字色 + AI 生圖提示詞 -->
<img
  src="https://placehold.co/600x400/1a2633/b6bcc0?text=食物示意圖\n青花魚一夜干炭烤"
  alt="青花魚一夜干炭烤示意圖"
  width="600" height="400"
  onerror="this.style.display='none'; this.nextElementSibling?.classList.remove('hidden')"
/>
```

---

## 【工程、架構與資料原則】

### 第六條 — DRY 原則與模組化（Modularity Lock）

生成任何新區塊前，必須先掃描 Codebase 尋找可複用的元件。嚴禁創造功能重疊的冗餘區塊。

已複用的元件模式：
- `DishCard` — 單道菜色卡片
- `StatCard` — 統計數值卡片
- `OutputPanel` / `GuestPreview` / `ThawGuideModal` — 面板式抽屜
- `LibraryManager` — 菜庫管理

### 第七條 — 語意化與可存取性（Semantic & Accessibility）

嚴格使用語意化 HTML 標籤。頁面必須具備嚴謹的標題階層 (H1 只能有一個，依序使用 H2, H3)。

- 所有 `<button>` 必須有 `type="button"` 或 `type="submit"`
- 所有 `<input>` / `<select>` 必須有 `<label>` 關聯
- 所有 `<img>` 強制加上有意義的 `alt` 屬性
- 所有圖示 (`lucide-react`) 若是裝飾用途，必須加上 `aria-hidden="true"`

### 第八條 — 防禦性 UI 與排版溢出防堵（Robustness Lock）

必須預判並處理「文字過長截斷」、「選項過多」、「無資料狀態」。

- 強制使用流體排版 (`max-w-full`, `min-w-0`)
- 針對多個並排元素（如按鈕列），必須強制加上 `flex-wrap` 換行
- 嚴禁讓元素超出邊界被生硬截斷 (Clipping)
- 全域絕對不允許出現橫向捲動軸

### 第九條 — 資料完整性與本地儲存（Data Integrity Lock）

本專案使用 localStorage 作為主要儲存介質。必須遵守：

- **版本锁定**：每次資料結構變更必須更新 `CURRENT_STORAGE_VERSION`
- **遷移機制**：`ensureStorageVersion` 負責偵測並遷移舊版資料
- **錯誤隔離**：所有 `JSON.parse` / `localStorage.getItem` 必須包在 `try-catch` 內
- **防止腐敗**：`sanitizeStoredDishes` / `sanitizeRoleDishLibrary` 負責清理髒資料

### 第十條 — 內容鎖定與排版解耦（Content Lock & Typography Decoupling）

絕對禁止在優化排版時，擅自增刪、改寫或縮減「食譜正文與知識內容」（退冰時間、烹調溫度、料理筆記）。

但在確保內容一字不漏的前提下，擁有該內容的「視覺排版絕對權限」，可以自由調整字體大小、行高、段落間距。

---

## 【字體與排版 SOP】

### 第十一條 — 字距反向律（Letter-Spacing Reverse Rule）

字距（letter-spacing）必須隨字級（font-size）反向調整：
- `≥ 3rem` 大字：letter-spacing ≤ 0.02em
- `≥ 2rem` 中型字：letter-spacing ≤ 0.04em
- 禁止在 `≥ 2.5rem` 大字使用 `≥ 0.06em` 字距（會導致字島效應）

### 第十二條 — 襯線行高下限（Serif Line-Height Floor）

襯線 display 大字（`font-serif`）最低 `line-height: 1.25`。`line-height < 1.15` 配襯線字會產生字島漂浮。

### 第十三條 — 中文長句斷行（CJK Line-Break Lock）

所有中文長句標題（總字當量 ≥ 18）必須套用 `text-wrap: balance`，確保多行斷行時行長接近。

---

## 【色彩 SOP】

### 第十四條 — 色彩變數鎖定（Color Variable Lock++）

所有 CSS 顏色（含漸層 stop、陰影 rgba）必須優先取用既有的 CSS 變數。禁止在 `style` 中寫死色碼。

驗證命令：
```bash
grep -rEn "color: #[0-9a-fA-F]{3,8}|background: #[0-9a-fA-F]{3,8}" src/ | grep -v "var(--"
```

---

## 【響應式 SOP】

### 第十五條 — 標準斷點鎖定（Breakpoint Lock）

全站斷點必須標準化，禁止隨意新增：
- `480px` — 小型手機
- `640px` — 手機橫向
- `768px` — 平板
- `1024px` — 桌面
- `1280px` — 大桌面

驗證命令：
```bash
grep -rEho "@media \(min-width|max-width: [0-9]+px\)" src/ | sort | uniq -c | sort -rn
```

---

## 【 Pre-flight Checklist 】

在生成任何新元件或頁面前，必須先跑以下檢查：

1. 掃描同類元件的 CSS 變數使用：`grep -rn "var(--" src/components/`
2. 掃描同類元件的字級字距模式：`grep -rn "font-size:\|letter-spacing:" src/components/`
3. 掃描是否已有可複用元件：`ls src/components/`
4. 確認新增色彩會集中在 `globals.css` `:root`
5. 確認新增斷點不超過 5 個標準值
6. 確認所有 font-size 寫死值 ≤ 6rem
7. 確認所有 `letter-spacing × font-size` 物理像素 ≤ 1px

---

## 【內建模廠資料模組】

本專案內建三組工廠資料，所有新增內容應優先注入這些模組：

| 模組 | 檔案 | 用途 |
|------|------|------|
| 退冰指南 | `src/data/thaw-guides.ts` | 魚蝦肉三大類的退冰方案與評分 |
| 烹調指南 | `src/data/cooking-guides.ts` | 油炸、氣炸、清蒸三大火候表 |
| 職人技術 | `src/data/culinary-techniques.ts` | 正統料理黃金比例、步驟、排錯指南 |

新增任何烹飪知識內容，應依性質歸入對應模組，避免另起爐灶。

---

## 【文案校對紀律】

### 第十六條 — 文案精煉檢查（Copy Refinement Lock）

所有 UI 文案（按鈕、標籤、引導句）生成後必須經過語意合理性校對：
- 按鈕或連結的措辭必須與其目的地主題一致
- 任何中文文案若與品牌詞庫不符，必須即時修正
- 「標題 + 補充句」必須遵循：一句具體價值主張 + 一句可信背書

---

## 【 Agent 協作紀律】

### 第十七條 — 先讀圖再回應（Visual-First Rule）

若用戶主動附上截圖或圖片，**必須先閱讀圖片內容**，再基於視覺資訊回應。嚴禁在未讀圖的情況下長篇描述解決方案。

驗證：用戶發圖後，Agent 第一次回應必須能準確引用圖中可見的 UI 元素、文字或狀態。

### 第十八條 — 封閉式提問一次為限（Once-and-Wait Rule）

Agent 發出封閉式決策問題（如「你想要 A 還是 B」）後，**必須等待用戶回答**，不得在同一次回應中重複發問。

違反行為模式：「你想要哪種？」（等待）「好我假設你選 A」（實際上用戶可能選 B）。

### 第十九條 — 新增 Public Type 前先查現有導出（Type Conflict Prevention）

新增任何 public-facing TypeScript 型別（如 `CopyTarget`、`DishFilter`）前，先確認 `src/types/` 目錄中是否已存在相同名稱或相似職能的型別。

驗證命令：
```bash
grep -rn "export type\|export interface" src/types/
```
若已存在，優先擴展既有型別，禁止在同一專案內建立功能重疊的同名型別。

---

## 【跨專案可移植性邊界】

本憲法包含專案特定的內容（色票、字體變數、功能模組名）。任何遷移或複用必須遵守：

**可移植的核心條款**：
- 設計哲學 5 條（極簡、功能雙層、色彩鎖定、微互動、佔位圖）
- 第 6-16 條的原則通用，但具體閾值需重新校準

**不可移植的專案特定條款**：
- 色票定義（--accent, --accent-warm 等）
- 襯線/無襯線字體配置
- 資料結構與 localStorage 版本管理邏輯

---

<!-- END:project-constitution -->
