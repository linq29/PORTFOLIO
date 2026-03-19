const attributeMappings = [
  ["i18nAriaLabel", "aria-label"],
  ["i18nTitle", "title"],
  ["i18nAlt", "alt"]
];

const translations = window.PORTFOLIO_TRANSLATIONS || {};
const defaultLanguage = "ja";
const yearElement = document.getElementById("year");
const toggleButton = document.getElementById("lang-toggle");
const languageOrder = Object.keys(translations);
const languageLabels = {
  ja: "JP",
  en: "EN",
  zh: "ZH"
};
const languageNames = {
  ja: "日本語",
  en: "English",
  zh: "中文"
};
const fallbackLanguage = languageOrder.includes(defaultLanguage)
  ? defaultLanguage
  : (languageOrder[0] || defaultLanguage);

if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

function getSupportedLanguage(lang) {
  if (typeof lang !== "string") {
    return fallbackLanguage;
  }

  const normalized = lang.toLowerCase();
  const baseLanguage = normalized.split("-")[0];

  if (translations[normalized]) {
    return normalized;
  }

  if (translations[baseLanguage]) {
    return baseLanguage;
  }

  return fallbackLanguage;
}

function getNextLanguage(lang) {
  if (languageOrder.length === 0) {
    return fallbackLanguage;
  }

  const currentIndex = languageOrder.indexOf(lang);

  if (currentIndex === -1) {
    return fallbackLanguage;
  }

  return languageOrder[(currentIndex + 1) % languageOrder.length];
}

function getLanguageLabel(lang) {
  return languageLabels[lang] || lang.toUpperCase();
}

function getLanguageName(lang) {
  return languageNames[lang] || lang.toUpperCase();
}

function setTranslatedContent(attributeName, apply) {
  const selector = `[data-${attributeName.replace(/[A-Z]/g, match => "-" + match.toLowerCase())}]`;

  document.querySelectorAll(selector).forEach((element) => {
    const key = element.dataset[attributeName];
    const value = translations[document.documentElement.lang]?.[key];

    if (typeof value === "string") {
      apply(element, value);
    }
  });
}

function updateToggle(lang) {
  if (!toggleButton) {
    return;
  }

  const currentLanguage = getSupportedLanguage(lang);
  const nextLanguage = getNextLanguage(currentLanguage);
  const nextLabel = getLanguageLabel(nextLanguage);
  const nextLanguageName = getLanguageName(nextLanguage);
  const nextAriaLabel = currentLanguage === "ja"
    ? `${nextLanguageName}に切り替える`
    : `Switch to ${nextLanguageName}`;

  toggleButton.textContent = nextLabel;
  toggleButton.setAttribute("aria-label", nextAriaLabel);
  toggleButton.setAttribute("title", nextAriaLabel);
}

function applyLanguage(lang) {
  const nextLanguage = getSupportedLanguage(lang);
  const dictionary = translations[nextLanguage];
  const metaDescription = document.querySelector('meta[name="description"]');

  document.documentElement.lang = nextLanguage;
  document.title = dictionary.documentTitle;

  if (metaDescription) {
    metaDescription.setAttribute("content", dictionary.metaDescription);
  }

  setTranslatedContent("i18n", (element, value) => {
    element.textContent = value;
  });

  setTranslatedContent("i18nHtml", (element, value) => {
    element.innerHTML = value;
  });

  attributeMappings.forEach(([dataKey, attribute]) => {
    setTranslatedContent(dataKey, (element, value) => {
      element.setAttribute(attribute, value);
    });
  });

  updateToggle(nextLanguage);
  localStorage.setItem("lang", nextLanguage);
}

const links = [...document.querySelectorAll(".nav-link")];
const sections = links
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActive() {
  const y = window.scrollY + 120;
  let current = sections[0]?.id || "profile";

  for (const section of sections) {
    if (section.offsetTop <= y) {
      current = section.id;
    }
  }

  links.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
}

const savedLanguage = localStorage.getItem("lang");
const browserLanguage = getSupportedLanguage(navigator.language);
applyLanguage(savedLanguage || browserLanguage);

if (toggleButton) {
  toggleButton.addEventListener("click", () => {
    const nextLanguage = getNextLanguage(document.documentElement.lang);
    applyLanguage(nextLanguage);
  });
}

window.addEventListener("scroll", setActive, { passive: true });
setActive();
