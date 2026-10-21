export function restorePagesPath(base, location, history, storage) {
  try {
    const saved = storage.getItem('infralab-pages-path');
    storage.removeItem('infralab-pages-path');
    // Restore same-project paths only; never navigate to another origin.
    if (saved && saved.startsWith(base) && !saved.startsWith('//')) history.replaceState(null,'',saved);
  } catch { /* Disabled session storage must not prevent the app from loading. */ }
}
