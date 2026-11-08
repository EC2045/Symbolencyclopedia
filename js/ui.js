function setPolishedEnglishNames(enabled) {
  localStorage.setItem('symbolencyclopedia-polished-names', enabled ? 'true' : 'false');
  const toggle = document.getElementById('polished-name-toggle');
  if (toggle) toggle.checked = !!enabled;
  if (document.documentElement.lang === 'en' && state?.db) {
    renderCurrentArchive();
    if (state.currentItem) openUnifiedDetail(state.currentItem.type, state.currentItem.id);
  }
}
window.setPolishedEnglishNames = setPolishedEnglishNames;

const ENGLISH_ARCHIVE_NAMES = Object.freeze({
  "句点和疑問符": "Japanese Period Question",
  "句点和疑問符（亜種）": "Japanese Period Question (Variant)",
  "句点和感嘆符": "Japanese Period Exclamation",
  "句点和感嘆符（亜種）": "Japanese Period Exclamation (Variant)",
  "疲感嘆符": "Tired Exclamation",
  "疲感嘆符（亜種）": "Tired Exclamation (Variant)",
  "感嘆謝符": "Thank-You Exclamation",
  "読点和疑問符": "Japanese Comma Question",
  "読点和感嘆符": "Japanese Comma Exclamation",
  "超疑問符": "Super Question",
  "超疑問符（亜種）": "Super Question (Variant)",
  "二重否符": "Double Negation Mark",
  "似煮符": "Similar Boiling Mark",
  "俯瞰符": "Top-View Mark",
  "不完全疑問符": "Incomplete Question Mark",
  "ハイパーピリオド": "Hyper Period",
  "不透明疑問符": "Opaque Question Mark",
  "検閲符": "Censorship Mark",
  "真実 of 鍵": "Truth of Key",
  "ベタクラメーション": "Betaclamation",
  "PCの究極権利": "Super Power of PC",
  "デジタル バーンアウト": "Digital Burnout",
  "ゼット サンド": "Z Sand",
  "アット：β": "At: Beta",
  "多層疑問符": "Multi-Layer Question Mark",
  "破裂感嘆符": "Burst Exclamation",
  "迷宮疑問符": "Labyrinth Question",
  "静寂感嘆符": "Silence Exclamation",
  "断片疑問符": "Fragment Question",
  "共鳴感嘆符": "Resonance Exclamation",
  "透過疑問符": "Transparent Question",
  "束縛感嘆符": "Binding Exclamation",
  "浸透疑問符": "Permeating Question",
  "閃光感嘆符": "Flash Exclamation",
  "忘却疑問符": "Forgetful Question",
  "反響感嘆符": "Boomerang Exclamation",
  "未完疑問符": "Half-Finished Question",
  "極小感嘆符": "Tiny Exclamation",
  "無限疑問符": "Infinite Question",
  "不完全超立方体": "Incomplete Hypercube",
  "事案007-A": "Incident 007-A",
  "事案012-A": "Incident 012-A",
  "事案014-A": "Incident 014-A",
  "事案007-014-A": "Incident 007-014-A",
  "架空疑問展": "Archive of Fictional Questions",
  "世界記号統一団体": "World Symbol Unification Organization",
  "同一アート作家 R": "Artist R",
  "CED財団": "CED Foundation",
  "NodeLABO": "NodeLABO",
  "BIB": "BIB"
});

const CHINESE_ARCHIVE_NAMES = Object.freeze({
  "句点和疑問符": "句点问号·库腾瓦基蒙符",
  "句点和疑問符（亜種）": "句点问号·库腾瓦基蒙符（变体）",
  "句点和感嘆符": "句点惊叹符·库腾坎坦符",
  "句点和感嘆符（亜種）": "句点惊叹符·库腾坎坦符（变体）",
  "疲感嘆符": "疲惫惊叹符·兰坦符",
  "疲感嘆符（亜種）": "疲惫惊叹符·兰坦符（变体）",
  "感嘆謝符": "致谢惊叹符·坎坦谢符",
  "読点和疑問符": "逗号问号符",
  "読点和感嘆符": "逗号惊叹符",
  "超疑問符": "深渊疑问符·超问符",
  "超疑問符（亜種）": "深渊疑问符·超问符（变体）",
  "二重否符": "双重否定符",
  "似煮符": "似煮符·西尼符",
  "俯瞰符": "俯瞰者符",
  "不完全疑問符": "无需作答的疑问符",
  "ハイパーピリオド": "终止句点符",
  "不透明疑問符": "雾隐疑问符",
  "検閲符": "涂改审查符",
  "真実 of 鍵": "真理之钥",
  "ベタクラメーション": "贝塔克莱梅申·渐强惊叹符",
  "PCの究極権利": "PC根权限符",
  "デジタル バーンアウト": "数字倦怠符",
  "ゼット サンド": "Z形思维回环·泽特沙",
  "アット：β": "永远测试版·艾特贝塔",
  "多層疑問符": "套层疑问符",
  "破裂感嘆符": "爆裂惊叹符",
  "迷宮疑問符": "迷宫疑问符",
  "静寂感嘆符": "静默惊叹符",
  "断片疑問符": "碎片疑问符",
  "共鳴感嘆符": "共鸣惊叹符",
  "透過疑問符": "透视疑问符",
  "束縛感嘆符": "束缚惊叹符",
  "浸透疑問符": "渗疑符·浸透疑问符",
  "閃光感嘆符": "闪念惊叹符",
  "忘却疑問符": "遗忘疑问符",
  "反響感嘆符": "回响惊叹符·反响符",
  "未完疑問符": "未竟疑问符",
  "極小感嘆符": "微末惊叹符",
  "無限疑問符": "无尽疑问符",
  "不完全超立方体": "残缺超立方体",
  "事案007-A": "异常事件 007-A",
  "事案012-A": "异常事件 012-A",
  "事案014-A": "异常事件 014-A",
  "事案007-014-A": "异常事件 007-014-A",
  "架空疑問展": "虚构疑问档案馆",
  "世界記号統一団体": "国际符号标准组织",
  "同一アート作家 R": "Artist R",
  "CED財団": "CED基金会",
  "NodeLABO": "NodeLABO",
  "BIB": "BIB"
});
const ESPERANTO_ARCHIVE_NAMES = Object.freeze({
  "句点和疑問符": "Punktodemanda signo (Kuten wa gimon fu)",
  "句点和疑問符（亜種）": "Punktodemanda signo (varianto)",
  "句点和感嘆符": "Punktoekkria signo (Kuten wa kantan fu)",
  "句点和感嘆符（亜種）": "Punktoekkria signo (varianto)",
  "疲感嘆符": "Laca kria signo",
  "疲感嘆符（亜種）": "Laca kria signo (varianto)",
  "感嘆謝符": "Dankokrio",
  "読点和疑問符": "Komdemanda signo",
  "読点和感嘆符": "Komkria signo",
  "超疑問符": "Abisma demando",
  "超疑問符（亜種）": "Abisma demando (varianto)",
  "二重否符": "Duobla negacia signo",
  "似煮符": "Bol- kaj simil-signo",
  "俯瞰符": "Superrigarda signo",
  "不完全疑問符": "Neresponda demando",
  "ハイパーピリオド": "Fina punktsigelo",
  "不透明疑問符": "Nebula demando",
  "検閲符": "Cenzura sigelo",
  "真実 of 鍵": "Ŝlosilo al la vero",
  "ベタクラメーション": "Malrapide kreskanta kria signo",
  "PCの究極権利": "Radikpermesa signo",
  "デジタル バーンアウト": "Reta elĉerpiĝo",
  "ゼット サンド": "Pensociklo",
  "アット：β": "Eterna beta",
  "多層疑問符": "Rekursia demando",
  "破裂感嘆符": "Eksploda kria signo",
  "迷宮疑問符": "Labirinta demando",
  "静寂感嘆符": "Silenta mirego",
  "断片疑問符": "Fragmenta demando",
  "共鳴感嘆符": "Komuna mirego",
  "透過疑問符": "Penetra demando",
  "束縛感嘆符": "Paraliza kria signo",
  "浸透疑問符": "Enfiltriĝa dubo",
  "閃光感嘆符": "Fulma kompreno",
  "忘却疑問符": "Forgesiĝanta demando",
  "反響感嘆符": "Eĥa kria signo",
  "未完疑問符": "Neformita demando",
  "極小感嘆符": "Eta kria signo",
  "無限疑問符": "Senfina demando",
  "不完全超立方体": "Frakturita hiperkubo",
  "事案007-A": "Okazaĵo 007-A",
  "事案012-A": "Okazaĵo 012-A",
  "事案014-A": "Okazaĵo 014-A",
  "事案007-014-A": "Okazaĵo 007-014-A",
  "架空疑問展": "Arkivo de fikciaj demandoj",
  "世界記号統一団体": "Monda Simbolnormiga Organizo",
  "同一アート作家 R": "Artist R",
  "CED財団": "Fondaĵo CED",
  "NodeLABO": "NodeLABO",
  "BIB": "BIB"
});

