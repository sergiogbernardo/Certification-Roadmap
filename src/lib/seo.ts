const BASE_TITLE = 'Certification Roadmap';

/**
 * Keeps the document title in sync with the active section. Helps both users
 * (browser tab / history) and search engines understand the current view.
 */
export function setPageTitle(section?: string): void {
  document.title = section ? `${section} — ${BASE_TITLE}` : `${BASE_TITLE} — Trilhas e certificações de cibersegurança`;
}
