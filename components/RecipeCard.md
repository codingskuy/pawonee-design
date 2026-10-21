# Spesifikasi Kartu Resep Pawonee

Framework-agnostik: dipakai Compose (app-kmp), Svelte 5 (web), dan Pedaree (ringkasan). Nilai gaya memakai token `--pwn-*` / `PawoneeTokens` (lihat `tokens/tokens.json`, PWN-DSG-002). `components/RecipeCard.tsx` adalah referensi React LAMA, usang, dilarang jadi dasar kode.

## Data (kontrak)

Sumber utama: `Rekomendasi` dari `POST /rekomendasi` (pawonee-backend-service `docs/api/openapi.yaml`). Contoh sah: [`contoh-rekomendasi.json`](./contoh-rekomendasi.json) (diuji).

| Kolom kartu | Field API | Tipe | Aturan tampil |
|---|---|---|---|
| Nama | `resep.nama` | string | maks 2 baris, elipsis |
| Durasi | `resep.waktuMenit` | int 1..45 | "N mnt" |
| Biaya | `resep.kisaranBiayaRp[0]`..`[1]` | int Rp (18.000..45.000, 4 jiwa) | "Rp18.000-Rp25.000" (titik ribuan id-ID) |
| Skor total | `skorTotal` | number 0..100 | bulatkan 1 desimal; tampil "Skor 87,5" (koma desimal) |
| Alasan | `alasan` | string, TEPAT 2 kalimat | tampil utuh, maks 3 baris di `ringkas`, utuh di `penuh` |
| Bahan terskala | `bahanTerskala[]` `{namaBahan, gram}` | gram int | "namaBahan 250 g"; ringkas: 3 pertama + "+N lagi" |
| Belanja tambahan | `belanjaTambahan[]` `{namaBahan, gram, perkiraanRp}` | gram int, Rp int | baris "namaBahan 200 g, ~Rp4.000"; di bawahnya "Total belanja ~RpX" (jumlah perkiraanRp). Kosong: "Tidak perlu belanja" |
| Lencana KURASI | (lihat Catatan 1) | | hanya resep dari bank grade-2 |
| Level pedas | (lihat Catatan 2) | | "pedas n/5" bila datanya ada |

Jiwa (1..8) berasal dari permintaan, bukan dari kartu; kartu `penuh` menulis "untuk N jiwa".

## Anatomi (atas ke bawah)

1. Gambar hidangan, rasio 4:3 (`--pwn-rasio-gambar`), radius `--pwn-radius-kartu` pada sudut atas; tanpa gambar: blok `latar` 4:3 dengan inisial nama.
2. Baris judul: nama resep (`judulKartu` 18/700) + lencana "KURASI" bila berlaku (latar `aksenTegas`, teks putih, `lencana` 12/700, radius `--pwn-radius-lencana`).
3. Baris skor: "Skor 87,5" (`judulKartu`) di kiri; di kanan durasi dan biaya (`metaKartu` 13/400, warna `teksSekunder`).
4. Alasan 2 kalimat (`metaKartu`, warna `teks`).
5. Bahan terskala (hanya `penuh`).
6. Belanja tambahan (hanya `penuh`): judul "Belanja tambahan", daftar baris, total.
7. Tombol "Lihat Resep" (latar `primer`, teks `teksDiAtasPrimer`, `labelTombol` 18/700, radius `--pwn-radius-tombol`, tinggi min `--pwn-ukuran-sentuh-min`).

Padding kartu `--pwn-jarak-kartu-padding` (16); jarak antar kartu `--pwn-jarak-antar-kartu` (12); lebar maks `--pwn-ukuran-kartu-lebar-maks` (320) di web.

## Varian

- `ringkas` (daftar beranda): gambar, judul+lencana, skor, durasi/biaya, alasan (maks 3 baris), tombol. Tanpa bahan dan belanja.
- `penuh` (layar rekomendasi, detail): semua blok.
- Keadaan: `normal`, `tekan` (tombol redup 90%), `fokus` (garis luar 2 dp warna `teks`), `memuat` (kerangka abu pada blok 1-4), `kosong` bukan kartu: layar menampilkan `rekomendasi-kosong` / `hasil` kosong.

## Aksesibilitas

- Kontras teks >= 4,5:1 (`teks`/`teksSekunder` di atas `latar`/`permukaan`); label tombol 18/700 di atas `primer` hanya memenuhi 3:1 (teks besar) — jangan diperkecil.
- Level pedas dan skor selalu berupa teks, bukan hanya warna ("pedas 3/5", "Skor 87,5").
- Area sentuh tombol >= 44x44 dp. Seluruh kartu satu fokus; tombol aksi urutan fokus terakhir.
- Gambar: `alt`/`contentDescription` = nama resep; gambar dekoratif bila nama sudah tertulis.
- Label layar-pembaca skor: "Skor 87,5 dari 100".

## Selektor uji

Container kartu `item-resep` (ringkas, beranda) atau `rekomendasi-item` (penuh); di dalamnya `rekomendasi-skor`, `rekomendasi-alasan`, `rekomendasi-belanja`. Daftar lengkap: `flow/flow.json` (PWN-DSG-003).

## Catatan / ketidaksesuaian (butuh keputusan manusia)

1. `Resep` pada openapi tidak memuat `grade`/penanda "KURASI". Sampai ada field, lencana disembunyikan (atau seluruh resep dianggap bank grade-2 dan lencana tidak dipakai). ADR-0001 mengikat lencana hanya untuk bank 12 resep.
2. `levelPedas` kartu 0-5 (spesifikasi lama) vs `ProfilKeluarga.levelPedas` 0-3 dan `Resep` tanpa `levelPedas`. Spesifikasi ini mempertahankan format "pedas n/5" hanya bila API menyediakannya.
3. Harga di contoh hanyalah contoh dari harga Lumbung G2 per 100 g; bukan sumber angka. Angka sebenarnya dari server.
