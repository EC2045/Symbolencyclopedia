
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
    return item ? `${item.name || item.title || id} (${id})` : String(id);
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
  return `<button type="button" class="tag-badge" style="cursor:pointer; border:1px solid var(--border-color); background:var(--chip-bg); color:var(--chip-text);" onclick="openLinkedItem('${type}', '${escapeAttr(id)}'); event.stopPropagation();">${escapeHtml(label)}</button>`;
}

function makeCaseLinks(ids) {
  return (ids || []).map(id => {
    const item = getItemById('cases', id);
    const label = item ? `${item.name || item.title || item.id} (${item.id})` : String(id);
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
        item.id, item.name, item.title, item.author, item.summary, item.detail,
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

  const title = item.name || item.title || `ID ${item.id || ''}`;
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
  heading.textContent = title;
  body.appendChild(heading);

  const meta = document.createElement('div');
  meta.className = 'card-meta';

  const typeSpan = document.createElement('span');
  typeSpan.textContent = typeLabel;
  meta.appendChild(typeSpan);

  const dangerSpan = document.createElement('span');
  dangerSpan.style.marginLeft = '10px';
  dangerSpan.textContent = dangerLabel(item.danger);
  meta.appendChild(dangerSpan);

  if (item.author) {
    const authorSpan = document.createElement('span');
    authorSpan.style.marginLeft = '10px';
    authorSpan.textContent = `作者：${item.author}`;
    meta.appendChild(authorSpan);
  }

  if (item.variantOf) {
    const variantSpan = document.createElement('span');
    variantSpan.style.marginLeft = '10px';
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
  html += `<div style="margin-top:14px;"><strong>名称：</strong>${escapeHtml(item.name || item.title || '')}</div>`;
  html += `<div><strong>ID：</strong>${escapeHtml(item.id || '')}</div>`;
  html += `<div><strong>作者：</strong>${escapeHtml(item.author || '')}</div>`;
  if (item.reading) html += `<div><strong>読み：</strong>${escapeHtml(item.reading)}</div>`;
  if (item.variantOf) {
    const label = parentItem ? `${parentItem.name || parentItem.title || parentItem.id} (${parentItem.id})` : item.variantOf;
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
  if (item.example) html += `<div style="margin-top:8px;"><strong>使用例：</strong><br>${item.example.replace(/\n/g, '<br>')}</div>`;
  if (item.summary) html += `<div style="margin-top:8px;"><strong>概要：</strong><br>${escapeHtmlWithBr(item.summary)}</div>`;
  if (item.detail) html += `<div style="margin-top:8px;"><strong>詳細：</strong><br>${escapeHtmlWithBr(item.detail)}</div>`;
  if (tags) html += `<div style="margin-top:10px;"><strong>タグ：</strong>${tags}</div>`;

  if (item.relatedsymbols?.length) {
    html += `<hr><div><strong>関連記号：</strong>${item.relatedsymbols.map(id => {
      const rel = getItemById('symbols', id);
      const label = rel ? `${rel.name || rel.title || rel.id} (${rel.id})` : String(id);
      return makeLinkChip('symbols', id, label);
    }).join(' ')}</div>`;
  }
  if (item.relatedCases?.length) {
    html += `<div style="margin-top:10px;"><strong>関連事案：</strong>${makeCaseLinks(item.relatedCases)}</div>`;
  }
  if (item.relatedOrgs?.length) {
    html += `<div style="margin-top:10px;"><strong>関連組織：</strong>${item.relatedOrgs.map(id => {
      const rel = getItemById('orgs', id);
      const label = rel ? `${rel.name || rel.title || rel.id} (${rel.id})` : String(id);
      return makeLinkChip('orgs', id, label);
    }).join(' ')}</div>`;
  }

  if (variants.length) {
    html += `<hr><div><strong>登録済みの亜種：</strong></div>`;
    html += `<div class="chips-row">${variants.map(v => makeLinkChip('symbols', v.id, `${v.name || v.title || v.id} (${v.id})`)).join('')}</div>`;
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

  titleEl.innerText = item.name || item.title || item.id || '';
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
      if (finalBtn) finalBtn.disabled = (finalInput.value.trim() !== '閲覧');
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

