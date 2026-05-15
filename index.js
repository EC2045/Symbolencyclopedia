(() => {
      'use strict';
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

      /* =========================
         共通ユーティリティ
      ========================= */
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

      /* =========================
         DB
      ========================= */
      function createDefaultDB() {
        return {
          symbols: [
            {
              id: 'SYM-001', seq: 1, type: 'symbols', name: '句点和疑問符', reading: 'くてんわぎもんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_001.png', summary: '？のピリオド部分が句点（。）になったもの',
              detail: '最古の記録は19世紀末。外国語の疑問符が導入される際、ピリオドが日本の句点として誤認された結果生まれた。「疑問だが断定を含む」という特殊な文体を示す。',
              origin: '西洋の疑問符と和文の句点文化が交差して生まれたとされる。',
              usage: '短い詰問の末尾、余韻を残したい文末。', tags: ['疑問符', '句点融合', '文体'],
              relatedCases: ['CAS-001'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-001-2', seq: 1.1, type: 'symbols', name: '句点和疑問符（亜種）', reading: 'くてんわぎもんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_001_2.png', summary: '句点和疑問符の派生亜種。仕様はほぼ同一。',
              detail: '句点和疑問符から派生した亜種。外見上の差異は小さく、運用や解釈はほぼ同じとされる。',
              origin: '作者による派生再設計。',
              usage: '原種と同様。', tags: ['疑問符', '句点融合', '文体', '亜種'],
              relatedCases: ['CAS-001'],
              variantOf: 'SYM-001',
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-002', seq: 2, type: 'symbols', name: '句点和感嘆符', reading: 'くてんかんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_002.png', summary: '！のピリオド部分が句点（。）になったもの',
              detail: '驚きと同時に文章の終止を強調する。印刷文化の中で、海外の感嘆符が日本語に適応される過程で職人の判断によって変形された記録が残っている。',
              origin: '外国から感嘆符が伝わるときにピリオドが句点として伝わった。',
              usage: '強い納得を伴う感嘆、公的な驚き。', tags: ['感嘆符', '句点融合', 'レトロ'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-002-2', seq: 2.1, type: 'symbols', name: '句点和感嘆符（亜種）', reading: 'くてんかんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_002_2.png', summary: '句点和感嘆符の派生亜種。仕様はほぼ同一。',
              detail: '句点和感嘆符から派生した亜種。外見上の差異は小さく、運用や解釈はほぼ同じとされる。',
              origin: '作者による派生再設計。',
              usage: '原種と同様。', tags: ['疑問符', '句点融合', '文体', '亜種'],
              relatedCases: ['CAS-002'],
              variantOf: 'SYM-002',
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-003', seq: 3, type: 'symbols', name: '疲感嘆符', reading: 'らんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_003.png', summary: 'とても疲れたことを表す記号',
              detail: '線がわずかに曲がった形状。ネット掲示板で「強調したいが、元気すぎる表現は避けたい」という心理から生まれた。感情強度を調整するための句読点。',
              origin: '！の形が歪んだものにあとから意味が付けられた。',
              usage: '深夜の投稿、諦め混じりの強調。', tags: ['ネットスラング', '感情表現', '疲労'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-004', seq: 4, type: 'symbols', name: '感嘆謝符', reading: 'かんたんしゃふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_004.png', summary: '感謝を表す記号',
              detail: '通常の感嘆符がわずかにお辞儀をしているような曲線を持つ。驚きよりも「ありがたさ」が上回った際に、言葉にできない謝意を視覚化するために用いられる。',
              origin: '感謝の際のお辞儀の角度を記号に反映。',
              usage: '深い感謝、畏まった挨拶。', tags: ['ポジティブ', '感情表現'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-005', seq: 5, type: 'symbols', name: '読点和疑問符', reading: 'とうてんわぎもんふ', author: '世界記号統一団体', danger: 'blue',
              image: 'symbols/疑問図鑑_005.png', summary: '読点（、）と「？」が合体したもの',
              detail: '文章の途中で疑問を投げかけつつ、会話を中断させないために考案された人工記号。論理的な議論を行う際に、前提を問い直す目的で文中に挿入される。',
              origin: '疑問番号 001, 002の規格化。',
              usage: '議論中の確認、思考の継承。', tags: ['団体規格', '人工記号', '論理'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-006', seq: 6, type: 'symbols', name: '読点和感嘆符', reading: 'とうてんわかんたんふ', author: '世界記号統一団体', danger: 'blue',
              image: 'symbols/疑問図鑑_006.png', summary: '読点（、）と「！」が合体したもの',
              detail: '感嘆しつつも次の一文へ繋げたい時に使用。熱弁を振るう際の「、」に力強さを与えるために規格化された。',
              origin: '感情を殺さない句読点の必要性から。',
              usage: '演説の原稿、勢いのある文章。', tags: ['団体規格', '人工記号'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-007', seq: 7, type: 'symbols', name: '超疑問符', reading: 'ちょうぎもんふ', author: '不明（宗教団体説)', danger: 'red',
              image: 'symbols/疑問図鑑_007.png', summary: 'そこにあったかもしれないものを表す記号',
              detail: '複数の疑問符が重なった異様な形状。ある宗教団体が「人間が理解できない問い」を象徴するために制作した説がある。',
              origin: 'クエスチョンマークを4つ合体させた形。',
              usage: '形而上学的な問い、根源的な恐怖。', tags: ['神秘的', '哲学的', '多層'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-007-2', seq: 7.1, type: 'symbols', name: '超疑問符（亜種）', reading: 'ちょうぎもんふ', author: '不明（宗教団体説)', danger: 'red',
              image: 'symbols/疑問図鑑_007_2.png', summary: '超疑問符の派生亜種。一部書籍では、「世界の移動のエネルギー現に使われた。」との記載もあるが詳細は不明。',
              detail: '超疑問符から派生した亜種。外見上の差異は大きく、運用や解釈も原種とは異なる可能性が多くの書籍、論文で示唆されている',
              origin: '作者による派生再設計。',
              usage: '原種とは一部異なる。', tags: ['疑問符', '超疑問符', '文体', '亜種'],
              relatedCases: ['CAS-007'],
              variantOf: 'SYM-007',
              createdAt: nowStamp(), updatedAt: nowStamp()
            },

            {
              id: 'SYM-008', seq: 8, type: 'symbols', name: '二重否符', reading: 'にじゅうひふ', author: '世界記号統一団体', danger: 'yblue',
              image: 'symbols/疑問図鑑_008.png', summary: '二重否定を表す記号',
              detail: '「〜でないわけではない」という複雑なニュアンスを、一目で伝えるために開発された数学的アプローチを持つ記号。',
              origin: 'ノットイコール（≠）とチルダ（~）の合成。',
              usage: '遠回しな肯定、法的な条件文。', tags: ['論理', '数学的', '人工記号'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-009', seq: 9, type: 'symbols', name: '似煮符', reading: 'じにふ', author: '不明', danger: 'yblue',
              image: 'symbols/疑問図鑑_009.png', summary: 'πの誤表記から生まれた記号。',
              detail: '数学記号πの読み間違いから転じ、日本では「煮る」や「似ている」を指す隠語として定着した。料理本などで冗談混じりに使われることがある。',
              origin: '数学記号「π」の視覚的な誤認。',
              usage: '類似性の指摘、調理指示の強調。', tags: ['誤字', '文化転用', '数学系'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-010', seq: 10, type: 'symbols', name: '俯瞰符', reading: 'ふかんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_010.png', summary: '物事を上から見下ろす視点を表す',
              detail: '客観的な観察を装いながら、強い皮肉や冷笑を込める際に好んで使われる。SNS上での対立構造においてよく見られる視点の記号。',
              origin: '鳥の目と感嘆符の図式化。',
              usage: '皮肉、客観を装った冷笑。', tags: ['ネットスラング', '視点', '皮肉'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-011', seq: 11, type: 'symbols', name: '不完全疑問符', reading: 'ふかんぜんぎもんふ', author: '世界記号統一団体', danger: 'blue',
              image: 'symbols/疑問図鑑_011.png', summary: 'どうでもいいことを聞く際に使う記号',
              detail: '「？」の一部が欠けた形状。答えを期待していない、あるいは問い自体に価値がないことを示すために、あえて「不完全」として設計された。',
              origin: '形骸化した問いの視覚化。',
              usage: '返信不要の問いかけ、独り言。', tags: ['人工記号', '無関心'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-012', seq: 12, type: 'symbols', name: 'ハイパーピリオド', reading: 'はいぱーぴりおど', author: '世界記号統一団体', danger: 'red',
              image: 'symbols/疑問図鑑_012.png', summary: '文を完全に終わらせる記号',
              detail: '通常の「。」よりも強い終止力を持つ。これ以降、反論も続きも許さないという強い意志を示す公的な文書で使用される。',
              origin: '句点を二重円にしたデザイン。',
              usage: '最終通告、決定事項の末尾。', tags: ['強調', '終端', '団体規格'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-013', seq: 13, type: 'symbols', name: '不透明疑問符', reading: 'ふとうめいぎもんふ', author: '世界記号統一団体', danger: 'yellow',
              image: 'symbols/疑問図鑑_013.png', summary: '「何かが見える」ことを表す記号',
              detail: '靄の中に浮かび上がる問いを象徴する。輪郭がぼやけたデザイン。確証はないが、そこにあるはずだという直感的な疑念を表す。',
              origin: '霧と「？」の融合。',
              usage: '未確実な情報の提示、直感。', tags: ['不透明', '直感'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-014', seq: 14, type: 'symbols', name: '検閲符', reading: 'けんえつふ', author: '世界記号統一団体', danger: 'red',
              image: 'symbols/疑問図鑑_014.png', summary: '修正済みもしくは検閲済みを表す',
              detail: '本来あった文字を塗りつぶし、その上に公的に処理されたことを示す印。歴史の書き換えが行われた痕跡として残される。',
              origin: '機密保持印の簡略化。',
              usage: '機密情報の伏せ字、修正痕跡。', tags: ['公的', '機密'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-015', seq: 15, type: 'symbols', name: '真実 of 鍵', reading: 'しんじつおぶかぎ', author: '同一アート作家 R', danger: 'red',
              image: 'symbols/疑問図鑑_015.png', summary: '問いが直接答えにつながることを表す',
              detail: '「すべての問いには答えが存在するが、その答えに辿り着く鍵は人によって異なる」という作者Rの思想を体現した。',
              origin: '芸術作品としての記号制作。',
              usage: '真理の探究、解決の象徴。', tags: ['アート系', '概念記号', '真実'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-016', seq: 16, type: 'symbols', name: 'ベタクラメーション', reading: 'べたくらめーしょん', author: '同一アート作家 R', danger: 'blue',
              image: 'symbols/疑問図鑑_016.png', summary: '「じわじわと来る驚き」を表す',
              detail: '一瞬の衝撃ではなく、理解が進むにつれて深まる驚きを示す。感嘆符の線がグラデーションのように太くなっていく形状。',
              origin: '時間の経過と納得の同時進行。',
              usage: '深い感銘、後から来る衝撃。', tags: ['アート系', '時間軸'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-017', seq: 17, type: 'symbols', name: 'PCの究極権利', reading: 'ぴーしーのきゅうきょくけんり', author: '同一アート作家 R', danger: 'yellow',
              image: 'symbols/疑問図鑑_017.png', summary: 'PCでのシステム権限を表す記号',
              detail: '「完全なアクセス権限」の象徴。管理者権限を超え、システムの根源的な領域へ干渉できることを示す。',
              origin: 'コマンドラインと盾の象徴。',
              usage: 'システム管理、ハッキングの象徴。', tags: ['デジタル', '権限', 'アート系'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-018', seq: 18, type: 'symbols', name: 'デジタル バーンアウト', reading: 'でじたるばーんあうと', author: '同一アート作家 R', danger: 'yellow',
              image: 'symbols/疑問図鑑_018.png', summary: 'SNSのやり過ぎで疲れた状態',
              detail: 'オンライン活動による精神的疲労を象徴。SNSの通知アイコンと枯れた花を組み合わせた、現代病理を映し出す記号。',
              origin: '過剰な接続への警鐘。',
              usage: 'SNS疲れの告白、休息の宣言。', tags: ['現代社会', 'デジタル', '疲労'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-019', seq: 19, type: 'symbols', name: 'ゼット サンド', reading: 'ぜっとさんど', author: '同一アート作家 R', danger: 'blue',
              image: 'symbols/疑問図鑑_019.png', summary: '「思考の堂々巡り」を表す',
              detail: '結論が出ずに最初に戻る、Z字型のループを描く記号。どれだけ考えても同じ場所に着地する徒労感を表現している。',
              origin: '迷路と循環の視覚化。',
              usage: '思考停止、エンドレスな会議。', tags: ['アート系', '心理'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-020', seq: 20, type: 'symbols', name: 'アット：β', reading: 'あっとべーた', author: '世界記号統一団体', danger: 'blue',
              image: 'symbols/疑問図鑑_020.png', summary: '永遠に開発中のアプリを表す',
              detail: '「理想的なソフトウェアは完成しない」という思想。常にベータ版であり続け、進化を止めないプロジェクトへの烙印。',
              origin: '「＠」と「β」のタイポグラフィ。',
              usage: '未完成品の提示、長期プロジェクト。', tags: ['デジタル', '開発者', '不完全'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-021', seq: 21, type: 'symbols', name: '多層疑問符', reading: 'たそうぎもんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_021.png', summary: '幾重にも重なった複雑な問い。',
              detail: '一つの疑問の中にさらなる疑問が内包されている状態。解けば解くほど謎が深まるマトリョーシカのような問いを指す。',
              origin: 'フラクタル構造の疑問符。',
              usage: '学術的な難問、難解な状況。', tags: ['複雑', '無限'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-022', seq: 22, type: 'symbols', name: '破裂感嘆符', reading: 'はれつかんたんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_022.png', summary: '抑えきれずに溢れ出した感情。',
              detail: '内側からの衝撃が突き抜けた形状。爆発的な喜びや怒りを文字に封じ込める際に使われる。',
              origin: '爆発の火花と感嘆符。',
              usage: '絶叫、衝撃的な発表。', tags: ['衝撃', '感情爆発'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-023', seq: 23, type: 'symbols', name: '迷宮疑問符', reading: 'めいきゅうぎもんふ', author: '不明', danger: 'red',
              image: 'symbols/疑問図鑑_023.png', summary: '出口の見えない、迷いの中の問い。',
              detail: '線が複雑に絡み合い、どこが終端かわからない。答えを探すほど深い迷宮へと誘われる呪術的な背景を持つ。',
              origin: '古代の迷路図と疑問符の融合。',
              usage: '哲学的な迷い、深刻な悩み。', tags: ['神秘', '迷い'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-024', seq: 24, type: 'symbols', name: '静寂感嘆符', reading: 'せいじゃくかんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_024.png', summary: '言葉を失うほどの、静かな驚き。',
              detail: '驚きのあまり声も出ない状態。極細の線で描かれた感嘆符で、周囲に漂う静寂そのものをデザインに組み込んでいる。',
              origin: '消音記号の意匠を感嘆符に流用。',
              usage: '絶句した瞬間、深い感銘。', tags: ['静寂', '感情'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-025', seq: 25, type: 'symbols', name: '断片疑問符', reading: 'だんぺんぎもんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_025.png', summary: 'バラバラに壊れた、不完全な問い。',
              detail: '砕け散った「？」の破片が集まった形状。記憶障害や通信エラーなど、情報の欠損により全体像が見えない問い。',
              origin: '割れたガラスの破片配置。',
              usage: '断片的な記憶、ノイズの多い情報。', tags: ['不完全', 'デジタル'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-026', seq: 26, type: 'symbols', name: '共鳴感嘆符', reading: 'きょうめいかんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_026.png', summary: '他者の驚きと響き合う感情。',
              detail: '二つの「！」が波紋で繋がった形状。自分一人の驚きではなく、周囲の人々と感情を共有した際に現れる。',
              origin: '音叉と波紋の視覚化。',
              usage: '一体感のある驚き、ライブ感。', tags: ['共有', '波紋'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-027', seq: 27, type: 'symbols', name: '透過疑問符', reading: 'とうかぎもんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_027.png', summary: '本質を見透かそうとする問い。',
              detail: '背景が透けて見えるほど細い。表面的な答えに満足せず、裏にある真実を射抜くような鋭い質問に使用される。',
              origin: 'レンズと疑問符の重なり。',
              usage: '本質的な問い、鋭い指摘。', tags: ['鋭利', '真実'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-028', seq: 28, type: 'symbols', name: '束縛感嘆符', reading: 'そくばくかんたんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_028.png', summary: '驚きによって身動きが取れなくなる状態。',
              detail: '「！」が鎖や蔓で縛られた形状。あまりの衝撃に足がすくみ、思考がロックされてしまった状態を物理的に表現している。',
              origin: '鎖と感嘆符のタイポグラフィ。',
              usage: '恐怖、金縛り状態の告白。', tags: ['束縛', 'ネガティブ'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-029', seq: 29, type: 'symbols', name: '浸透疑問符', reading: 'しんとうぎもんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_029.png', summary: 'じわじわと心に染み込んでいく疑念。',
              detail: '水滴が広がるような輪郭を持つ。最初は些細な疑問だったものが、時間をかけて確信的な疑いに変わる過程を示す。',
              origin: 'インクの滲み。',
              usage: '徐々に深まる不信感、気づき。', tags: ['時間軸', '心理'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-030', seq: 30, type: 'symbols', name: '閃光感嘆符', reading: 'せんこうかんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_030.png', summary: '一瞬で目の前が明るくなる衝撃。',
              detail: 'ひらめきや覚醒。暗闇の中で真実を見つけた際の、電撃的な納得感を象徴する。',
              origin: '稲妻と感嘆符。',
              usage: '大発見、ひらめきの瞬間。', tags: ['覚醒', '光'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-031', seq: 31, type: 'symbols', name: '忘却疑問符', reading: 'ぼうきゃくぎもんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_031.png', summary: '問いかけたこと自体を忘れかけている状態。',
              detail: 'かすれて今にも消えそうな「？」。長年放置された未解決の問いや、老化によって意味を失いかけた疑問。',
              origin: '風化した墓碑銘の文字。',
              usage: '思い出せない問い、風化。', tags: ['記憶', '無常'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-032', seq: 32, type: 'symbols', name: '反響感嘆符', reading: 'はんきょうかんたんふ', author: '同一アート作家 R', danger: 'blue',
              image: 'symbols/疑問図鑑_032.png', summary: '過去の驚きが今になって響いてくる様子。',
              detail: '一つの「！」の後ろに残像が続く形状。忘れていた感動や衝撃が、ふとしたきっかけで再び蘇る現象。',
              origin: 'やまびこの視覚化。',
              usage: '時差のある納得、再発見。', tags: ['過去', '再帰'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-033', seq: 33, type: 'symbols', name: '未完疑問符', reading: 'みかんぎもんふ', author: '不明', danger: 'yellow',
              image: 'symbols/疑問図鑑_033.png', summary: '最後まで形を成さなかった不完全な問い。',
              detail: '「？」の下半分が描かれていない。問いが生まれる前に打ち消された、あるいは問うことさえ許されなかった沈黙を代弁する。',
              origin: '書きかけの文字の放置。',
              usage: '言いたいことを飲み込んだ瞬間。', tags: ['未完', '沈黙'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-034', seq: 34, type: 'symbols', name: '極小感嘆符', reading: 'きょくしょうかんたんふ', author: '不明', danger: 'blue',
              image: 'symbols/疑問図鑑_034.png', summary: '本人にしか分からないような、微かな驚き。',
              detail: '針の先ほどの大きさしかない。他人に説明するほどではないが、自分の中で確実に何かが動いた、微小な揺らぎを記録する。',
              origin: 'ミクロの視点。',
              usage: '密かな感動、些細な変化。', tags: ['繊細', '個人的'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-035', seq: 35, type: 'symbols', name: '無限疑問符', reading: 'むげんぎもんふ', author: '不明', danger: 'red',
              image: 'symbols/疑問図鑑_035.png', summary: '終わることのない、永遠の問い。',
              detail: '人間の知識には必ず限界があり、どんな答えも新しい問いを生むという思想。思考の循環を肯定するシンボル。',
              origin: 'メビウスの輪と疑問符の融合。',
              usage: '永遠の探究、究極の哲学。', tags: ['無限', '哲学的'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
            {
              id: 'SYM-036', seq: 36, type: 'symbols', name: '不完全超立方体', reading: 'ふかんぜんちょうりっぽうたい', author: '同一アート作家 R', danger: 'yellow',
              image: 'symbols/疑問図鑑_036.png', summary: '理解できず脳がパンクする状態を表す記号。',
              detail: '理解できない学問を象徴するシンボル',
              origin: '思考の限界の可視化',
              usage: '思考停止、エンドレスな会議。', tags: ['アート系', '心理'],
              createdAt: nowStamp(), updatedAt: nowStamp()
            },
          ],
          cases: [
            {
              id: 'CAS-001',
              seq: 1,
              type: 'cases',
              name: '事案007-A',
              author: '不明',
              danger: 'red',
              summary: '番号007に関する異常現象',
              detail: '番号007　超疑問符が消失した。　追記：収容場所から35km離れた場所で発見された。　原因は不明。',
              date: '不明',
              org: '架空疑問展',
              relatedsymbols: ['SYM-007'],
              relatedOrgs: ['ORG-001'],
              tags: ['事案', '記録'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'CAS-002',
              seq: 2,
              type: 'cases',
              name: '事案012-A',
              author: '架空疑問展',
              danger: 'red',
              summary: 'ハイパーピリオドに関する異常現象',
              detail: 'ハイパーピリオドによって書かれた記録、報告書が致命的な影響を受けた。　追記：ハイパーピリオドを管理していた職員は処罰を受けました',
              date: '不明',
              org: '架空疑問展',
              relatedsymbols: ['SYM-012'],
              relatedOrgs: ['ORG-001'],
              incidentIds: ['INC-002'],
              tags: ['事案', '記録', '危険'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'CAS-003',
              seq: 3,
              type: 'cases',
              name: '事案014-A',
              author: '架空疑問展',
              danger: 'red',
              summary: '修正符、検閲符に関する異常現象',
              detail: '修正符、検閲符の記録の内容が変化しました。追記：この情報は過去に2度修正を受けています。　修正前については上層部を訪ねてください。',
              date: '不明',
              org: '架空疑問展',
              relatedsymbols: ['SYM-014'],
              relatedOrgs: ['ORG-001'],
              incidentIds: ['INC-002'],
              tags: ['事案', '記録', '危険'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'CAS-004',
              seq: 4,
              type: 'cases',
              name: '事案007-014-A',
              author: '架空疑問展',
              danger: 'red',
              summary: '記号の衝突によって起きた異常現象',
              detail: '修正符によって超疑問符の記録の内容が変化しました。　しかしその後修正前の記録が出現しました。この現象は修正符によって消された元の記録が超疑問符によって復元されたものだと考えられています。',
              date: '不明',
              org: '架空疑問展',
              relatedsymbols: ['SYM-014', 'SYM-007'],
              relatedOrgs: ['ORG-001'],
              incidentIds: ['INC-002'],
              tags: ['事案', '記録', '危険'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },


          ],
          orgs: [
            {
              id: 'ORG-001',
              seq: 1,
              type: 'orgs',
              name: '架空疑問展',
              author: '編纂局',
              danger: 'blue',
              image: 'symbols/組織番号_001.png',
              summary: '記号資料を収集・展示する編纂組織。',
              detail: '図鑑の整備、閲覧導線の設計、資料の保全を担当する。',
              activity: '編纂、展示、閲覧案内。',
              level: '公開',
              era: 'CED以前',
              status: '現行',
              relatedOrgs: ['ORG-002', 'ORG-005'],
              tags: ['組織', '展示', '編纂'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'ORG-002',
              seq: 2,
              type: 'orgs',
              name: '世界記号統一団体',
              author: '総務局',
              danger: 'yellow',
              image: 'symbols/組織番号_002.png',
              summary: '記号の登録、制作、規格化を行う組織。',
              detail: '世界各地の記号を収集・再分類し、誤認識の拡散を防ぐ。CED以前から標準化の基礎を整備してきた。',
              activity: '記号調査、登録、保全、再分類。',
              level: '監査級',
              era: 'CED以前',
              status: '現行',
              relatedOrgs: ['ORG-001', 'ORG-004', 'ORG-005'],
              tags: ['組織', '監査', '記号'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'ORG-003',
              seq: 3,
              type: 'orgs',
              name: '同一アート作家 R',
              author: '総務局',
              danger: 'red',
              image: 'symbols/組織番号_003.png',
              summary: 'artと称して未知の記号を制作する個人。追跡は失敗している。',
              detail: '記号をアートとして認めてもらうために活動する。独立した創作体系として再評価が進んでいる。',
              activity: 'アート制作、記号表現、独自概念の提案。',
              level: '監査級',
              era: 'CED以前',
              status: '活動継続',
              relatedOrgs: ['ORG-001', 'ORG-002'],
              tags: ['個人', '未知', '記号制作'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'ORG-004',
              seq: 4,
              type: 'orgs',
              name: 'CED財団',
              author: 'CED理事会',
              danger: 'yellow',
              image: 'symbols/組織番号_004.png',
              summary: '危険な新概念エネルギーを安全に扱う中核組織。',
              detail: 'CED財団は、危険性の高い特別エネルギーを低コストで封じ込め、制御、供給、規格化する国際機関である。異常性を伴う資源を安全な社会基盤へ変換することを使命とする。　複数組織にエネルギーを提供、販売している',
              activity: '発見、分類、抽出、安定化、封じ込め、供給。',
              level: '中枢級',
              mission: '危険な新概念エネルギーの安全運用と社会実装。',
              era: 'CED以後',
              status: '現行',
              relatedOrgs: ['ORG-001', 'ORG-002', 'ORG-005'],
              tags: ['組織', 'CED', 'エネルギー', '封じ込め'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'ORG-005',
              seq: 5,
              type: 'orgs',
              name: 'NodeLABO',
              author: 'Node管理室',
              danger: 'yellow',
              image: 'symbols/組織番号_005.png',
              summary: 'CED財団（ORG-004）由来のエネルギーを技術へ変換する応用研究機関。',
              detail: 'NodeLABOは、CEDが供給する新概念エネルギーを基盤として、次世代デバイス、演算系、展示システムへ最適化する研究を行う。CED以前から存在したが、CED以後に実用化が加速した。',
              activity: '応用研究、最適化、デバイス実装、共同実験。',
              level: '研究中枢',
              mission: '新概念エネルギーの応用と社会展開。',
              era: 'CED以前 / CED以後',
              status: '現行',
              relatedOrgs: ['ORG-001', 'ORG-002', 'ORG-004'],
              tags: ['組織', 'NodeLABO', '応用研究', '技術'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            },
            {
              id: 'ORG-006',
              seq: 6,
              type: 'orgs',
              name: 'BIB',
              author: 'BIB管理室',
              danger: 'yellow',
              image: 'symbols/組織番号_006.png',
              summary: 'NodeLABO（ORG-005）と敵対する組織',
              detail: 'BIBはデジタルへ強い嫌悪感を持ち、 肉体と意識は紐づけられるべきだと考えている。またアート作家R（ORG-003）と深い関わりがあると予測されている。',
              activity: '応用研究、最適化、デバイス実装、共同実験。',
              level: '研究中枢',
              mission: '新概念エネルギーの応用と社会展開。',
              era: 'CED以前 / CED以後',
              status: '現行',
              relatedOrgs: ['ORG-003', 'ORG-004', 'ORG-005'],
              tags: ['組織', 'NodeLABO', '応用研究', '技術'],
              createdAt: nowStamp(),
              updatedAt: nowStamp()
            }
          ],
          incidents: [
            {
              id: 'INC-001',
              seq: 1,
              title: '事案007-A',
              severity: 'blue',
              relatedType: 'cases',
              relatedId: 'CAS-001',
              summary: '番号007に関する異常現象',
              detail: '詳しくは事案007-Aを参照',
              createdAt: nowStamp()
            },

          ]
        };
      }

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
          image: String(imagebaseurl+item.image || ''),
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

      /* =========================
         表示対象の切り替え
      ========================= */
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

      /* =========================
         設定
      ========================= */
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

      /* =========================
         ローディング / 背景
      ========================= */
      function initFloatingsymbols() {
        const layer = $('floating-layer');
        if (!layer) return;

        const symbols = [
          'symbols/疑問図鑑_001.png',
          'symbols/疑問図鑑_002.png',
          'symbols/疑問図鑑_003.png',
          'symbols/疑問図鑑_004.png',
          'symbols/疑問図鑑_005.png',
          'symbols/疑問図鑑_006.png',
          'symbols/疑問図鑑_007.png',
          'symbols/疑問図鑑_008.png',
          'symbols/疑問図鑑_009.png',
          'symbols/疑問図鑑_010.png',
          'symbols/疑問図鑑_011.png',
          'symbols/疑問図鑑_012.png',
          'symbols/疑問図鑑_013.png',
          'symbols/疑問図鑑_014.png',
          'symbols/疑問図鑑_015.png',
          'symbols/疑問図鑑_016.png',
          'symbols/疑問図鑑_017.png',
          'symbols/疑問図鑑_018.png',
          'symbols/疑問図鑑_019.png',
          'symbols/疑問図鑑_020.png',
          'symbols/疑問図鑑_021.png',
          'symbols/疑問図鑑_022.png',
          'symbols/疑問図鑑_023.png',
          'symbols/疑問図鑑_024.png',
          'symbols/疑問図鑑_025.png',
          'symbols/疑問図鑑_026.png',
          'symbols/疑問図鑑_027.png',
          'symbols/疑問図鑑_028.png',
          'symbols/疑問図鑑_029.png',
          'symbols/疑問図鑑_030.png',
          'symbols/疑問図鑑_031.png',
          'symbols/疑問図鑑_032.png',
          'symbols/疑問図鑑_033.png',
          'symbols/疑問図鑑_034.png',
          'symbols/疑問図鑑_035.png',
          'symbols/組織番号_001.png',
          'symbols/組織番号_002.png',
          'symbols/組織番号_003.png',
          'symbols/組織番号_004.png',
          'symbols/組織番号_005.png'
        ];

        layer.innerHTML = '';
        for (let i = 0; i < 15; i++) {
          const el = document.createElement('img');
          el.src = symbols[Math.floor(Math.random() * symbols.length)];
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

      /* =========================
         フィルタ / 描画
      ========================= */
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
          img.src = String(imagebaseurl+item.image);
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

      /* =========================
         ストーリー / 詳細
      ========================= */
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

      /* =========================
         警告（二段階）
      ========================= */
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

      /* =========================
         イベント委譲
      ========================= */
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

      /* =========================
         About
      ========================= */
      function openAbout() {
        setModal('about-modal', true);
      }

      function closeAbout() {
        setModal('about-modal', false);
      }

      /* =========================
         レコード編集 / 亜種登録
      ========================= */
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
        setEditorValue('edit-image', imagebaseurl+item.image || '');
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
          image: imagebaseurl+parent.image || '',
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

      /* =========================
         DB入出力
      ========================= */
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

      /* =========================
         初期化
      ========================= */
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

      /* =========================
         公開API
      ========================= */
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
          setModal('scp-warning', false);
          showScreen('home-screen');
        });
      }

    })();
