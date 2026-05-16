
function initDelegatedEvents() {
  const list = $('archive-list');
  if (!list || list.dataset.bound === '1') return;
  list.dataset.bound = '1';

  list.addEventListener('click', (ev) => {
    const card = ev.target.closest('.archive-card');
    if (!card) return;

    const likeBtn = ev.target.closest('.like-btn');
    if (likeBtn) {
      ev.stopPropagation();
      const key = `like-${card.dataset.archiveType}-${card.dataset.id}`;
      if (likeBtn.innerText.includes('いいね済み')) {
        localStorage.removeItem(key);
        likeBtn.innerText = '♡ いいね';
      } else {
        localStorage.setItem(key, '1');
        likeBtn.innerText = '♥ いいね済み';
      }
      return;
    }

    const item = getItemById(card.dataset.archiveType, card.dataset.id);
    if (!item) return;

    const danger = String(card.dataset.danger || 'blue').toLowerCase();
    const warningsDisabled = localStorage.getItem('disable-warnings') === 'true';
    const imgClicked = ev.target.closest('.symbol') || ev.target.closest('.card-thumb');

    if (imgClicked) {
      if (danger === 'red' && !warningsDisabled) {
        openWarningFlow(item);
        return;
      }
      openStoryModal(item);
      return;
    }

    if (danger === 'red' && !warningsDisabled) {
      openWarningFlow(item);
      return;
    }

    openUnifiedDetail(item.type, item.id);
  });
}

