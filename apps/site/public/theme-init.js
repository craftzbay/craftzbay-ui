// Set theme + accent before paint to avoid a flash. Served as an external
// script so the page can run under a strict CSP without 'unsafe-inline'.
// Accent token values live in the stylesheet under [data-accent="…"]; here we
// only set the attribute, so there is nothing to keep in sync.
try {
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored != null ? stored : prefersDark ? 'dark' : 'light';
  if (theme === 'dark') document.documentElement.classList.add('dark');

  var accent = localStorage.getItem('brand');
  if (accent && accent !== 'default') {
    document.documentElement.setAttribute('data-accent', accent);
  }
} catch (e) {}