const POLISHED_ENGLISH_NAMES = Object.freeze({
  "句点和疑問符": "Assertive Query",
  "句点和疑問符（亜種）": "Assertive Query (Variant)",
  "句点和感嘆符": "Finality Mark",
  "句点和感嘆符（亜種）": "Finality Mark (Variant)",
  "疲感嘆符": "Weary Mark",
  "疲感嘆符（亜種）": "Weary Mark (Variant)",
  "感嘆謝符": "Gratitude Mark",
  "読点和疑問符": "Continuative Query",
  "読点和感嘆符": "Run-On Exclamation",
  "超疑問符": "Abyssal Query",
  "超疑問符（亜種）": "Abyssal Query (Variant)",
  "二重否符": "Affirmation Mark",
  "似煮符": "Simmer Mark",
  "俯瞰符": "Detached Observer",
  "不完全疑問符": "No-Reply Query",
  "ハイパーピリオド": "Terminal Mark",
  "不透明疑問符": "Hazy Query",
  "検閲符": "Redaction Seal",
  "真実 of 鍵": "Key to Truth",
  "ベタクラメーション": "Slow-Burn Exclamation",
  "PCの究極権利": "Root Access Mark",
  "デジタル バーンアウト": "Social Exhaustion",
  "ゼット サンド": "Thought Loop",
  "アット：β": "Forever Beta",
  "多層疑問符": "Recursive Query",
  "破裂感嘆符": "Outburst Mark",
  "迷宮疑問符": "Labyrinthine Query",
  "静寂感嘆符": "Silent Awe",
  "断片疑問符": "Broken Query",
  "共鳴感嘆符": "Shared Awe",
  "透過疑問符": "Piercing Query",
  "束縛感嘆符": "Frozen Exclamation",
  "浸透疑問符": "Seeping Doubt",
  "閃光感嘆符": "Flash of Insight",
  "忘却疑問符": "Fading Query",
  "反響感嘆符": "Echo Mark",
  "未完疑問符": "Unasked Query",
  "極小感嘆符": "Faint Exclamation",
  "無限疑問符": "Endless Question",
  "不完全超立方体": "Fractured Hypercube",
  "事案007-A": "Case 007-A",
  "事案012-A": "Case 012-A",
  "事案014-A": "Case 014-A",
  "事案007-014-A": "Case 007-014-A",
  "架空疑問展": "The Question Archive",
  "世界記号統一団体": "International Symbol Standards Office",
  "同一アート作家 R": "Artist R",
  "CED財団": "CED Foundation",
  "NodeLABO": "NodeLABO",
  "BIB": "BIB"
});

const EASY_ARCHIVE_NAMES = Object.freeze({
  "句点和疑問符": "にほんのはてな",
  "句点和疑問符（亜種）": "にほんのはてな（べつの形）",
  "句点和感嘆符": "にほんのびっくり",
  "句点和感嘆符（亜種）": "にほんのびっくり（べつの形）",
  "疲感嘆符": "つかれたびっくり",
  "疲感嘆符（亜種）": "つかれたびっくり（べつのかたち）",
  "感嘆謝符": "ありがとうのしるし",
  "読点和疑問符": "てんのはてな",
  "読点和感嘆符": "てんのびっくり",
  "超疑問符": "すごいはてな",
  "超疑問符（亜種）": "すごいはてな（べつの形）",
  "二重否符": "二回のちがう",
  "似煮符": "にている・にる",
  "俯瞰符": "上から見るしるし",
  "不完全疑問符": "こたえがいらないはてな",
  "ハイパーピリオド": "ぜったいに終わりのまる",
  "不透明疑問符": "ぼんやりしたはてな",
  "検閲符": "かくされたしるし",
  "真実 of 鍵": "こたえのかぎ",
  "ベタクラメーション": "あとからびっくり",
  "PCの究極権利": "パソコンのすごい権限",
  "デジタル バーンアウト": "ネットづかれ",
  "ゼット サンド": "ぐるぐる考えるしるし",
  "アット：β": "ずっと開発中",
  "多層疑問符": "かさなったはてな",
  "破裂感嘆符": "はじけるびっくり",
  "迷宮疑問符": "めいろのはてな",
  "静寂感嘆符": "しずかなびっくり",
  "断片疑問符": "かけらのはてな",
  "共鳴感嘆符": "ひびきあうびっくり",
  "透過疑問符": "すきとおるはてな",
  "束縛感嘆符": "しばるびっくり",
  "浸透疑問符": "しみこむはてな",
  "閃光感嘆符": "ひかるびっくり",
  "忘却疑問符": "わすれるはてな",
  "反響感嘆符": "はねかえるびっくり",
  "未完疑問符": "おわらないはてな",
  "極小感嘆符": "とても小さなびっくり",
  "無限疑問符": "ずっとつづくはてな",
  "不完全超立方体": "ふしぎな形のかたまり",
  "事案007-A": "できごと007-A",
  "事案012-A": "できごと012-A",
  "事案014-A": "できごと014-A",
  "事案007-014-A": "できごと007-014-A",
  "架空疑問展": "ふしぎな はてなの てんじ",
  "世界記号統一団体": "世界の記号をまとめる団体",
  "同一アート作家 R": "アートをつくる人 R",
  "CED財団": "CED財団",
  "NodeLABO": "NodeLABO",
  "BIB": "BIB"
});

