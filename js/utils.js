
      function escapeHtml(s) {
        return String(s ?? '')
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
          .replaceAll('"', '&quot;')
          .replaceAll("'", '&#39;');
      }

      function escapeHtmlWithBr(s) {
        return escapeHtml(s).replace(/\n/g, '<br>');
      }

      function escapeAttr(s) {
        return escapeHtml(s).replaceAll('`', '&#96;');
      }

      function splitCsv(v) {
        return String(v ?? '')
          .split(',')
          .map(x => x.trim())
          .filter(Boolean);
      }

      function joinCsv(v) {
        return Array.isArray(v) ? v.join(', ') : splitCsv(v).join(', ');
      }

      function nowStamp() {
        return new Date().toISOString();
      }

      function uid(prefix = 'ID') {
        return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`.toUpperCase();
      }

      function setModal(id, open) {
        const el = $(id);
        if (!el) return;
        el.style.display = open ? 'flex' : 'none';
        el.setAttribute('aria-hidden', open ? 'false' : 'true');
      }

      function showScreen(id) {
        ['loading-screen', 'home-screen', 'main-contents'].forEach(screenId => {
          const el = $(screenId);
          if (!el) return;
          el.style.display = 'none';
          el.style.opacity = '0';
        });

        const target = $(id);
        if (!target) return;
        target.style.display = (id === 'main-contents') ? 'block' : 'flex';
        setTimeout(() => { target.style.opacity = '1'; }, 20);
      }

      function dangerLabel(danger) {
        const d = String(danger || 'blue').toLowerCase();
        if (d === 'red') return '🔴 高';
        if (d === 'yellow') return '🟡 中';
        return '🔵 低';
      }

      function dangerClass(danger) {
        const d = String(danger || 'blue').toLowerCase();
        if (d === 'red') return 'danger-red';
        if (d === 'yellow') return 'danger-yellow';
        return 'danger-blue';
      }

      