      const imagebaseurl = "https://ec2045.github.io/symbols/"
      const $ = (id) => document.getElementById(id);

      const STORAGE_DB = 'kakumon-db-v4';
      const STORAGE_SETTINGS = 'kakumon-settings-v4';

      const state = {
        db: null,
        settings: null,
        currentArchive: 'symbols',
        currentItem: null,
        pendingItem: null,
        loadingTimer: null,
        currentProgress: 0,
        editorContext: null
      };

      const loadingMessages = [
        'システムを初期化中...',
        'データベースに接続しています...',
        '古い疑問を読み込んでいます...',
        '異世界の論理を構築中...',
        '意味のネットワークを走査中...',
        '過去の問いかけを復元しています...',
        '記号の解釈を同期中...',
        '未解決の矛盾を整理しています...',
        'アーカイブを展開しています...',
        '視覚情報をレンダリング中...',
        '準備が整いました。'
      ];

      // フォント切り替え用の定義。
      // ここに1行追加するだけで、あとからフォント候補を増やしやすくしています。
      const FONT_PRESETS = {
        default: '"2045alphabet", "Hiragino Mincho ProN", serif',
        mincho: '"Hiragino Mincho ProN", "Yu Mincho", "MS PMincho", serif',
        gothic: '"Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif',
        sans: '"Arial", "Hiragino Sans", "Yu Gothic", "Meiryo", sans-serif',
        mono:  '"Courier New", "Consolas", "Cascadia Mono", monospace',
        acs:'"ACS FONT","2045alphabet", "Hiragino Mincho ProN", serif '
      };

      