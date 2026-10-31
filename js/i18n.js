(() => {
  const STORAGE_KEY = "symbolencyclopedia-language";
  const translations = {
  "架空疑問展": "Archive of Fictional Questions",
  "記号アーカイブ": "Symbol Archive",
  "記号亜種アーカイブ": "Symbol Variant Archive",
  "事案アーカイブ": "Case Archive",
  "組織アーカイブ": "Organization Archive",
  "編纂組織について": "About the Archive",
  "⚙ 設定": "⚙ Settings",
  "高度な設定 & データベース": "Advanced Settings & Database",
  "フォント": "Font",
  "標準": "Standard",
  "標準（読みやすい）": "Standard (Readable)",
  "2045alphabet（ONVA文字）": "2045alphabet (ONVA script)",
  "明朝": "Mincho",
  "ゴシック": "Gothic",
  "見やすい表示": "Readable",
  "サンセリフ": "Sans-serif",
  "等幅": "Monospace",
  "読みづらい字体": "Hard-to-read fonts",
  "ACS FONT": "ACS FONT",
  "外観（テーマ）": "Appearance (Theme)",
  "ホワイト": "Light",
  "ダーク": "Dark",
  "古本": "Sepia",
  "背景アニメーション": "Background animation",
  "記号サイズ": "Symbol size",
  "小": "Small",
  "中": "Medium",
  "大": "Large",
  "表示設定": "Display settings",
  "検索ボックス": "Search box",
  "並べ替え": "Sorting",
  "作者フィルタ": "Author filter",
  "フィルタ": "Filters",
  "全ての種類": "All types",
  "記号": "Symbols",
  "事案": "Cases",
  "組織": "Organizations",
  "ロード": "Loading",
  "ロードを常にスキップ": "Always skip loading",
  "警告（動作）": "Warnings",
  "赤の警告を無効にする": "Disable red warnings",
  "オンにすると赤（高リスク）でも警告を表示せず直接開きます。": "When enabled, high-risk red items open without a warning.",
  "アーカイブ名": "Archive name",
  "データベース": "Database",
  "＋ 新規追加": "+ Add new",
  "JSON出力": "Export JSON",
  "JSON読込": "Import JSON",
  "DB初期化": "Reset database",
  "DBは localStorage に保存されます。JSONでの入出力に対応。": "The database is saved in localStorage. JSON import and export are supported.",
  "フィルタをクリア": "Clear filters",
  "アクセス制限：": "Access restriction:",
  "このアーカイブには混沌的・概念的コンテンツが含まれます。閲覧操作は記録される可能性があります。": "This archive contains chaotic and conceptual content. Viewing activity may be recorded.",
  "閲覧は自己責任で行ってください。": "View at your own discretion.",
  "一部の記録は復元不可の損失を伴う場合があります（創作内警告）。": "Some records may involve irreversible loss (fictional warning).",
  "上記を読み理解しました": "I have read and understood the above",
  "承認して進む": "Accept and continue",
  "キャンセル（トップ）": "Cancel (home)",
  "注：この警告は演出です。実際の影響はあなた次第です。": "Note: This warning is for atmosphere. Any actual effect is up to you.",
  "システムを初期化中...": "Initializing system...",
  "← ホームへ戻る": "← Back to home",
  "記号亜種": "Symbol variants",
  "アンケート": "Survey",
  "名前、意味、キーワードを検索...": "Search names, meanings, and keywords...",
  "全ての危険度": "All risk levels",
  "🔵 低": "🔵 Low",
  "🟡 中": "🟡 Medium",
  "🔴 高": "🔴 High",
  "全てのタグ": "All tags",
  "すべての作者": "All authors",
  "登録順 (昇順)": "Date added (ascending)",
  "登録順 (降順)": "Date added (descending)",
  "名前順": "Name",
  "📝 アンケート": "📝 Survey",
  "ご意見や感想はこちらから送れます。": "Send us your feedback or comments here.",
  "該当する項目は見つかりませんでした。": "No matching entries were found.",
  "現在図鑑に登録されているのはここまでです。": "You have reached the end of the current archive.",
  "提供：世界記号統一団体": "Provided by: Universal Symbol Standardization Organization",
  "提供：世界記号統一団体・亜種管理局": "Provided by: Universal Symbol Standardization Organization, Variant Management Office",
  "提供：記録保全課": "Provided by: Records Preservation Division",
  "提供：世界記号統一団体・組織監査室": "Provided by: Universal Symbol Standardization Organization, Organization Audit Office",
  "ご意見・感想を送る専用タブ": "A dedicated tab for feedback",
  "組織憲章": "Charter of the Organization",
  "このアーカイブは世界に散らばった「問い」の断片を収集しています。": "This archive collects fragments of questions scattered across the world.",
  "【警告 / Disclaimer】": "【Warning / Disclaimer】",
  "本ウェブサイトの内容はすべて架空の記号、組織です。現実世界に実在する組織とは一切の関わりがありません。": "All symbols and organizations on this website are fictional and have no connection to real-world organizations.",
  "ようこそ架空疑問展へ": "Welcome to the Archive of Fictional Questions",
  "ここでは主に記号として認められていない記号や、異常な能力を獲得した記号を取り扱っています。": "This archive mainly documents symbols that are not recognized as symbols, or symbols that have acquired unusual abilities.",
  "その他に、異常な技術を会得した組織もアーカイブされています。": "Organizations with unusual technologies are also archived here.",
  "このプロジェクトは現在T.S氏が運営、管理をしています。": "This project is currently operated and maintained by T.S.",
  "ご意見や感想は上の「アンケート」タブから送れます。": "You can send feedback through the Survey tab above.",
  "📖 図鑑の使い方": "📖 How to use the archive",
  "カードをクリック → 危険度ベースの詳細モーダルを表示。": "Click a card to open its risk-based details.",
  "赤（🔴）は概念的・社会的リスクを強調。閲覧時は二段階確認が入ります。": "Red (🔴) indicates conceptual or social risk and requires two-step confirmation.",
  "サイドメニューで危険度・タグ・種類でフィルタ可能。": "Filter by risk, tags, or type in the side menu.",
  "DB機能で JSON 出力 / 読込 / 初期化ができます。": "Use the database tools to export, import, or reset JSON data.",
  "このサイトは複数の組織、個人の協力のもと制作されています。": "This site was created with contributions from several organizations and individuals.",
  "CED財団": "CED Foundation",
  "世界記号統一団体": "Universal Symbol Standardization Organization",
  "NodeLABO": "NODE LAB",
  "T.S氏": "T.S.",
  "BIB": "BIB",
  "閉じる": "Close",
  "戻る": "Back",
  "レコード編集": "Edit record",
  "種類": "Type",
  "自動生成": "Auto-generated",
  "名前 / タイトル": "Name / Title",
  "例: 句点和疑問符": "e.g. Period Question Mark",
  "作者 / 所属": "Author / Affiliation",
  "例: 編纂局 / 第三観測課": "e.g. Editorial Bureau / Third Survey Division",
  "危険度": "Risk level",
  "画像パス": "Image path",
  "タグ（カンマ区切り）": "Tags (comma-separated)",
  "疑問, 概念, 文体": "question, concept, style",
  "概要": "Summary",
  "一覧に表示される短い説明": "Short description shown in the list",
  "詳細": "Details",
  "詳細説明 / 記録文": "Detailed description / record",
  "読み方（記号のみ）": "Reading (symbols only)",
  "くてんわぎもんふ": "kuten wa gimon fu",
  "由来（記号のみ）": "Origin (symbols only)",
  "民間起源...": "Civilian origin...",
  "使用（記号のみ）": "Usage (symbols only)",
  "短い詰問の末尾など": "For example, at the end of a short question",
  "活動（組織のみ）": "Activity (organizations only)",
  "記号調査、登録、保全...": "Symbol research, registration, preservation...",
  "発生日（事案のみ）": "Date (cases only)",
  "不明 / 2026-03-19": "Unknown / 2026-03-19",
  "関連ID（事案のみ）": "Related IDs (cases only)",
  "事案ログID（記号/組織/事案共通、カンマ区切り）": "Case log IDs (symbols, organizations, and cases; comma-separated)",
  "元の記号ID（亜種のみ）": "Parent symbol ID (variants only)",
  "保存": "Save",
  "キャンセル": "Cancel",
  "⚠ 警告": "⚠ Warning",
  "この記号は認識・記録に影響を与える可能性があります。閲覧を進めると最終確認が必要になります。": "This symbol may affect perception or records. Continuing requires final confirmation.",
  "次へ（最終確認）": "Next (final confirmation)",
  "最終確認 — 閲覧の同意": "Final Confirmation — Consent to View",
  "この記録は復元不可の影響を残す可能性があります。続行する場合は下の入力欄に": "This record may have irreversible effects. To continue, type",
  "この記録は復元不可の影響を残す可能性があります。続行する場合は下の入力欄に": "This record may have irreversible effects. To continue, type",
  "と入力して「最終確認」を押してください。": "in the field below and select “Final confirmation.”",
  "ここに「閲覧」と入力してください": "Type “VIEW” here",
  "閲覧": "VIEW",
  "最終確認": "Final confirmation",
  "キャンセルは無効化されました": "Cancel has been disabled",
  "アクセス拒否": "Access denied",
  "種類の保存先が見つかりません。": "Could not find a destination for this type.",
  "DBを読み込みました。": "Database imported.",
  "JSONの読み込みに失敗しました。": "Failed to import JSON.",
  "DBを初期化します。保存済みデータはすべて消えます。よろしいですか？": "Reset the database? All saved data will be deleted.",
  "DBを初期化しました。": "Database reset.",
  "全て": "All",
  "アーカイブ": "Archive",
  "高危険度": "High Risk",
  "中危険度": "Moderate Risk",
  "低危険度": "Low Risk",
  "高リスク。閲覧・流用には注意が必要です。": "High risk. Use caution when viewing or reusing this entry.",
  "中リスク。文脈依存で誤用が起こる可能性があります。": "Moderate risk. Misuse may occur depending on context.",
  "低リスク。通常の閲覧・参照用です。": "Low risk. Suitable for normal viewing and reference.",
  "名称：": "Name:",
  "作者：": "Author:",
  "読み：": "Reading:",
  "元の記号：": "Original symbol:",
  "亜種メモ：": "Variant note:",
  "仕様はほぼ同じです。見た目の差分を中心に扱います。": "The rules are mostly the same; this entry focuses on visual differences.",
  "所属 / 組織：": "Affiliation / Organization:",
  "活动：": "Activity:",
  "活動：": "Activity:",
  "レベル：": "Level:",
  "使命：": "Mission:",
  "時代：": "Era:",
  "状態：": "Status:",
  "範囲：": "Scope:",
  "日付：": "Date:",
  "由来：": "Origin:",
  "用途：": "Usage:",
  "使用例：": "Example:",
  "概要：": "Summary:",
  "詳細：": "Details:",
  "タグ：": "Tags:",
  "関連記号：": "Related symbols:",
  "関連事案：": "Related cases:",
  "関連組織：": "Related organizations:",
  "登録済みの亜種：": "Registered variants:",
  "事案記録：": "Case records:",
  "関連事案を開く": "Open related case",
  "記録ID:": "Record ID:",
  "危険度:": "Risk level:",
  "高リスク": "High risk",
  "中リスク": "Moderate risk",
  "低リスク": "Low risk",
  "いいね": "Like",
  "♡ いいね": "♡ Like",
  "♥ いいね済み": "♥ Liked",
  "亜種": "Variant",
  "亜種を登録": "Add variant",
  "レコード追加": "Add record",
  "記号資料": "Symbol record",
  "事案資料": "Case record",
  "組織資料": "Organization record",
  "検索": "Search",
  "名称": "Name",
  "作者": "Author",
  "言語": "Language",
  "データベースを読み込んでいます...": "Connecting to database...",
  "古い疑問を読み込んでいます...": "Loading old questions...",
  "異世界の論理を構築中...": "Building the logic of another world...",
  "意味のネットワークを走査中...": "Scanning the network of meanings...",
  "過去の問いかけを復元しています...": "Restoring past questions...",
  "記号の解釈を同期中...": "Syncing symbol interpretations...",
  "未解決の矛盾を整理しています...": "Sorting unresolved contradictions...",
  "アーカイブを展開しています...": "Unpacking the archive...",
  "視覚情報をレンダリング中...": "Rendering visual data...",
  "準備が整いました。": "Ready."
};
  const originalText = new WeakMap();
  const originalAttributes = new WeakMap();
  const langSelect = document.getElementById("language-select");
  const normalize = value => value.trim().replace(/\s+/g, " ");
  const currentLanguage = () => localStorage.getItem(STORAGE_KEY) === "en" ? "en" : "ja";

  function translateTextNode(node, language) {
    if (node.parentElement?.closest("[data-i18n-skip]")) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const original = originalText.get(node);
    if (language === "ja") {
      if (node.nodeValue !== original) node.nodeValue = original;
      return;
    }
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const key = normalize(original);
    let value = translations[key];
    if (value === undefined) {
      value = key
        .replace(/^作者：/, "Author: ")
        .replace(/^記録ID:/, "Record ID:")
        .replace(/^危険度:/, "Risk level:")
        .replace(/^活動：/, "Activity: ")
        .replace(/^報告書資料$/, "Report")
        .replace(/^記号資料$/, "Symbol record")
        .replace(/^事案資料$/, "Case record")
        .replace(/^組織資料$/, "Organization record");
    }
    if (value !== undefined) {
      const translated = leading + value + trailing;
      if (node.nodeValue !== translated) node.nodeValue = translated;
    }
  }

  function translateElement(element, language) {
    for (const attr of ["placeholder", "title", "aria-label"]) {
      if (!element.hasAttribute(attr)) continue;
      let originals = originalAttributes.get(element);
      if (!originals) { originals = {}; originalAttributes.set(element, originals); }
      if (!(attr in originals)) originals[attr] = element.getAttribute(attr);
      const original = originals[attr];
      element.setAttribute(attr, language === "en" ? (translations[normalize(original)] ?? original) : original);
    }
  }

  function translateTree(root = document) {
    const language = currentLanguage();
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root, language);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node, language);
  }

  function setLanguage(language) {
    const chosen = language === "en" ? "en" : "ja";
    localStorage.setItem(STORAGE_KEY, chosen);
    document.documentElement.lang = chosen;
    if (langSelect) langSelect.value = chosen;
    translateTree(document);
    window.dispatchEvent(new Event("site-language-change"));
    const titleJa = "架空疑問展 | 記号アーカイブ（DB版）";
    document.title = chosen === "en" ? "Archive of Fictional Questions | Symbol Archive" : titleJa;
    const locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.content = chosen === "en" ? "en_US" : "ja_JP";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = chosen === "en"
      ? "A fictional archive of symbols, cases, and organizations. Search by risk level or tag and explore detailed records."
      : "架空の記号・事案・組織を集めた図鑑型アーカイブ。危険度やタグで検索し、詳細記録を閲覧できます。";
  }

  let translationFrame = 0;
  const observer = new MutationObserver(() => {
    if (currentLanguage() !== "en" || translationFrame) return;
    translationFrame = requestAnimationFrame(() => {
      translationFrame = 0;
      observer.disconnect();
      translateTree(document.body);
      observer.observe(document.body, { childList: true, subtree: true });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (langSelect) langSelect.addEventListener("change", () => setLanguage(langSelect.value));
  const nativeAlert = window.alert.bind(window);
  const nativeConfirm = window.confirm.bind(window);
  window.alert = message => nativeAlert(currentLanguage() === "en" ? (translations[normalize(String(message))] ?? message) : message);
  window.confirm = message => nativeConfirm(currentLanguage() === "en" ? (translations[normalize(String(message))] ?? message) : message);
  setLanguage(currentLanguage());
})();
