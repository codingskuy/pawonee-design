# Spesifikasi Cetak 1 Halaman Resep

Dipicu tombol "Cetak" (`window.print()`, selektor `cetak`) pada halaman publik `/resep/[id]`. Aturan hanya lewat `@media print`; tidak ada rute cetak terpisah.

## Kertas

- A4 portrait, `@page { size: A4; margin: 15mm; }`. Area isi 180 x 267 mm.
- Satu halaman: seluruh resep (12 resep inti, maks 45 menit) harus muat. Tidak boleh `page-break` di tengah daftar bahan atau langkah.

## Isi (urutan)

1. Nama resep (`h1`, 18 pt, tebal).
2. Ringkasan satu baris: "{menit} menit | untuk {n} jiwa | perkiraan Rp{min} (4 jiwa)" (11 pt).
3. Bahan terskala (`h2` 13 pt + daftar 11 pt, satuan baku).
4. Langkah berurut (11 pt).
5. Catatan: alergen dan alat wajib (10 pt).
6. Kaki halaman: "pawonee - {URL halaman ini}" (9 pt, abu).

## Disembunyikan saat cetak

Baris aksi (tombol Buka di aplikasi dan Cetak), navigasi, spanduk, latar berwarna, bayangan, gambar hidangan.

## Gaya cetak

- Hitam di atas putih: teks `#000000`/`#212529`, tanpa latar; tautan tanpa garis bawah warna, URL tidak dicetak setelah teks kecuali di kaki halaman.
- Bukan tergantung warna: lencana dan penanda hanya berupa teks.
- Font sistem, tinggi baris 1,35; `li { break-inside: avoid; }`.
- Lebar penuh (`max-width: none; padding: 0`).

## Aturan muat satu halaman

Bila isi lebih dari 267 mm pada 11 pt: (1) kecilkan isi ke minimum 10 pt; (2) bahan dua kolom (`column-count: 2`); (3) bila tetap tak muat, itu cacat data resep (batas 45 menit/langkah ringkas) dan dilaporkan, bukan dipotong diam-diam.

## Pengujian

Manual: cetak ke PDF untuk `R-01`..`R-12` pada jiwa 1 dan 8; jumlah halaman harus 1. Otomatis (disarankan di pawonee-web): Playwright `page.pdf({ format: 'A4' })` dan hitung halaman.
