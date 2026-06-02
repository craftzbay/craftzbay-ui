// Set theme before paint to avoid flash. Honour user preference, default to light.
// Served as an external script so the page can run under a strict CSP without
// 'unsafe-inline' on script-src.
try {
  var stored = localStorage.getItem('theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var theme = stored != null ? stored : prefersDark ? 'dark' : 'light';
  if (theme === 'dark') document.documentElement.classList.add('dark');
} catch (e) {}