const OLD_ARCHIVE_NAMES = Object.freeze({
  "句点和疑問符": "和句の疑問符",
  "句点和疑問符（亜種）": "和句の疑問符（異体）",
  "句点和感嘆符": "和句の感嘆符",
  "句点和感嘆符（亜種）": "和句の感嘆符（異体）",
  "疲感嘆符": "倦みの感嘆符",
  "疲感嘆符（亜種）": "倦みの感嘆符（異体）",
  "感嘆謝符": "感謝の感嘆符",
  "読点和疑問符": "読点の疑問符",
  "読点和感嘆符": "読点の感嘆符",
  "超疑問符": "超ゆる疑問符",
  "超疑問符（亜種）": "超ゆる疑問符（異体）",
  "二重否符": "二重の否定符",
  "似煮符": "似煮の符",
  "俯瞰符": "俯瞰の符",
  "不完全疑問符": "欠けたる疑問符",
  "ハイパーピリオド": "極終の句点",
  "不透明疑問符": "朧なる疑問符",
  "検閲符": "検閲の符",
  "真実 of 鍵": "真実の鍵",
  "ベタクラメーション": "漸増の感嘆符",
  "PCの究極権利": "電算機の至高権限",
  "デジタル バーンアウト": "電脳疲弊",
  "ゼット サンド": "循環の砂",
  "アット：β": "あっと・べえた",
  "多層疑問符": "幾重の疑問符",
  "破裂感嘆符": "破裂の感嘆符",
  "迷宮疑問符": "迷宮の疑問符",
  "静寂感嘆符": "静寂の感嘆符",
  "断片疑問符": "断片の疑問符",
  "共鳴感嘆符": "共鳴の感嘆符",
  "透過疑問符": "透かしの疑問符",
  "束縛感嘆符": "束縛の感嘆符",
  "浸透疑問符": "染み入る疑問符",
  "閃光感嘆符": "閃きの感嘆符",
  "忘却疑問符": "忘却の疑問符",
  "反響感嘆符": "反響の感嘆符",
  "未完疑問符": "未完の疑問符",
  "極小感嘆符": "極小の感嘆符",
  "無限疑問符": "無限の疑問符",
  "不完全超立方体": "不完全なる超立方体"
});

function getEntryDisplayName(item) {
  const japanese = item?.name || item?.title || `ID ${item?.id || ''}`;
  const language = document.documentElement.dataset.language || document.documentElement.lang;
  if (language === 'ja') return japanese;
  if (language === 'en' && localStorage.getItem('symbolencyclopedia-polished-names') === 'true' && POLISHED_ENGLISH_NAMES[japanese]) {
    return `${POLISHED_ENGLISH_NAMES[japanese]} (${japanese})`;
  }
  const translated = window.siteI18n?.getTranslation(japanese, language);
  if (translated) return translated;
  if (language === 'shellvail') return japanese;
  if (language === 'ja-old') return OLD_ARCHIVE_NAMES[japanese] || japanese;
  if (language === 'ja-easy') return EASY_ARCHIVE_NAMES[japanese] || japanese;
  if (language === 'zh') {
    const chinese = item?.nameZh || CHINESE_ARCHIVE_NAMES[japanese];
    return chinese ? `${chinese}（${japanese}）` : japanese;
  }
  if (language === 'eo') {
    const esperanto = item?.nameEo || ESPERANTO_ARCHIVE_NAMES[japanese];
    return esperanto ? `${esperanto} (${japanese})` : japanese;
  }
  const english = item?.nameEn || ENGLISH_ARCHIVE_NAMES[japanese];
  if (!english) return japanese;
  const polished = localStorage.getItem('symbolencyclopedia-polished-names') === 'true'
    ? POLISHED_ENGLISH_NAMES[japanese]
    : '';
  return `${polished || english} (${japanese})`;
}


// Names are translated explicitly because their containers skip tree translation.
function getEntryNameHTML(item) {
  const name = getEntryDisplayName(item);
  const original = item?.name || item?.title || `ID ${item?.id || ''}`;
  const language = document.documentElement.dataset.language || document.documentElement.lang;
  const translated = language === 'shellvail' && window.siteI18n?.getTranslation(original, language);
  const presentation = translated ? window.siteI18n.getPresentation(language) : null;
  const className = presentation ? (presentation.dir === 'rtl' ? 'shellvail-script' : 'shellvail-latin') : '';
  const lang = presentation?.lang || (language === 'shellvail' ? 'ja' : document.documentElement.lang);
  return `<span data-i18n-skip="true" class="${className}" lang="${escapeAttr(lang)}" dir="${presentation?.dir || 'ltr'}">${escapeHtml(name)}</span>`;
}


function getVisibleEntries() {
  if (state.currentArchive === 'symbolVariants') {
    return (state.db.symbols || []).filter(item => !!item.variantOf);
  }
  if (state.currentArchive === 'symbols') {
    return (state.db.symbols || []).filter(item => !item.variantOf);
  }
  return state.db[state.currentArchive] || [];
}

function getItemById(type, id) {
  return (state.db[type] || []).find(x => String(x.id) === String(id)) || null;
}

function getIncidentObjectsByIds(ids) {
  return (ids || [])
    .map(id => state.db.incidents.find(x => String(x.id) === String(id)))
    .filter(Boolean);
}

function resolveLinkedItems(type, ids) {
  return (ids || []).map(id => {
    const item = getItemById(type, id);
    return item ? `${getEntryDisplayName(item)} (${id})` : String(id);
  });
}

function openLinkedItem(type, id) {
  const item = getItemById(type, id);
  if (!item) return;
  const danger = String(item.danger || 'blue').toLowerCase();
  const warningsDisabled = localStorage.getItem('disable-warnings') === 'true';
  if (danger === 'red' && !warningsDisabled) {
    openWarningFlow(item);
    return;
  }
  openUnifiedDetail(type, id);
}

