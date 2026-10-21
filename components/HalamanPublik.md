# Spesifikasi Halaman Publik Resep (`/resep/[id]`)

Halaman web tanpa login untuk berbagi resep. Implementasi di pawonee-web (Svelte 5); spesifikasi ini framework-agnostik. Gaya memakai token `--pwn-*`.

## URL dan data

- `GET /resep/{id}?jiwa={n}`; `id` = `R-01`..`R-12` (di luar itu atau tak ditemukan: 404 "Resep tidak ada").
- `jiwa` bulat 1..8; tak ada, bukan angka, atau di luar rentang: jatuh ke **4** (tautan lama tidak boleh gagal).
- Data dari `GET /resep/{id}` (openapi) + penskalaan bahan faktor 0,30/0,55/0,80/1,00/1,25/1,50/2,00 untuk 1/2/3/4/5/6/8 jiwa. Tanpa token, tanpa data keluarga, tanpa stok.
- Judul `{nama} untuk {n} jiwa | Pawonee`; `og:title` sama; `og:description` "{menit} menit, kompor tunggal, bahan grade-2."

## Tata letak (satu kolom, lebar maks 42 rem, di tengah)

1. `h1` nama resep.
2. Ringkasan: "{menit} menit, untuk {n} jiwa. Perkiraan biaya Rp{min} (4 jiwa)." (angka titik ribuan).
3. Baris aksi: tombol **"Buka di aplikasi"** (tautan `pawonee://resep/{id}?jiwa={n}`, selektor `buka-aplikasi`) dan tombol **"Cetak"** (`window.print()`, selektor `cetak`). Tombol gaya `primer` (label 18/700) / `kontur`.
4. `h2` Bahan: daftar "namaBahan: gram satuan" terskala.
5. `h2` Langkah: daftar berurut.
6. Catatan: "Alergen: ... Alat: ..." (`teksSekunder`, 14 px).
7. Akar `main` selektor `resep-publik`.

## "Buka di aplikasi"

- Tautan skema `pawonee://`. Bila aplikasi tidak terpasang tautan tak melakukan apa-apa: spesifikasi mewajibkan teks bantu di bawah tombol "Belum punya aplikasi? Resep tetap bisa dibaca di halaman ini." (tanpa tautan toko; belum ada URL toko di dokumen).
- Tidak ada login, cookie, atau pelacak pada halaman ini.

## Keadaan

| Keadaan | Tampilan |
|---|---|
| normal | tata letak di atas |
| 404 | judul "Resep tidak ada", tautan "Kembali ke beranda" |
| jiwa tak sah | tampil untuk 4 jiwa (tanpa pesan galat) |
| backend/data mati | halaman galat umum; tidak menampilkan data basi |

## Aksesibilitas

- Tombol >= 44x44 px; urutan fokus: Buka di aplikasi, Cetak. Kontras sesuai `tokens-pemetaan.md`.
- Satu `h1`; `h2` bertingkat; daftar semantik (`ul`/`ol`).
- Tampil baik tanpa JavaScript, kecuali tombol Cetak.

Cetak: lihat [CetakResep.md](./CetakResep.md).
