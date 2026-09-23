# SPPG Modular JavaScript

Refaktor dari `Prototipe_Sistem_SPPG_v2-1.html` menjadi proyek JavaScript ES Modules, tanpa framework, build step, atau dependency npm. Tampilan, logo, sembilan data contoh, dan redaksi pratinjau pencabutan berasal dari file awal.

## Mulai

1. Ekstrak ZIP.
2. Buka folder `SPPG_Modular_JavaScript` di editor/Antigravity.
3. Pastikan Node.js 22 atau lebih baru tersedia (`node --version`).
4. Jalankan terminal dari folder yang berisi `package.json`:

```bash
npm run dev
```

5. Buka **http://localhost:3000** di browser. Hentikan server dengan Ctrl+C.

Tidak perlu `npm install` karena belum ada dependency. Jalankan melalui HTTP; klik dua kali `index.html` tidak cukup karena aplikasi menggunakan ES Modules dan memuat halaman terpisah. Jika port terpakai, pada macOS/Linux gunakan `PORT=3001 npm run dev`.

## Bagian Yang Bisa Diedit

| Kebutuhan | Lokasi |
| --- | --- |
| Kerangka aplikasi, sidebar, profil | `public/index.html` |
| Tampilan setiap halaman | `public/pages/*.html` |
| Warna, layout aplikasi | `public/styles/base.css`, `public/styles/app.css` |
| Layout pratinjau surat | `public/styles/letters.css` |
| Tampilan layar kecil | `public/styles/responsive.css` |
| Logo BGN | `public/assets/logo-bgn.png` |
| Data contoh SPPG | `public/src/data/sppg.js` |
| Pencarian/sumber data | `public/src/services/sppg-repository.js` |
| Validasi ID, status, tanggal surat | `public/src/domain/letter-validation.js` |
| Interaksi halaman | `public/src/features/*.js` |
| Redaksi surat pencabutan dan lampiran | `public/src/templates/revocation.js` |
| Kop surat | `public/src/templates/shared.js` |
| Kerangka teguran/pemberhentian | `public/src/templates/generic.js` |
| Pemanggilan API Word | `public/src/services/document-service.js` |
| Sambungan generator Word di server | `server/routes/generate.js` |
| Sambungan penyimpanan draf | `public/src/services/draft-service.js` |
| Konfigurasi endpoint, logo, baris lampiran | `public/src/config.js` |

## Status Fitur

- **Berjalan:** navigasi, pencarian ID/nama/kabupaten/provinsi, tabel master, pemilihan banyak SPPG, validasi surat, pratinjau pencabutan beserta lampiran dan logo.
- **Simulasi:** angka dashboard, data SPPG, riwayat tindakan, simpan draf. Draf belum disimpan di browser atau database. Identitas Superadmin hanya tampilan, bukan autentikasi.
- **Kerangka:** teguran dan pemberhentian belum memiliki isi/template lengkap.
- **Belum terhubung:** ekspor Word. HTML awal memanggil `/generate` pada backend `server.py`, tetapi server dan DOCX sumber tidak disertakan. Server Node.js di paket ini mengembalikan HTTP 501 dan pesan yang jelas sampai generator asli diintegrasikan. Pratinjau HTML tidak menjamin format DOCX identik.
- **Belum tersedia:** database, login, persetujuan, TTE, audit trail, perubahan status operasional resmi, deployment produksi.

Durasi kategori, dasar/redaksi surat, tanggal contoh, nama penandatangan, dan tembusan mengikuti prototipe sumber; refaktor ini tidak memverifikasi atau menetapkan kebijakan baru.

## Perubahan Saat Refaktor

- HTML, CSS, logo, data, layanan, validasi, serta template dipisah.
- Tidak memakai fungsi global atau atribut JavaScript `onclick` di HTML; event diikat dari modul fitur.
- Template menerima data melalui parameter, tanpa membaca DOM.
- Validasi yang sama digunakan sebelum preview, simpan simulasi, dan ekspor. ID duplikat dinormalisasi, tanggal diperiksa, dan pencabutan memerlukan nomor pemberhentian.
- Pratinjau lama dibersihkan saat formulir berubah/gagal validasi agar tidak menampilkan surat yang keliru.
- Teks data/form di-escape sebelum dimasukkan ke HTML.
- Klaim penyimpanan/format identik dari prototipe diganti keterangan sesuai kemampuan paket.

## Pengujian

```bash
npm test
```

Menguji normalisasi ID, data tidak ditemukan, aturan status, tanggal, referensi surat, pembagian lampiran, dan escaping teks. Lihat `docs/VERIFICATION.md` untuk hasil pemeriksaan paket.

## Lanjutan Pengembangan

Baca `docs/ARCHITECTURE.md` untuk batas modul dan kontrak backend. Pengembangan dapat dilanjutkan langsung di Antigravity dengan membaca README ini; tidak perlu migrasi React untuk memulai.