function makeLinkChip(type, id, label) {
  const item = getItemById(type, id);
  const content = item
    ? `${getEntryNameHTML(item)} <bdi dir="ltr">(${escapeHtml(id)})</bdi>`
    : escapeHtml(label);
  return `<button data-i18n-skip="true" type="button" class="tag-badge" style="cursor:pointer; border:1px solid var(--border-color); background:var(--chip-bg); color:var(--chip-text);" onclick="openLinkedItem('${type}', '${escapeAttr(id)}'); event.stopPropagation();">${content}</button>`;
}

function makeCaseLinks(ids) {
  return (ids || []).map(id => {
    const item = getItemById('cases', id);
    const label = item ? `${getEntryDisplayName(item)} (${item.id})` : String(id);
    return makeLinkChip('cases', id, label);
  }).join(' ');
}


function setTheme(theme) {
  state.settings.appTheme = theme;
  document.body.setAttribute('data-theme', theme);
  saveSettings();
  if ($('theme-select')) $('theme-select').value = theme;
}

function setFont(fontKey) {
  const fontValue = FONT_PRESETS[fontKey] || FONT_PRESETS.default;
  state.settings.fontKey = fontKey in FONT_PRESETS ? fontKey : 'default';
  document.documentElement.style.setProperty('--main-font', fontValue);
  saveSettings();
  if ($('font-select')) $('font-select').value = state.settings.fontKey;
}

function applySavedSettings() {
  setTheme(state.settings.appTheme || 'light');
  setFont(state.settings.fontKey || 'default');
  if ($('always-skip-toggle')) $('always-skip-toggle').checked = !!state.settings.alwaysSkipLoading;
  if ($('disable-warning-toggle')) $('disable-warning-toggle').checked = !!state.settings.disableWarnings;
  if ($('archive-name-input')) $('archive-name-input').value = state.settings.archiveName || '記号アーカイブ';
  if ($('bg-anim-toggle')) $('bg-anim-toggle').checked = !!state.settings.bgAnim;
  if ($('search-box-toggle')) $('search-box-toggle').checked = !!state.settings.showSearch;
  if ($('sort-menu-toggle')) $('sort-menu-toggle').checked = !!state.settings.showSort;
  if ($('author-filter-toggle')) $('author-filter-toggle').checked = !!state.settings.showAuthor;
  if ($('size-setting')) $('size-setting').value = state.settings.symbolsize || '90px';
}

function updateViewSettings() {
  state.settings.showSearch = $('search-box-toggle')?.checked ?? true;
  state.settings.showSort = $('sort-menu-toggle')?.checked ?? true;
  state.settings.showAuthor = $('author-filter-toggle')?.checked ?? true;
  state.settings.bgAnim = $('bg-anim-toggle')?.checked ?? true;
  state.settings.symbolsize = $('size-setting')?.value || '90px';
  state.settings.alwaysSkipLoading = $('always-skip-toggle')?.checked ?? false;

  localStorage.setItem('always-skip-loading', state.settings.alwaysSkipLoading ? 'true' : 'false');
  saveSettings();

  const searchBoxContainer = $('search-box-container');
  if (searchBoxContainer) {
    searchBoxContainer.style.display = (state.settings.showSearch || state.settings.showSort || state.settings.showAuthor) ? 'flex' : 'none';
  }
  if ($('archive-search')) $('archive-search').style.display = state.settings.showSearch ? 'block' : 'none';
  if ($('author-filter')) $('author-filter').style.display = state.settings.showAuthor ? 'block' : 'none';
  if ($('archive-sort')) $('archive-sort').style.display = state.settings.showSort ? 'block' : 'none';
  if ($('floating-layer')) $('floating-layer').style.display = state.settings.bgAnim ? 'block' : 'none';
  document.documentElement.style.setProperty('--symbol-size', state.settings.symbolsize);
}

function updateArchiveName() {
  const name = $('archive-name-input')?.value.trim() || '記号アーカイブ';
  state.settings.archiveName = name;
  saveSettings();
  if ($('archive-display-title')) $('archive-display-title').innerText = name;
  if ($('home-display-title')) $('home-display-title').innerText = (name === '記号アーカイブ') ? '架空疑問展' : name;
}

function saveWarningSetting() {
  state.settings.disableWarnings = $('disable-warning-toggle')?.checked ?? false;
  localStorage.setItem('disable-warnings', state.settings.disableWarnings ? 'true' : 'false');
  saveSettings();
}

function toggleSideMenu() {
  $('side-menu')?.classList.toggle('open');
}


function initFloatingsymbols() {
  const layer = $('floating-layer');
  if (!layer) return;

  const symbols = [
    '疑問図鑑_001.png',
    '疑問図鑑_002.png',
    '疑問図鑑_003.png',
    '疑問図鑑_004.png',
    '疑問図鑑_005.png',
    '疑問図鑑_006.png',
    '疑問図鑑_007.png',
    '疑問図鑑_008.png',
    '疑問図鑑_009.png',
    '疑問図鑑_010.png',
    '疑問図鑑_011.png',
    '疑問図鑑_012.png',
    '疑問図鑑_013.png',
    '疑問図鑑_014.png',
    '疑問図鑑_015.png',
    '疑問図鑑_016.png',
    '疑問図鑑_017.png',
    '疑問図鑑_018.png',
    '疑問図鑑_019.png',
    '疑問図鑑_020.png',
    '疑問図鑑_021.png',
    '疑問図鑑_022.png',
    '疑問図鑑_023.png',
    '疑問図鑑_024.png',
    '疑問図鑑_025.png',
    '疑問図鑑_026.png',
    '疑問図鑑_027.png',
    '疑問図鑑_028.png',
    '疑問図鑑_029.png',
    '疑問図鑑_030.png',
    '疑問図鑑_031.png',
    '疑問図鑑_032.png',
    '疑問図鑑_033.png',
    '疑問図鑑_034.png',
    '疑問図鑑_035.png',
    '組織番号_001.png',
    '組織番号_002.png',
    '組織番号_003.png',
    '組織番号_004.png',
    '組織番号_005.png'
  ];

  layer.innerHTML = '';
  for (let i = 0; i < 15; i++) {
    const el = document.createElement('img');
    el.src = imagebaseurl + symbols[Math.floor(Math.random() * symbols.length)];
    el.className = 'floating-symbol';
    el.style.left = `${Math.random() * 100}vw`;
    el.style.animationDuration = `${15 + Math.random() * 20}s`;
    el.style.animationDelay = `${Math.random() * -20}s`;
    el.style.width = `${30 + Math.random() * 40}px`;
    el.alt = '';
    layer.appendChild(el);
  }
}

