# Flow Pawonee: 6 layar mobile + 5 rute web pendamping

Sumber mesin-terbaca: [`flow.json`](./flow.json) (divalidasi `node scripts/validate-flow.mjs`, uji `bun test`). Dokumen ini adalah penjelasannya. Rujukan requirement: PRD 10-pengguna, PRD 30 (US-001..US-006), FSD 10-alur butir 5-6 di Pawonee-TownHall `platform/versions/v1.0.0`. Penambahan/penghapusan layar = PRD/FSD versi baru di TownHall lebih dulu.

## Peta navigasi mobile (KMP, Navigation3)

```
beranda --+--> stok --------> rekomendasi
          +--> rekomendasi --> resepDetail --> riwayat
          +--> preferensi
          +--> riwayat -----> resepDetail
deep link pawonee://resep/{id}?jiwa=4 --> resepDetail (langsung)
```

| Layar | Tujuan | Menuju |
|---|---|---|
| beranda | atur jiwa + mode hemat, lihat maks 5 rekomendasi teratas | stok, rekomendasi, preferensi, riwayat |
| stok | stok dapur (baca dari Pedaree; Pawonee tidak menulis), grade + kedaluwarsa, penanda data usang | beranda, rekomendasi |
| rekomendasi | skor total, alasan 2 kalimat, belanja tambahan (nama, gram, perkiraan Rp) | resepDetail, beranda |
| resepDetail | bahan terskala sesuai jiwa 1-8, langkah, belanja tambahan, "Sudah dimasak", bagi | rekomendasi, riwayat |
| preferensi | editor profil; 4 profil baku sebagai titik awal | beranda |
| riwayat | masakan + serapan G2 mingguan | beranda, resepDetail |

Deep link: `pawonee://resep/{id}?jiwa={n}`, contoh `pawonee://resep/R-04?jiwa=4`. `id` = `R-01`..`R-12`; `jiwa` bulat 1..8 (di luar rentang: kode galat `JIWA_DI_LUAR_RENTANG`, layar jatuh ke jiwa profil). Tautan yang sama dibuat tombol "Buka di aplikasi" pada `/resep/[id]` web (sudah ada di pawonee-web).

## Rute web pendamping (SvelteKit)

| Rute | Setara mobile | Catatan |
|---|---|---|
| `/` | beranda + rekomendasi | satu halaman (rekomendasi tidak punya rute sendiri) |
| `/stok` | stok | hanya baca |
| `/resep/[id]` | resepDetail | publik tanpa login; tombol "Buka di aplikasi"; cetak 1 halaman (spesifikasi di PWN-DSG-004) |
| `/preferensi` | preferensi | editor profil sama |
| `/riwayat` | riwayat | |

## Editor profil: 4 profil baku

Nilai profil mengikuti skema `ProfilKeluarga` (openapi.yaml pawonee-backend-service). `budgetPerMakan` rupiah bulat; `levelPedas` 0..3 pada profil.

| Kunci | Nama | Jiwa | Komposisi | Pantangan | Budget | Pedas |
|---|---|---|---|---|---|---|
| `budi` | Budi, 4 jiwa | 4 | 2 dewasa, 2 anak | halal-selalu | 35.000 | 2 |
| `sari` | Sari, keluarga balita | 3 | 2 dewasa, 1 balita | rendah-garam | 35.000 | 0 |
| `vegetarian` | Vegetarian, 3 jiwa | 3 | 3 dewasa | vegetarian-nabati | 35.000 | 1 |
| `warung` | Warung, 8 jiwa | 8 | 8 dewasa | - | 45.000 | 2 |

ASUMSI: BRD `20-preferensi-keluarga.md` tidak ada di repo/akses ini; hanya nama, jumlah jiwa, dan ciri (balita, vegetarian) yang diambil dari tiket. Komposisi, pantangan, budget, pedas, dan alat masak adalah usulan dan harus dicocokkan dengan BRD saat tersedia. Budget bawaan keluarga baru 35.000 (openapi).

## Selektor uji (Maestro)

Aturan: satu string `id` kebab-case, IDENTIK sebagai `Modifier.testTag("<id>")` (Compose) dan `data-testid="<id>"` (web). Daftar lengkap per layar ada di `flow.json` (`layarMobile[].selektor`, `selektorTambahanWeb`). Item bertanda `dipakaiWeb: true` sudah ada di kode pawonee-web (beranda, jiwa, mode-hemat, hasil, item-resep, galat, riwayat, resep-publik, buka-aplikasi, cetak) dan TIDAK boleh diganti nama.

Compose: aktifkan `Modifier.semantics { testTagsAsResourceId = true }` pada akar agar Maestro membaca `testTag` sebagai `id`.

Contoh alur Maestro (app):
```yaml
appId: id.chefgenie.pawonee
---
- launchApp
- assertVisible:
    id: beranda
- tapOn:
    id: nav-preferensi
- tapOn:
    id: profil-pilih-warung
- tapOn:
    id: profil-simpan
- tapOn:
    id: nav-stok
- assertVisible:
    id: stok-daftar
- openLink: pawonee://resep/R-04?jiwa=4
- assertVisible:
    id: resep-detail
```
(Alur ini contoh, belum dijalankan; `appId` dan layar KMP belum ada di app-kmp.)

## Ketidaksesuaian yang ditemukan

- `RecipeCard.md` menulis level pedas 0-5 dan kolom `grade`, sedangkan openapi `ProfilKeluarga.levelPedas` 0-3 dan skema `Resep` tidak memuat `levelPedas`/`grade`. Perlu keputusan manusia (lihat PWN-DSG-004).
- Dokumen BRD 20 tidak tersedia untuk memverifikasi profil baku.
