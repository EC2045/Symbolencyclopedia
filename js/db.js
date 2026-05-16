function inferTypeById(id) {
  const x = String(id || '').toUpperCase();
  if (x.startsWith('CAS-')) return 'cases';
  if (x.startsWith('ORG-')) return 'orgs';
  if (x.startsWith('INC-')) return 'incidents';
  return 'symbols';
}

function normalizeItem(item) {
  const type = item.type || inferTypeById(item.id);
  return {
    id: String(item.id || uid(type === 'cases' ? 'CAS' : type === 'orgs' ? 'ORG' : type === 'incidents' ? 'INC' : 'SYM')),
    seq: Number(item.seq || 0),
    type,
    name: String(item.name || item.title || ''),
    author: String(item.author || ''),
    danger: ['blue', 'yellow', 'red'].includes(String(item.danger || 'blue').toLowerCase())
      ? String(item.danger).toLowerCase()
      : 'blue',
    image: String(imagebaseurl + item.image || ''),
    reading: String(item.reading || ''),
    summary: String(item.summary || ''),
    detail: String(item.detail || ''),
    origin: String(item.origin || ''),
    usage: String(item.usage || ''),
    org: String(item.org || ''),
    activity: String(item.activity || ''),
    level: String(item.level || ''),
    mission: String(item.mission || ''),
    era: String(item.era || ''),
    status: String(item.status || ''),
    scope: String(item.scope || ''),
    date: String(item.date || ''),
    tags: Array.isArray(item.tags) ? item.tags.map(String) : splitCsv(item.tags),
    incidentIds: Array.isArray(item.incidentIds) ? item.incidentIds.map(String) : splitCsv(item.incidentIds),
    relatedsymbols: Array.isArray(item.relatedsymbols) ? item.relatedsymbols.map(String) : splitCsv(item.relatedsymbols),
    relatedCases: Array.isArray(item.relatedCases) ? item.relatedCases.map(String) : splitCsv(item.relatedCases),
    relatedOrgs: Array.isArray(item.relatedOrgs) ? item.relatedOrgs.map(String) : splitCsv(item.relatedOrgs),
    variantOf: String(item.variantOf || ''),
    createdAt: item.createdAt || nowStamp(),
    updatedAt: nowStamp()
  };
}

function normalizeIncident(item) {
  return {
    id: String(item.id || uid('INC')),
    seq: Number(item.seq || 0),
    title: String(item.title || ''),
    severity: ['blue', 'yellow', 'red'].includes(String(item.severity || 'blue').toLowerCase())
      ? String(item.severity).toLowerCase()
      : 'blue',
    relatedType: String(item.relatedType || ''),
    relatedId: String(item.relatedId || ''),
    summary: String(item.summary || ''),
    detail: String(item.detail || ''),
    createdAt: item.createdAt || nowStamp()
  };
}

function normalizeDB(db) {
  const seed = createDefaultDB();
  return {
    symbols: Array.isArray(db?.symbols) ? db.symbols.map(normalizeItem) : seed.symbols,
    cases: Array.isArray(db?.cases) ? db.cases.map(normalizeItem) : seed.cases,
    orgs: Array.isArray(db?.orgs) ? db.orgs.map(normalizeItem) : seed.orgs,
    incidents: Array.isArray(db?.incidents) ? db.incidents.map(normalizeIncident) : seed.incidents
  };
}

function loadDB() {
  try {
    const raw = localStorage.getItem(STORAGE_DB);
    if (raw) return normalizeDB(JSON.parse(raw));
  } catch (_) { }
  return createDefaultDB();
}

function saveDB() {
  localStorage.setItem(STORAGE_DB, JSON.stringify(state.db));
}

function loadSettings() {
  const defaults = {
    appTheme: 'light',
    fontKey: 'default',
    alwaysSkipLoading: false,
    disableWarnings: false,
    archiveName: '記号アーカイブ',
    bgAnim: true,
    showSearch: true,
    showSort: true,
    showAuthor: true,
    symbolsize: '90px'
  };
  try {
    const raw = localStorage.getItem(STORAGE_SETTINGS);
    if (raw) return Object.assign({}, defaults, JSON.parse(raw));
  } catch (_) { }
  return { ...defaults };
}

function saveSettings() {
  localStorage.setItem(STORAGE_SETTINGS, JSON.stringify(state.settings));
}

function getAllData() {
  return [...state.db.symbols, ...state.db.cases, ...state.db.orgs, ...state.db.incidents];
}

function getAllTags() {
  const tags = new Set();
  getAllData().forEach(item => (item.tags || []).forEach(t => tags.add(t)));
  return [...tags].sort((a, b) => a.localeCompare(b, 'ja'));
}

function getAllAuthors() {
  const authors = new Set();
  getAllData().forEach(item => {
    if (item.author) authors.add(item.author);
  });
  return [...authors].sort((a, b) => a.localeCompare(b, 'ja'));
}