function startLoading() {
  const alwaysSkip = state.settings.alwaysSkipLoading;
  if (alwaysSkip) {
    showArchive('symbols');
    showScreen('home-screen');
    return;
  }

  const progressBar = $('load-progress');
  const msgEl = $('loader-msg');
  let msgIndex = 0;
  state.currentProgress = 0;
  if (msgEl) msgEl.classList.add('active');

  function update() {
    state.currentProgress += 0.6;
    if (state.currentProgress > 100) state.currentProgress = 100;
    if (progressBar) progressBar.style.width = `${state.currentProgress}%`;

    const nextMsgIndex = Math.floor((state.currentProgress / 100) * loadingMessages.length);
    if (nextMsgIndex > msgIndex && nextMsgIndex < loadingMessages.length) {
      msgIndex = nextMsgIndex;
      if (msgEl) {
        msgEl.classList.remove('active');
        setTimeout(() => {
          msgEl.innerText = loadingMessages[msgIndex];
          msgEl.classList.add('active');
        }, 160);
      }
    }

    if (state.currentProgress < 100) {
      state.loadingTimer = setTimeout(update, 32);
    } else {
      setTimeout(() => showScreen('home-screen'), 650);
    }
  }

  update();
  showScreen('loading-screen');
}

function skipLoading() {
  clearTimeout(state.loadingTimer);
  showScreen('home-screen');
}


function initAuthorFilter() {
  const select = $('author-filter');
  if (!select) return;
  const current = select.value;
  while (select.options.length > 1) select.remove(1);
  getAllAuthors().forEach(a => {
    const opt = document.createElement('option');
    opt.value = a;
    opt.textContent = a;
    select.appendChild(opt);
  });
  if (current) select.value = current;
}

function initTagFilter() {
  const select = $('tag-filter');
  if (!select) return;
  const current = select.value;
  while (select.options.length > 1) select.remove(1);
  getAllTags().forEach(tag => {
    const opt = document.createElement('option');
    opt.value = tag;
    opt.textContent = tag;
    select.appendChild(opt);
  });
  if (current) select.value = current;
}

function initArchiveFilters() {
  if ($('archive-search')) $('archive-search').addEventListener('input', applyArchiveFilters);
  if ($('author-filter')) $('author-filter').addEventListener('change', applyArchiveFilters);
  if ($('danger-filter')) $('danger-filter').addEventListener('change', applyArchiveFilters);
  if ($('tag-filter')) $('tag-filter').addEventListener('change', applyArchiveFilters);
  if ($('type-filter')) $('type-filter').addEventListener('change', applyArchiveFilters);
  if ($('archive-sort')) $('archive-sort').addEventListener('change', renderCurrentArchive);
}

function clearAllFilters() {
  if ($('archive-search')) $('archive-search').value = '';
  if ($('author-filter')) $('author-filter').value = 'all';
  if ($('danger-filter')) $('danger-filter').value = 'all';
  if ($('tag-filter')) $('tag-filter').value = 'all';
  if ($('type-filter')) $('type-filter').value = 'all';
  if ($('archive-sort')) $('archive-sort').value = 'seq-asc';
  renderCurrentArchive();
}

function applyArchiveFilters() {
  renderCurrentArchive();
}

function sortData(data, mode) {
  const copy = [...data];
  copy.sort((a, b) => {
    const seqA = Number(a.seq || 0);
    const seqB = Number(b.seq || 0);
    const nameA = String(a.name || a.title || '').toLowerCase();
    const nameB = String(b.name || b.title || '').toLowerCase();
    if (mode === 'seq-asc') return seqA - seqB;
    if (mode === 'seq-desc') return seqB - seqA;
    if (mode === 'name-asc') return nameA.localeCompare(nameB, 'ja');
    return 0;
  });
  return copy;
}

function renderCurrentArchive() {
  const list = $('archive-list');
  const noResults = $('no-results');
  if (!list) return;

  const q = String($('archive-search')?.value || '').toLowerCase();
  const author = $('author-filter')?.value || 'all';
  const dangerFilter = $('danger-filter')?.value || 'all';
  const tagFilter = $('tag-filter')?.value || 'all';
  const typeFilter = $('type-filter')?.value || 'all';
  const sortMode = $('archive-sort')?.value || 'seq-asc';

  let data = getVisibleEntries();

  if (typeFilter !== 'all') data = data.filter(x => x.type === typeFilter);
  if (dangerFilter !== 'all') data = data.filter(x => String(x.danger || 'blue') === dangerFilter);
  if (author !== 'all') data = data.filter(x => String(x.author || '') === author);
  if (tagFilter !== 'all') data = data.filter(x => (x.tags || []).includes(tagFilter));

  if (q) {
    data = data.filter(item => {
      const blob = [
        item.id, item.name, item.title, item.nameEn, ENGLISH_ARCHIVE_NAMES[item.name], POLISHED_ENGLISH_NAMES[item.name], CHINESE_ARCHIVE_NAMES[item.name], ESPERANTO_ARCHIVE_NAMES[item.name], item.author, item.summary, item.detail,
        item.origin, item.usage, item.activity, item.level, item.mission, item.era, item.status, item.scope, item.date,
        (item.tags || []).join(','), item.org,
        (item.relatedsymbols || []).join(','),
        (item.relatedCases || []).join(','),
        (item.relatedOrgs || []).join(','),
        (item.incidentIds || []).join(','),
        item.variantOf
      ].join(' ').toLowerCase();
      return blob.includes(q);
    });
  }

  data = sortData(data, sortMode);
  list.innerHTML = '';

  if (!data.length) {
    if (noResults) noResults.style.display = 'block';
    return;
  }
  if (noResults) noResults.style.display = 'none';

  data.forEach(item => list.appendChild(createArchiveCard(item)));
  applySavedLikes();
}


