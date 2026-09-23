import { escapeHtml } from '../utils/html.js';

const SHEET_ID = '1SfGTzY1-oVa9eTYwQc1E-HmvN_6Zv-m7UajA6STmCWs';
const WILAYAH_SHEETS = ['Wilayah 1', 'Wilayah 2', 'Wilayah 3'];

function parseCSV(text) {
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentCell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = '';
    } else if ((char === '\n' || char === '\r') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = '';
    } else {
      currentCell += char;
    }
  }
  if (currentCell !== '' || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }
  return rows;
}

let allLoadedHistory = [];

export function initHistory() {
  const btn = document.querySelector('[data-action="loadHistory"]');
  if (!btn) return;
  
  const searchInput = document.getElementById('histSearch');
  const wilayahSelect = document.getElementById('histWilayah');
  const statusSelect = document.getElementById('histStatus');
  const filtersContainer = document.getElementById('historyFilters');
  const summaryOut = document.getElementById('histSummary');
  const output = document.getElementById('histOut');

  function renderTable() {
    if (allLoadedHistory.length === 0) {
      output.innerHTML = '<div class="notice ok">Tidak ada data tindakan SPPG saat ini.</div>';
      summaryOut.innerHTML = '';
      return;
    }
    
    const query = searchInput.value.toLowerCase().trim();
    const filterWilayah = wilayahSelect.value;
    const filterStatus = statusSelect.value;
    
    const filtered = allLoadedHistory.filter(item => {
      const matchSearch = item.id.toLowerCase().includes(query) || item.nama.toLowerCase().includes(query);
      const matchWilayah = filterWilayah ? item.sheet === filterWilayah : true;
      let matchStatus = true;
      if (filterStatus === 'Masih Suspend') {
        matchStatus = item.statusText.toLowerCase().includes('berhenti') || item.statusText.toLowerCase().includes('suspend');
      } else if (filterStatus === 'Sudah Operasional') {
        matchStatus = item.statusText === 'Sudah Operasional' || item.statusText.toLowerCase().includes('dibuka');
      }
      return matchSearch && matchWilayah && matchStatus;
    });
    
    const suspendCount = filtered.filter(x => x.statusText.toLowerCase().includes('berhenti') || x.statusText.toLowerCase().includes('suspend')).length;
    summaryOut.innerHTML = `Total Data Ditampilkan: ${filtered.length} (Masih Berhenti Ops: ${suspendCount})`;
    
    if (filtered.length === 0) {
      output.innerHTML = '<div class="notice">Tidak ada data yang cocok dengan filter pencarian.</div>';
      return;
    }
    
    let html = `<table style="margin-top:12px; width: 100%;">
      <thead><tr><th>ID SPPG</th><th>Nama SPPG</th><th>Alasan Suspend</th><th>Status</th><th>Wilayah</th></tr></thead><tbody>`;
    
    for (const item of filtered) {
      const isOk = item.statusText === 'Sudah Operasional' || item.statusText.toLowerCase().includes('dibuka');
      const statusBadge = isOk ? `<span class="badge op">${escapeHtml(item.statusText)}</span>` : `<span class="badge sus">${escapeHtml(item.statusText)}</span>`;
      
      html += `<tr>
        <td>${escapeHtml(item.id)}</td>
        <td>${escapeHtml(item.nama)}</td>
        <td>${escapeHtml(item.alasan)}</td>
        <td>${statusBadge}</td>
        <td><span class="badge" style="background:#f1f3f5;color:#495057">${escapeHtml(item.sheet)}</span></td>
      </tr>`;
    }
    html += `</tbody></table>`;
    output.innerHTML = html;
  }

  [searchInput, wilayahSelect, statusSelect].forEach(el => {
    if (el) el.addEventListener('input', renderTable);
  });
  
  btn.addEventListener('click', async () => {
    output.innerHTML = '<p>Memuat data dari server (membutuhkan waktu beberapa detik)...</p>';
    summaryOut.innerHTML = '';
    filtersContainer.style.display = 'none';
    btn.disabled = true;
    
    let allSuspended = [];
    
    try {
      for (const sheet of WILAYAH_SHEETS) {
        const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheet)}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Gagal memuat ${sheet}`);
        
        const text = await response.text();
        const rows = parseCSV(text);
        
        for (const row of rows) {
          if (row.length < 16) continue;
          
          const no = parseInt(row[0]);
          if (isNaN(no)) continue;
          
          const id = row[3]?.trim();
          const nama = row[5]?.trim();
          
          let alasan = row[11]?.trim() || '-';
          if (row[12] && row[12].trim()) alasan += ` - ${row[12].trim()}`;
          
          const status1 = row[15]?.trim() || '';
          const status2 = row[16]?.trim() || '';
          
          let statusText = "Masih Suspend";
          if (status1.toLowerCase().includes('sudah dibuka') || status2.toLowerCase().includes('sudah dibuka')) {
            statusText = "Sudah Operasional";
          } else if (status1) {
            statusText = status1;
          }
          
          if (id && id !== '-' && nama) {
            allSuspended.push({ sheet, id, nama, alasan, statusText });
          }
        }
      }
      
      allLoadedHistory = allSuspended;
      btn.textContent = 'Muat Ulang Data';
      filtersContainer.style.display = 'flex';
      renderTable();
      
    } catch (error) {
      output.innerHTML = `<div class="notice err">Gagal mengambil data: ${escapeHtml(error.message)}</div>`;
    } finally {
      btn.disabled = false;
    }
  });
}
