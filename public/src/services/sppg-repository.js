import { SPPG_SEED } from '../data/sppg.js';

let sppgData = null;
const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1LfmBmSUbHahimIeaCyllvT05WeZVxQMNGo4EpthM1YE/export?format=csv';

function parseCSVRow(str) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"' && str[i+1] === '"') {
      current += '"'; i++;
    } else if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export async function initRepository() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(SHEET_URL, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    const lines = text.split('\n');
    const parsedData = [];
    
    // Baris 1: Update info, Baris 2: Header (indeks 0 dan 1)
    for (let i = 2; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const row = parseCSVRow(line);
      parsedData.push({
        id: row[1] ? row[1].trim().toUpperCase() : '-',
        prov: row[2] ? row[2].trim() : '-',
        nama: row[3] ? row[3].trim() : '-',
        kab: row[4] && row[4] !== '#N/A' ? row[4].trim() : '-',
        yayasan: row[10] ? row[10].trim() : '-',
        status: row[13] ? (String(row[13]).toLowerCase().includes('suspend') ? 'suspend' : 'operasional') : 'operasional',
        tgl: row[14] ? row[14].trim() : '-',
        suspendNo: '-',
        incident: '-',
        kategori: '-'
      });
    }
    sppgData = parsedData.length > 0 ? parsedData : SPPG_SEED;
  } catch (error) {
    console.error('Failed to load SPPG data from Google Sheets, falling back to seed data:', error);
    sppgData = SPPG_SEED;
  }
}

export function listSppg() {
  if (!sppgData) {
    console.warn('Repository not initialized, falling back to seed data');
    return SPPG_SEED.map(record => ({ ...record }));
  }
  return sppgData.map(record => ({ ...record }));
}

export function findSppg(id) {
  return listSppg().find(record => record.id === String(id).trim().toUpperCase());
}

export function searchSppg(query = '') {
  const term = query.toLowerCase().trim();
  return listSppg().filter(record =>
    [record.id, record.nama, record.kab, record.prov].some(value =>
      value && value.toLowerCase().includes(term)));
}