function createArchiveCard(item) {
  const card = document.createElement('div');
  card.className = 'entry archive-card';
  card.dataset.id = item.id || '';
  card.dataset.archiveType = item.type || 'symbols';
  card.dataset.danger = String(item.danger || 'blue').toLowerCase();
  card.dataset.author = item.author || '';
  card.dataset.tags = (item.tags || []).join(',');

  const typeLabel = item.type === 'cases' ? '事案'
    : item.type === 'orgs' ? '組織'
      : item.type === 'incidents' ? '報告書'
        : item.variantOf ? '記号亜種'
          : '記号';

  const title = getEntryDisplayName(item);
  const summary = item.type === 'symbols'
    ? (item.summary || item.detail || item.origin || '')
    : item.type === 'cases'
      ? (item.summary || item.detail || '')
      : item.type === 'orgs'
        ? (item.summary || item.activity || item.detail || '')
        : (item.summary || item.detail || '');

  if (item.image) {
    const thumb = document.createElement('div');
    thumb.className = 'card-thumb';

    const img = document.createElement('img');
    img.src = String(imagebaseurl + item.image);
    img.alt = title;
    img.loading = 'lazy';
    img.decoding = 'async';
    img.addEventListener('error', () => {
      thumb.style.display = 'none';
    });

    thumb.appendChild(img);
    card.appendChild(thumb);
  }

  const body = document.createElement('div');
  body.style.width = '100%';

  const heading = document.createElement('h3');
  heading.className = 'symbol-name';
  heading.dataset.i18nSkip = 'true';
  heading.innerHTML = getEntryNameHTML(item);
  body.appendChild(heading);

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const typeSpan = document.createElement('span');
  typeSpan.textContent = typeLabel;
  meta.appendChild(typeSpan);

  const dangerSpan = document.createElement('span');
  dangerSpan.style.marginInlineStart = '10px';
  dangerSpan.textContent = dangerLabel(item.danger);
  meta.appendChild(dangerSpan);

  if (item.author) {
    const authorSpan = document.createElement('span');
    authorSpan.style.marginInlineStart = '10px';
    authorSpan.textContent = `作者：${item.author}`;
    meta.appendChild(authorSpan);
  }

  if (item.variantOf) {
    const variantSpan = document.createElement('span');
    variantSpan.style.marginInlineStart = '10px';
    variantSpan.textContent = '亜種';
    meta.appendChild(variantSpan);
  }

  body.appendChild(meta);

  const text = document.createElement('div');
  text.className = 'text';
  const p = document.createElement('p');
  p.innerHTML = escapeHtmlWithBr(summary);
  text.appendChild(p);
  body.appendChild(text);

  card.appendChild(body);

  const chips = document.createElement('div');
  chips.className = 'chips-row';
  (item.tags || []).forEach(tag => {
    const chip = document.createElement('span');
    chip.className = 'tag-badge';
    chip.textContent = tag;
    chips.appendChild(chip);
  });
  card.appendChild(chips);

  const footer = document.createElement('div');
  footer.style.display = 'flex';
  footer.style.gap = '10px';
  footer.style.alignItems = 'center';
  footer.style.justifyContent = 'space-between';
  footer.style.marginTop = 'auto';
  footer.style.width = '100%';

  const likeBtn = document.createElement('button');
  likeBtn.className = 'like-btn menu-button';
  likeBtn.style.padding = '8px 14px';
  likeBtn.style.width = 'auto';
  likeBtn.textContent = '♡ いいね';
  footer.appendChild(likeBtn);

  const note = document.createElement('span');
  note.style.fontSize = '.82rem';
  note.style.color = 'var(--memo-color)';
  note.textContent = `${typeLabel}資料`;
  footer.appendChild(note);

  card.appendChild(footer);

  const badge = document.createElement('div');
  badge.className = `danger-badge ${dangerClass(item.danger)}`;
  badge.textContent = dangerLabel(item.danger);
  card.appendChild(badge);

  return card;
}

function applySavedLikes() {
  document.querySelectorAll('.archive-card').forEach(card => {
    const btn = card.querySelector('.like-btn');
    if (!btn) return;
    const key = `like-${card.dataset.archiveType}-${card.dataset.id}`;
    if (localStorage.getItem(key)) btn.innerText = '♥ いいね済み';
  });
}

function updateTabButtons() {
  document.querySelectorAll('.archive-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.archive === state.currentArchive);
  });
}

function showArchive(name) {
  state.currentArchive = name;

  const titles = {
    symbols: ['記号アーカイブ', '提供：世界記号統一団体'],
    symbolVariants: ['記号亜種アーカイブ', '提供：世界記号統一団体・亜種管理局'],
    cases: ['事案アーカイブ', '提供：記録保全課'],
    orgs: ['組織アーカイブ', '提供：世界記号統一団体・組織監査室'],
    survey: ['アンケート', 'ご意見・感想を送る専用タブ']
  };

  if ($('archive-display-title')) $('archive-display-title').innerText = titles[name]?.[0] || 'アーカイブ';
  if ($('archive-subtitle')) $('archive-subtitle').innerText = titles[name]?.[1] || '';

  const searchBox = $('search-box-container');
  const list = $('archive-list');
  const surveyPanel = $('survey-panel');
  const noResults = $('no-results');
  const endNote = $('archive-end-note');

  const isSurvey = name === 'survey';

  if (searchBox) searchBox.style.display = isSurvey ? 'none' : 'flex';
  if (list) list.style.display = isSurvey ? 'none' : 'grid';
  if (surveyPanel) surveyPanel.style.display = isSurvey ? 'block' : 'none';
  if (noResults) noResults.style.display = 'none';
  if (endNote) endNote.style.display = isSurvey ? 'none' : 'block';

  if (!isSurvey && $('type-filter')) {
    $('type-filter').value = (name === 'symbols' || name === 'symbolVariants') ? 'all' : name;
  }

  updateTabButtons();
  if (!isSurvey) renderCurrentArchive();
  showScreen('main-contents');
}


function openStoryModal(item) {
  if (!item) return;
  openUnifiedDetail(item.type, item.id);
}

function closeStoryModal() {
  closeDetailModal();
}

function renderDangerBanner(danger) {
  const d = String(danger || 'blue').toLowerCase();
  const title = d === 'red' ? '🔴 高危険度' : d === 'yellow' ? '🟡 中危険度' : '🔵 低危険度';
  const text = d === 'red'
    ? '高リスク。閲覧・流用には注意が必要です。'
    : d === 'yellow'
      ? '中リスク。文脈依存で誤用が起こる可能性があります。'
      : '低リスク。通常の閲覧・参照用です。';
  return `<div class="detail-record danger-banner ${d}"><strong>${title}</strong><br>${escapeHtml(text)}</div>`;
}

