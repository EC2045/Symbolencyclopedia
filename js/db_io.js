function exportDatabase() {
  const blob = new Blob([JSON.stringify(state.db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kakumon-db-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

async function importDatabase(ev) {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  try {
    const text = await file.text();
    state.db = normalizeDB(JSON.parse(text));
    saveDB();
    initAuthorFilter();
    initTagFilter();
    renderCurrentArchive();
    alert('DBを読み込みました。');
  } catch (_) {
    alert('JSONの読み込みに失敗しました。');
  } finally {
    ev.target.value = '';
  }
}

function resetDatabase() {
  if (!confirm('DBを初期化します。保存済みデータはすべて消えます。よろしいですか？')) return;
  state.db = createDefaultDB();
  saveDB();
  initAuthorFilter();
  initTagFilter();
  renderCurrentArchive();
  alert('DBを初期化しました。');
}

