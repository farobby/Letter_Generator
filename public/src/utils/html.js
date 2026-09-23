export function escapeHtml(value = '') {
  return String(value ?? '').replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

// Escape values only at the rendering boundary; repository data stays unchanged.
export function escapeRecord(record) {
  return Object.fromEntries(Object.entries(record).map(([key, value]) =>
    [key, typeof value === 'string' ? escapeHtml(value) : value]));
}