function openUnifiedDetail(type, id) {
  const item = getItemById(type, id);
  if (!item) return;

  state.currentItem = item;

  const titleEl = $('detail-modal-title');
  const bodyEl = $('detail-modal-body');
  if (!titleEl || !bodyEl) return;

  const tags = (item.tags || []).map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join('');
  const incidents = getIncidentObjectsByIds(item.incidentIds);
  const variants = item.type === 'symbols'
    ? (state.db.symbols || []).filter(sym => String(sym.variantOf || '') === String(item.id))
    : [];
  const parentItem = item.variantOf ? getItemById('symbols', item.variantOf) : null;

  let html = renderDangerBanner(item.danger);
  html += `<div style="margin-top:14px;"><strong>名称：</strong><span data-i18n-skip="true">${getEntryNameHTML(item)}</span></div>`;
  html += `<div><strong>ID：</strong>${escapeHtml(item.id || '')}</div>`;
  html += `<div><strong>作者：</strong>${escapeHtml(item.author || '')}</div>`;
  if (item.reading) html += `<div><strong>読み：</strong>${escapeHtml(item.reading)}</div>`;
  if (item.variantOf) {
    const label = parentItem ? `${getEntryDisplayName(parentItem)} (${parentItem.id})` : item.variantOf;
    html += `<div><strong>元の記号：</strong>${makeLinkChip('symbols', item.variantOf, label)}</div>`;
    html += `<div style="margin-top:8px;"><strong>亜種メモ：</strong>仕様はほぼ同じです。見た目の差分を中心に扱います。</div>`;
  }
  if (item.org) html += `<div><strong>所属 / 組織：</strong>${escapeHtml(item.org)}</div>`;
  if (item.activity) html += `<div><strong>活動：</strong>${escapeHtml(item.activity)}</div>`;
  if (item.level) html += `<div><strong>レベル：</strong>${escapeHtml(item.level)}</div>`;
  if (item.mission) html += `<div><strong>使命：</strong>${escapeHtml(item.mission)}</div>`;
  if (item.era) html += `<div><strong>時代：</strong>${escapeHtml(item.era)}</div>`;
  if (item.status) html += `<div><strong>状態：</strong>${escapeHtml(item.status)}</div>`;
  if (item.scope) html += `<div><strong>範囲：</strong>${escapeHtml(item.scope)}</div>`;
  if (item.date) html += `<div><strong>日付：</strong>${escapeHtml(item.date)}</div>`;
  if (item.origin) html += `<div style="margin-top:8px;"><strong>由来：</strong><br>${escapeHtmlWithBr(item.origin)}</div>`;
  if (item.usage) html += `<div><strong>用途：</strong><br>${escapeHtmlWithBr(item.usage)}</div>`;
  if (item.example) html += `<div style="margin-top:8px;"><strong>使用例：</strong><br>${escapeHtmlWithBr(item.example)}</div>`;
  if (item.summary) html += `<div style="margin-top:8px;"><strong>概要：</strong><br>${escapeHtmlWithBr(item.summary)}</div>`;
  if (item.detail) html += `<div style="margin-top:8px;"><strong>詳細：</strong><br>${escapeHtmlWithBr(item.detail)}</div>`;
  if (tags) html += `<div style="margin-top:10px;"><strong>タグ：</strong>${tags}</div>`;

  if (item.relatedsymbols?.length) {
    html += `<hr><div><strong>関連記号：</strong>${item.relatedsymbols.map(id => {
      const rel = getItemById('symbols', id);
      const label = rel ? `${getEntryDisplayName(rel)} (${rel.id})` : String(id);
      return makeLinkChip('symbols', id, label);
    }).join(' ')}</div>`;
  }
  if (item.relatedCases?.length) {
    html += `<div style="margin-top:10px;"><strong>関連事案：</strong>${makeCaseLinks(item.relatedCases)}</div>`;
  }
  if (item.relatedOrgs?.length) {
    html += `<div style="margin-top:10px;"><strong>関連組織：</strong>${item.relatedOrgs.map(id => {
      const rel = getItemById('orgs', id);
      const label = rel ? `${getEntryDisplayName(rel)} (${rel.id})` : String(id);
      return makeLinkChip('orgs', id, label);
    }).join(' ')}</div>`;
  }

  if (variants.length) {
    html += `<hr><div><strong>登録済みの亜種：</strong></div>`;
    html += `<div class="chips-row">${variants.map(v => makeLinkChip('symbols', v.id, `${getEntryDisplayName(v)} (${v.id})`)).join('')}</div>`;
  }

  if (incidents.length) {
    html += '<hr><div><strong>事案記録：</strong></div>';
    incidents.forEach(inc => {
      const relatedAction = inc.relatedType && inc.relatedId
        ? `<div style="margin-top:10px;"><button class="menu-button" type="button" onclick="openLinkedItem('${escapeAttr(inc.relatedType)}','${escapeAttr(inc.relatedId)}')">関連事案を開く</button></div>`
        : '';
      html += `
          <div class="detail-record" style="margin-top:10px;">
            <strong>${escapeHtml(inc.title || inc.id)}</strong><br>
            <span>記録ID: ${escapeHtml(inc.id)}</span><br>
            <span>危険度: ${dangerLabel(inc.severity)}</span><br>
            <div style="margin-top:6px;">${escapeHtmlWithBr(inc.summary || '')}</div>
            <div style="margin-top:6px;">${escapeHtmlWithBr(inc.detail || '')}</div>
            ${relatedAction}
          </div>
        `;
    });
  }

  titleEl.dataset.i18nSkip = 'true';
  titleEl.innerHTML = getEntryNameHTML(item);
  bodyEl.innerHTML = html;
  setModal('detail-modal', true);
}

function closeDetailModal() {
  setModal('detail-modal', false);
  state.currentItem = null;
}


function openWarningFlow(item) {
  state.pendingItem = item;
  setModal('warning-modal', true);
}

function initWarningHandlers() {
  const warningNextBtn = $('warning-next-btn');
  const warningCancelBtn = $('warning-cancel-btn');
  const finalInput = $('final-confirm-input');
  const finalBtn = $('final-confirm-btn');
  const finalBackBtn = $('final-back-btn');

  if (warningCancelBtn) {
    warningCancelBtn.addEventListener('click', () => {
      setModal('warning-modal', false);
      state.pendingItem = null;
    });
  }

  if (warningNextBtn) {
    warningNextBtn.addEventListener('click', () => {
      setModal('warning-modal', false);
      if (finalInput) finalInput.value = '';
      if (finalBtn) finalBtn.disabled = true;
      setModal('final-confirm-modal', true);
    });
  }

  if (finalBackBtn) {
    finalBackBtn.addEventListener('click', () => {
      setModal('final-confirm-modal', false);
      state.pendingItem = null;
    });
  }

  if (finalInput) {
    finalInput.addEventListener('input', () => {
      if (finalBtn) finalBtn.disabled = (finalInput.value.trim() !== (document.documentElement.dataset.language === 'ja-easy' ? '見る' : ['en', 'zh', 'eo'].includes(document.documentElement.dataset.language) ? 'VIEW' : '閲覧'));
    });
  }

  if (finalBtn) {
    finalBtn.addEventListener('click', () => {
      setModal('final-confirm-modal', false);
      if (state.pendingItem) {
        openUnifiedDetail(state.pendingItem.type, state.pendingItem.id);
        state.pendingItem = null;
      }
    });
  }
}


function openAbout() {
  setModal('about-modal', true);
}

function closeAbout() {
  setModal('about-modal', false);
}


function editorField(id) {
  return $(id);
}

function setEditorValue(id, value) {
  const el = editorField(id);
  if (el) el.value = value ?? '';
}

function getEditorValue(id) {
  return String(editorField(id)?.value || '').trim();
}

