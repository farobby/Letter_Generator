# Hasil Pemeriksaan

Tanggal pemeriksaan: 21 September 2026.

- `npm test`: 5 pengujian lulus, 0 gagal. Cakupan: normalisasi/duplikasi ID, ID tidak ditemukan, aturan status, referensi surat, jenis dan tanggal surat, pembagian lampiran, serta escaping teks.
- `node --check` terhadap seluruh file JavaScript: lulus.
- Server Node.js dinyalakan dan setiap file di `public/` diminta melalui HTTP: seluruhnya 200.
- `POST /generate`: 501 dengan pesan JSON bahwa generator Word belum terhubung, sesuai status paket.
- Pemeriksaan visual/interaksi browser otomatis belum selesai: executable browser tidak tersedia dan pengunduhan browser tidak berhasil. Tidak ada klaim kesamaan visual pixel-per-pixel atau kesamaan ekspor DOCX.

## Pemeriksaan Manual Setelah Menjalankan

1. Dashboard: cari `QSZNOIZE`; hasil SPPG Tanjong Ara tampil.
2. Master SPPG: cari `Lampung`; satu data contoh tampil.
3. Buat Surat: pilihan awal empat SPPG menghasilkan dua halaman surat dan satu lampiran.
4. Masukkan ID tidak dikenal; pratinjau harus kosong dan pesan kesalahan muncul.
5. Masukkan `FHRJNHQV` untuk pencabutan; validasi menolak karena data contoh berstatus operasional.
6. Pilih pemberhentian untuk `FHRJNHQV`; kerangka pratinjau tampil. Pilih kategori Sedang; durasi contoh menjadi 20 hari kalender.
7. Ekspor pencabutan valid menampilkan pesan generator belum terhubung, tanpa mengunduh file palsu.
8. Simpan draf menampilkan pesan simulasi dan tidak mengklaim data tersimpan.
9. Buka halaman Riwayat dan Template untuk melihat status prototipe.

Tampilan responsif mewarisi prototipe awal; pada lebar kurang dari 720px sidebar disembunyikan. Paket ini terutama untuk pengembangan melalui desktop. Navigasi mobile menjadi pekerjaan lanjutan sebelum penggunaan operasional di ponsel.
