(() => {
  const STORAGE_KEY = "symbolencyclopedia-language";
  const supportedLanguages = ["ja", "ja-easy", "ja-old", "en", "zh", "eo", "shellvail"];
  const isShellvail = language => language === "shellvail";
  const WRITING_KEY = "symbolencyclopedia-shellvail-writing";
  // Migrate the old language choices without losing the selected presentation.
  const legacyShellvail = localStorage.getItem(STORAGE_KEY);
  if (legacyShellvail === "shellvail-latn" || legacyShellvail === "shellvail-rtl") {
    if (!localStorage.getItem(WRITING_KEY)) {
      localStorage.setItem(WRITING_KEY, legacyShellvail === "shellvail-rtl" ? "rtl" : "latn");
    }
    localStorage.setItem(STORAGE_KEY, "shellvail");
  }
  const currentWriting = () => localStorage.getItem(WRITING_KEY) === "rtl" ? "rtl" : "latn";
  const languagePresentation = {
    latn: { lang: "x-shellvail-latn", dir: "ltr" },
    rtl: { lang: "x-shellvail", dir: "rtl" }
  };
  const languageBaseURL = new URL("../lang/", document.currentScript.src);
  const normalize = value => value.trim().replace(/\s+/g, " ");

  // Split on the first unescaped equals sign. Escape sequences work in keys and values.
  function parseLang(source) {
    const dictionary = Object.create(null);
    const decode = value => value.replace(/\\([\\nrt=])/g, (_, c) => ({ n: "\n", r: "\r", t: "\t" }[c] ?? c));
    for (const [index, line] of source.replace(/^\uFEFF/, "").split(/\r?\n/).entries()) {
      if (!line.trim() || /^\s*[#;]/.test(line)) continue;
      let separator = -1;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === "\\") { i++; continue; }
        if (line[i] === "=") { separator = i; break; }
      }
      if (separator < 0) throw new Error("Invalid .lang entry at line " + (index + 1));
      const key = decode(line.slice(0, separator));
      if (Object.hasOwn(dictionary, key)) throw new Error("Duplicate .lang key at line " + (index + 1));
      dictionary[key] = decode(line.slice(separator + 1));
    }
    return dictionary;
  }

  async function initialize() {
    const dictionaries = Object.create(null);
    await Promise.all(supportedLanguages.map(async language => {
      try {
        const response = await fetch(new URL(language + ".lang", languageBaseURL));
        if (!response.ok) throw new Error("HTTP " + response.status);
        dictionaries[language] = parseLang(await response.text());
      } catch (error) {
        console.error("Could not load language " + language, error);
        dictionaries[language] = Object.create(null);
      }
    }));
    const translations = dictionaries.en;
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    const langSelect = document.getElementById("language-select");
  const languageDictionary = language => dictionaries[language] || dictionaries.ja;
  const writingSelect = document.getElementById("shellvail-writing-select");
  const fallbackText = (language, key) => isShellvail(language) || language === "ja-easy" || language === "ja-old" ? key : translations[key];
  const USER_SELECTED_KEY = "symbolencyclopedia-language-manual";
  const AUTO_SELECTED_KEY = "symbolencyclopedia-language-auto";
  function detectBrowserLanguage() {
    const preferences = navigator.languages?.length ? navigator.languages : [navigator.language || "ja"];
    for (const preference of preferences) {
      const base = String(preference).toLowerCase().split("-")[0];
      if (base === "ja") return "ja";
      if (base === "en") return "en";
      if (base === "zh") return "zh";
      if (base === "eo") return "eo";
    }
    return "ja";
  }
  const currentLanguage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    const manuallySelected = localStorage.getItem(USER_SELECTED_KEY) === "true";
        if (manuallySelected && supportedLanguages.includes(saved)) return saved;
    if (!localStorage.getItem(AUTO_SELECTED_KEY) && saved && saved !== "ja" && supportedLanguages.includes(saved)) return saved;
    return detectBrowserLanguage();
  };


  function updateWriting(node, language, translated) {
    const parent = node.parentElement;
    if (!parent || parent.closest("head, option, textarea")) return;
    let span = parent.matches("[data-i18n-writing]") ? parent : null;
    if (!span && !isShellvail(language)) return;
    if (!span) {
      span = document.createElement("span");
      span.dataset.i18nWriting = "";
      parent.insertBefore(span, node);
      span.appendChild(node);
    }
    const shellText = isShellvail(language) && translated;
    span.classList.toggle("shellvail-script", shellText && currentWriting() === "rtl");
    span.classList.toggle("shellvail-latin", shellText && currentWriting() === "latn");
    span.lang = shellText ? languagePresentation[currentWriting()].lang : (isShellvail(language) ? "ja" : document.documentElement.lang);
    span.dir = shellText ? languagePresentation[currentWriting()].dir : "ltr";
  }

  function translateTextNode(node, language) {
    if (node.parentElement?.closest("[data-i18n-skip], script, style")) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const original = originalText.get(node);
    if (!original.trim()) return;
    updateWriting(node, language, false);
    if (language === "ja") {
      if (node.nodeValue !== original) node.nodeValue = original;
      return;
    }
    const leading = original.match(/^\s*/)?.[0] || "";
    const trailing = original.match(/\s*$/)?.[0] || "";
    const key = normalize(original);
    const dictionary = languageDictionary(language);
    let value = dictionary[key] || fallbackText(language, key);
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
      updateWriting(node, language, Boolean(dictionary[key]));
      // Keep Arabic numerals left-to-right inside the RTL glyph run.
      const displayed = isShellvail(language) && currentWriting() === "rtl" && dictionary[key]
        ? value.normalize("NFC").replace(/[0-9]+(?:[.,:/-][0-9]+)*/g, digits => "\u2066" + digits + "\u2069")
        : value;
      const translated = leading + displayed + trailing;
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
      element.setAttribute(attr, language === "ja" ? original : (languageDictionary(language)[normalize(original)] || fallbackText(language, normalize(original)) || original));
    }
  }

  function translateTree(root = document) {
    const language = currentLanguage();
    if (root.nodeType === Node.ELEMENT_NODE) translateElement(root, language);
    const elements = root.querySelectorAll ? root.querySelectorAll("[placeholder], [title], [aria-label]") : [];
    elements.forEach(element => translateElement(element, language));
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) translateTextNode(node, language);
  }

  function setLanguage(language) {
    const chosen = supportedLanguages.includes(language) ? language : "ja";
    localStorage.setItem(STORAGE_KEY, chosen);
    const presentation = isShellvail(chosen) ? languagePresentation[currentWriting()] : null;
    const writingSetting = document.getElementById("shellvail-writing-setting");
    if (writingSetting) writingSetting.style.display = isShellvail(chosen) ? "" : "none";
    if (writingSelect) writingSelect.value = currentWriting();
    document.documentElement.lang = presentation?.lang || (chosen.startsWith("ja-") ? "ja" : chosen);
    document.documentElement.dir = presentation?.dir || "ltr";
    document.documentElement.dataset.language = chosen;
    if (langSelect) langSelect.value = chosen;
    const namingSetting = document.getElementById("polished-name-setting");
    const namingToggle = document.getElementById("polished-name-toggle");
    if (namingSetting) namingSetting.style.display = chosen === "en" ? "" : "none";
    if (namingToggle) namingToggle.checked = localStorage.getItem("symbolencyclopedia-polished-names") === "true";
    translateTree(document);
    window.dispatchEvent(new Event("site-language-change"));
    const metadata = languageDictionary(chosen);
    document.title = metadata["@title"] || dictionaries.ja["@title"];
    const locale = document.querySelector('meta[property="og:locale"]');
    if (locale) locale.content = metadata["@locale"] || "ja_JP";
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = metadata["@description"] || dictionaries.ja["@description"];
  }

  let translationFrame = 0;
  const observer = new MutationObserver(() => {
    if (currentLanguage() === "ja" || translationFrame) return;
    translationFrame = requestAnimationFrame(() => {
      translationFrame = 0;
      observer.disconnect();
      translateTree(document.body);
      observer.observe(document.body, { childList: true, subtree: true });
    });
  });
  observer.observe(document.body, { childList: true, subtree: true });

  if (langSelect) langSelect.addEventListener("change", () => {
    if (langSelect.value === "auto") {
      localStorage.removeItem(USER_SELECTED_KEY);
      localStorage.setItem(AUTO_SELECTED_KEY, "true");
      setLanguage(detectBrowserLanguage());
      langSelect.value = "auto";
      return;
    }
    localStorage.setItem(USER_SELECTED_KEY, "true");
    localStorage.removeItem(AUTO_SELECTED_KEY);
    setLanguage(langSelect.value);
  });
  if (writingSelect) writingSelect.addEventListener("change", () => {
    localStorage.setItem(WRITING_KEY, writingSelect.value === "rtl" ? "rtl" : "latn");
    setLanguage(currentLanguage());
  });
  window.addEventListener("languagechange", () => {
    if (localStorage.getItem(USER_SELECTED_KEY) === "true") return;
    const detected = detectBrowserLanguage();
    if (detected !== document.documentElement.dataset.language) setLanguage(detected);
    if (langSelect) langSelect.value = "auto";
  });
  const nativeAlert = window.alert.bind(window);
  const nativeConfirm = window.confirm.bind(window);
  window.alert = message => {
    const language = currentLanguage();
    return nativeAlert(language === "ja" ? message : (languageDictionary(language)[normalize(String(message))] || fallbackText(language, normalize(String(message))) || message));
  };
  window.confirm = message => {
    const language = currentLanguage();
    return nativeConfirm(language === "ja" ? message : (languageDictionary(language)[normalize(String(message))] || fallbackText(language, normalize(String(message))) || message));
  };
  const legacyLanguage = localStorage.getItem(STORAGE_KEY);
  if (legacyLanguage && legacyLanguage !== "ja" && !localStorage.getItem(USER_SELECTED_KEY) && !localStorage.getItem(AUTO_SELECTED_KEY)) {
    localStorage.setItem(USER_SELECTED_KEY, "true");
  }
  if (localStorage.getItem(USER_SELECTED_KEY) !== "true") localStorage.setItem(AUTO_SELECTED_KEY, "true");
  setLanguage(currentLanguage());
  if (langSelect && localStorage.getItem(USER_SELECTED_KEY) !== "true") langSelect.value = "auto";
  }
  window.i18nReady = initialize();
})();