function nextSeq(type) {
  const list = state.db[type] || [];
  return list.length ? Math.max(...list.map(x => Number(x.seq || 0))) + 1 : 1;
}

function collectEditorTags() {
  return splitCsv(getEditorValue('edit-tags'));
}

function fillEditorForm(item = {}, context = {}) {
  setEditorValue('edit-type', item.type || context.type || 'symbols');
  setEditorValue('edit-id', item.id || '');
  setEditorValue('edit-name', item.name || item.title || '');
  setEditorValue('edit-author', item.author || '');
  setEditorValue('edit-danger', item.danger || 'blue');
  setEditorValue('edit-image', imagebaseurl + item.image || '');
  setEditorValue('edit-tags', joinCsv(item.tags || []));
  setEditorValue('edit-summary', item.summary || '');
  setEditorValue('edit-detail', item.detail || '');
  setEditorValue('edit-reading', item.reading || '');
  setEditorValue('edit-origin', item.origin || '');
  setEditorValue('edit-usage', item.usage || '');
  setEditorValue('edit-activity', item.activity || '');
  setEditorValue('edit-date', item.date || '');
  const relatedUnion = [
    ...(item.relatedsymbols || []),
    ...(item.relatedCases || []),
    ...(item.relatedOrgs || [])
  ];
  setEditorValue('edit-related', joinCsv(relatedUnion));
  setEditorValue('edit-incident-ids', joinCsv(item.incidentIds || []));
  setEditorValue('edit-parent-id', item.variantOf || context.parentId || '');
  if (editorField('edit-related')) {
    editorField('edit-related').placeholder = 'SYM-001, CAS-001, ORG-001';
  }
}

function openEditor(item = null, context = {}) {
  state.editorContext = {
    mode: context.mode || (item?.id ? 'edit' : 'new'),
    parentId: context.parentId || '',
    sourceId: context.sourceId || ''
  };

  const type = item?.type || context.type || $('type-filter')?.value || 'symbols';
  if ($('editor-title')) {
    $('editor-title').innerText = state.editorContext.mode === 'variant'
      ? '亜種を登録'
      : state.editorContext.mode === 'edit'
        ? 'レコード編集'
        : 'レコード追加';
  }

  fillEditorForm(item || { type }, context);
  setModal('editor-modal', true);
}

// 作者が亜種を追加するとき、親記号の設定を引き継いだ下書きを開く
function openVariantEditor(parentOrId) {
  const parent = typeof parentOrId === 'string' ? getItemById('symbols', parentOrId) : parentOrId;
  if (!parent) return;

  const draft = {
    type: 'symbols',
    name: `${parent.name || parent.title || '記号'}（亜種）`,
    author: parent.author || '',
    danger: parent.danger || 'blue',
    image: imagebaseurl + parent.image || '',
    tags: parent.tags || [],
    summary: parent.summary || '',
    detail: parent.detail || '',
    reading: parent.reading || '',
    origin: parent.origin || '',
    usage: parent.usage || '',
    incidentIds: parent.incidentIds || [],
    variantOf: parent.id,
    relatedCases: parent.relatedCases || [],
    relatedOrgs: parent.relatedOrgs || [],
    relatedsymbols: parent.relatedsymbols || []
  };
  openEditor(draft, { mode: 'variant', type: 'symbols', parentId: parent.id, sourceId: parent.id });
}

function closeEditor() {
  setModal('editor-modal', false);
  state.editorContext = null;
}

function saveEditor() {
  const type = getEditorValue('edit-type') || 'symbols';
  const id = getEditorValue('edit-id');
  const name = getEditorValue('edit-name');
  const author = getEditorValue('edit-author');
  const danger = ['blue', 'yellow', 'red'].includes(getEditorValue('edit-danger')) ? getEditorValue('edit-danger') : 'blue';
  const image = getEditorValue('edit-image');
  const tags = collectEditorTags();
  const summary = getEditorValue('edit-summary');
  const detail = getEditorValue('edit-detail');
  const reading = getEditorValue('edit-reading');
  const origin = getEditorValue('edit-origin');
  const usage = getEditorValue('edit-usage');
  const activity = getEditorValue('edit-activity');
  const date = getEditorValue('edit-date');
  const relatedRaw = splitCsv(getEditorValue('edit-related'));
  const relatedsymbols = relatedRaw.filter(id => inferTypeById(id) === 'symbols');
  const relatedCases = relatedRaw.filter(id => inferTypeById(id) === 'cases');
  const relatedOrgs = relatedRaw.filter(id => inferTypeById(id) === 'orgs');
  const incidentIds = splitCsv(getEditorValue('edit-incident-ids'));
  const variantOf = getEditorValue('edit-parent-id');

  const targetList = state.db[type];
  if (!Array.isArray(targetList)) {
    alert('種類の保存先が見つかりません。');
    return;
  }

  const recordId = id || uid(type === 'cases' ? 'CAS' : type === 'orgs' ? 'ORG' : type === 'incidents' ? 'INC' : 'SYM');
  const existingIndex = targetList.findIndex(x => String(x.id) === String(recordId));

  const base = existingIndex >= 0 ? { ...targetList[existingIndex] } : { id: recordId, seq: nextSeq(type), type, createdAt: nowStamp() };

  const updated = {
    ...base,
    id: recordId,
    seq: Number(base.seq || nextSeq(type)),
    type,
    name,
    author,
    danger,
    image,
    tags,
    summary,
    detail,
    reading,
    origin,
    usage,
    activity,
    date,
    incidentIds,
    updatedAt: nowStamp()
  };

  updated.relatedsymbols = relatedsymbols;
  updated.relatedCases = relatedCases;
  updated.relatedOrgs = relatedOrgs;
  updated.variantOf = type === 'symbols' ? variantOf : '';

  if (type === 'orgs') {
    updated.activity = activity;
  }

  if (type === 'cases') {
    updated.date = date;
  }

  if (existingIndex >= 0) targetList[existingIndex] = updated;
  else targetList.push(updated);

  saveDB();
  initAuthorFilter();
  initTagFilter();
  renderCurrentArchive();
  closeEditor();

  if (type === 'symbols') {
    openUnifiedDetail('symbols', recordId);
  }
}

window.openEditor = openEditor;
window.closeEditor = closeEditor;
window.saveEditor = saveEditor;
window.openEditorFromCurrent = () => {
  const current = state.currentItem;
  if (!current) return;
  openEditor(current, { mode: 'edit', type: current.type });
};
window.openVariantEditor = openVariantEditor;



window.addEventListener('site-language-change', () => {
  if (!state?.db) return;
  renderCurrentArchive();
  if (state.currentItem) openUnifiedDetail(state.currentItem.type, state.currentItem.id);
});
