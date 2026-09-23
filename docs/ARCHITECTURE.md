# Arsitektur Dan Kontrak

## Alur Aplikasi

`public/index.html` memuat `src/app.js`. Entry point memuat lima fragmen halaman, lalu memasang navigasi dan controller fitur. Controller membaca formulir, mengambil data dari repository, memanggil validasi, lalu mengirim data valid ke template atau service. Template menghasilkan HTML tanpa akses DOM. Domain dan template dapat diuji melalui Node.js tanpa browser.

| Lapisan | Tanggung jawab | Batas |
| --- | --- | --- |
| `pages/`, `styles/` | Struktur dan tampilan | Tidak menyimpan aturan status |
| `features/` | Event, formulir, perubahan DOM | Gunakan repository, domain, dan service |
| `domain/` | Aturan dan normalisasi | Tidak mengakses DOM/network |
| `templates/` | Redaksi dan render HTML | Input data melalui parameter; escape saat render |
| `services/` | Akses data, ekspor, penyimpanan | Tempat mengganti data contoh dengan backend |
| `server/` | Server lokal dan endpoint integrasi | Bukan server produksi |

## Menghubungkan Database

Ganti `sppg-repository.js` dengan adapter API. Fungsi sekarang sinkron; saat diganti `fetch`, ubah pemanggil di dashboard/master/history/letters menjadi `async`/`await` serta tambahkan kondisi loading dan error. Gunakan ID SPPG sebagai string agar nol di depan tidak hilang. Backend harus menjadi sumber status operasional yang sah dan memvalidasi ulang status terkini sebelum melakukan mutasi.

Data contoh memuat `id`, `nama`, `yayasan`, `tgl` (teks tanggal operasional), `kab`, `prov`, `status`, `suspendNo`, `incident`, `kategori`. Tanggal riwayat masih contoh statis, bukan atribut `tgl` dan bukan bukti tanggal surat.

## Kontrak Generator Word

Endpoint default: `POST /generate`. Client mengirim JSON, misalnya:

```json
{
  "jenis": "cabut",
  "ids": ["QSZNOIZE", "DP7MZKFO"],
  "idsText": "QSZNOIZE\nDP7MZKFO",
  "tanggal": "2026-09-20",
  "nomor": "",
  "kejadian": "Kejadian Menonjol",
  "kategori": "10"
}
```

`ids` adalah pilihan yang telah dinormalisasi; `idsText` hanya salinan input formulir. Untuk pencabutan, `kejadian` dan `kategori` bukan dasar keputusan dan boleh diabaikan. `kategori` pada form lama merupakan string durasi (`10`, `20`, `30`), sedangkan data contoh memakai label Ringan/Sedang/Berat; normalkan model ini saat fitur sanksi dikembangkan.

Respons berhasil: HTTP 200, `Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document`, body byte DOCX asli. Respons gagal: HTTP 4xx/5xx, `Content-Type: application/json`, body `{"error":"Penjelasan kegagalan"}`. Frontend menangani kegagalan tanpa mengunduh HTML sebagai DOCX.

`server/routes/generate.js` saat ini sengaja merespons 501. Untuk mengaktifkannya, sediakan DOCX sumber, pemetaan placeholder, generator OOXML/template, validasi backend, dan pengujian format dokumen. Pertahankan orientasi halaman dan struktur lampiran sumber jika persisnya format diperlukan. Jangan mengganti ekstensi HTML menjadi `.docx`.

## Penyimpanan Draf

`saveDraft(payload)` mengembalikan `{persisted: false, message: ...}`. Ganti isi adapter dengan POST ke database, lalu kembalikan `persisted: true` hanya setelah tersimpan. Draf belum mengubah status SPPG. Tambahkan daftar/buka draf dan penanganan konflik bila fitur ini dikembangkan.

## Menambah Jenis Surat

1. Tambahkan pilihan jenis pada `pages/surat.html`.
2. Tambahkan validasi pada `domain/letter-validation.js`.
3. Buat renderer baru dalam `templates/`.
4. Hubungkan renderer dari `features/letters.js`.
5. Implementasikan template DOCX dan validasi backend untuk ekspor.

Redaksi disalin dari sumber pengguna, bukan hasil telaah hukum baru. Proses persetujuan dan TTE harus dirancang terpisah dari pratinjau.
