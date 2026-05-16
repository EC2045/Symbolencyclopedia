
function appInit() {
  state.db = loadDB();
  state.settings = loadSettings();

  applySavedSettings();
  initFloatingsymbols();
  updateViewSettings();
  initArchiveFilters();
  initWarningHandlers();
  initDelegatedEvents();
  initAuthorFilter();
  initTagFilter();
  if ($('edit-parent-id')) $('edit-parent-id').value = '';
  renderCurrentArchive();
  updateTabButtons();
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeStoryModal();
    closeDetailModal();
    closeAbout();
    setModal('warning-modal', false);
    setModal('final-confirm-modal', false);
    state.pendingItem = null;
  }
});


window.toggleSideMenu = toggleSideMenu;
window.setTheme = setTheme;
window.setFont = setFont;
window.updateViewSettings = updateViewSettings;
window.updateArchiveName = updateArchiveName;
window.saveWarningSetting = saveWarningSetting;
window.showScreen = showScreen;
window.skipLoading = skipLoading;
window.startLoading = startLoading;
window.showArchive = showArchive;
window.applyArchiveFilters = applyArchiveFilters;
window.clearAllFilters = clearAllFilters;
window.openAbout = openAbout;
window.closeAbout = closeAbout;
window.closeDetailModal = closeDetailModal;
window.openLinkedItem = openLinkedItem;
window.closeStoryModal = closeStoryModal;
window.exportDatabase = exportDatabase;
window.importDatabase = importDatabase;
window.resetDatabase = resetDatabase;
window.renderCurrentArchive = renderCurrentArchive;
window.appInit = appInit;

window.addEventListener('load', () => {
  appInit();

  const scp = $('scp-warning');
  if (scp) setModal('scp-warning', true);
  else showScreen('home-screen');
});

const ackCheck = $('ack-check');
const scpAcceptBtn = $('scp-accept-btn');
const scpCancelBtn = $('scp-cancel-btn');

if (ackCheck && scpAcceptBtn) {
  ackCheck.addEventListener('change', () => {
    scpAcceptBtn.disabled = !ackCheck.checked;
  });
}

if (scpAcceptBtn) {
  scpAcceptBtn.addEventListener('click', () => {
    setModal('scp-warning', false);
    startLoading();
  });
}

if (scpCancelBtn) {
  scpCancelBtn.addEventListener('click', () => {
    // ホラー演出
    document.body.classList.add('crash-mode');
    scpCancelBtn.textContent = '逃 ガ サ ナ イ';
    
    const glitchText = document.createElement('div');
    glitchText.className = 'crash-text';
    glitchText.innerHTML = 'アクセス拒否<br>キャンセルは無効化されました';
    document.body.appendChild(glitchText);

    setTimeout(() => {
      document.body.classList.remove('crash-mode');
      glitchText.remove();
      scpCancelBtn.textContent = 'キャンセル（トップ）';
      setModal('scp-warning', false);
      showScreen('home-screen');
    }, 2500);
  });
}

