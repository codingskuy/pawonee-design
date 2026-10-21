# pawonee-design

Sistem desain Pawonee — **Divisi Pawonee (AI Cooking Assistant)**, org `Coding-Skuy`. Komponen utama: **kartu resep** yang dipakai aplikasi KMP rekomendasi-mobile dan web pendamping. Bagian dari arsitektur **Opsi A ChefGenie**.

- TownHall: [Coding-Skuy/Pawonee-TownHall](https://github.com/Coding-Skuy/Pawonee-TownHall).
- Data kartu resep mengikuti modul `:shared:pantry-resep` **milik Pawonee** (sumber: `pawonee-app-kmp/shared/pantry-resep`): `nama`, `menit`, `levelPedas`, `estimasiBiaya`.
- Konsumen hilir: **Pedaree** menampilkan ringkasan resep Pawonee dengan gaya kartu yang sama agar pengalaman konsisten.

## Isi

```
tokens/tokens.json            # warna, radius, tipografi (satu sumber)
components/RecipeCard.md      # spesifikasi kartu resep (anatomi, varian, aksesibilitas)
components/HalamanPublik.md   # halaman publik resep tanpa login + Buka di aplikasi
components/CetakResep.md      # cetak 1 halaman A4
components/contoh-rekomendasi.json  # contoh data kartu (diuji terhadap skema openapi)
components/RecipeCard.tsx     # USANG: referensi React lama, jangan diadopsi
```

## Token (ringkas)

Warna primer `#E8590C` (oranye Pawonee), latar `#FFF9F2`, teks `#212529`. Radius kartu 16, tombol 12. Lihat `tokens/tokens.json` untuk nilai lengkap.

## Aturan kartu resep

1. Selalu tampilkan nama, durasi (menit), level pedas (0–5), dan estimasi biaya.
2. Status grade-2 ditandai lencana "KURASI" — hanya untuk resep dari `pawonee-ai-models`.
3. Rasio gambar 4:3; teks nama maksimal 2 baris dengan elipsis.

## Repo terkait

- [pawonee-app-kmp](https://github.com/Coding-Skuy/pawonee-app-kmp)
- [pawonee-web](https://github.com/Coding-Skuy/pawonee-web)
- [pawonee-ai-models](https://github.com/Coding-Skuy/pawonee-ai-models)

## Figma

Link Figma: **belum terdaftar** — berkas Figma belum dibuat/dibagikan (placeholder; isi oleh pemilik desain: `https://www.figma.com/design/<kunci-berkas>`). Token di repo ini adalah sumber kebenaran sementara.
