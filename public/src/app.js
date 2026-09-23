import { initNavigation } from './ui/navigation.js';
import { initDashboard } from './features/dashboard.js';
import { initMaster } from './features/master.js';
import { initLetters } from './features/letters.js';
import { initHistory } from './features/history.js';
import { initRepository } from './services/sppg-repository.js';

async function startApp() {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) loadingEl.textContent = 'Memuat data dari database (Google Apps Script). Mohon tunggu, proses ini dapat memakan waktu 1-2 menit...';
  await initRepository();
  if (loadingEl) loadingEl.textContent = 'Menyiapkan antarmuka...';
  const pages = ['dashboard', 'master', 'surat', 'riwayat', 'template'];
  const html = await Promise.all(pages.map(async name => {
    const response = await fetch(new URL(`../pages/${name}.html`, import.meta.url));
    if (!response.ok) throw new Error(`Halaman ${name} gagal dimuat.`);
    return response.text();
  }));
  document.getElementById('pages').innerHTML = html.join('\n');
  initNavigation();
  initDashboard();
  initMaster();
  initLetters();
  initHistory();
}

startApp().catch(error => {
  document.getElementById('pages').textContent = `Aplikasi gagal dimuat: ${error.message}. Jalankan melalui npm run dev.`;
  console.error(error);
});
