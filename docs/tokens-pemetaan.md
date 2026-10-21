# Pemetaan token Pawonee ke Compose dan CSS

Sumber tunggal: `tokens/tokens.json` (JSON datar, tanpa dependensi framework). Berkas di `generated/` dibangkitkan dan JANGAN diedit manual:

```
bun run tokens         # validasi + tulis generated/pawonee-tokens.css dan generated/PawoneeTokens.kt
bun run tokens:check   # validasi + gagal bila generated/ usang (untuk CI)
bun test               # uji validator dan pembangkit
```

## Aturan satuan

| Jenis | JSON | CSS | Compose |
|---|---|---|---|
| Warna | `#RRGGBB` | `#RRGGBB` | `Color(0xFFRRGGBB)` |
| Radius, jarak, ukuran | angka bulat | `px` | `.dp` |
| Tipografi ukuran | angka bulat | `px` | `.sp` |
| Tipografi berat | 400/700 | `font-weight` | `FontWeight(n)` |
| Rasio gambar | `{lebar:4, tinggi:3}` | `4 / 3` (`aspect-ratio`) | `Modifier.aspectRatio(4f/3f)` |

Penamaan: CSS `--pwn-<grup>-<kunci-kebab>` (mis. `--pwn-warna-teks-sekunder`); Kotlin `PawoneeTokens.<Grup>.<kunciCamel>` di paket `id.chefgenie.pawonee.design`.

## Tabel token

| Token | Nilai | CSS | Compose |
|---|---|---|---|
| warna.primer | #E8590C | `--pwn-warna-primer` | `PawoneeTokens.Warna.primer` |
| warna.latar | #FFF9F2 | `--pwn-warna-latar` | `PawoneeTokens.Warna.latar` |
| warna.teks | #212529 | `--pwn-warna-teks` | `PawoneeTokens.Warna.teks` |
| warna.teksSekunder | #495057 | `--pwn-warna-teks-sekunder` | `...Warna.teksSekunder` |
| warna.teksDiAtasPrimer | #FFFFFF | `--pwn-warna-teks-di-atas-primer` | `...Warna.teksDiAtasPrimer` |
| warna.permukaan | #FFFFFF | `--pwn-warna-permukaan` | `...Warna.permukaan` |
| warna.aksen | #2F9E44 | `--pwn-warna-aksen` | `...Warna.aksen` |
| warna.aksenTegas | #237A35 | `--pwn-warna-aksen-tegas` | `...Warna.aksenTegas` |
| warna.peringatanPedas | #E03131 | `--pwn-warna-peringatan-pedas` | `...Warna.peringatanPedas` |
| radius.kartu / tombol / lencana | 16 / 12 / 999 | `--pwn-radius-*` | `...Radius.*` |
| jarak.kartuPadding / antarKartu / layarPadding | 16 / 12 / 16 | `--pwn-jarak-*` | `...Jarak.*` |
| ukuran.sentuhMin | 44 | `--pwn-ukuran-sentuh-min` | `...Ukuran.sentuhMin` |
| rasioGambar | 4:3 | `--pwn-rasio-gambar` | `PawoneeTokens.RASIO_GAMBAR` |

## Contoh pakai

Web (Svelte 5, CSS): salin `generated/pawonee-tokens.css` ke `src/` lalu
`.kartu { background: var(--pwn-warna-permukaan); border-radius: var(--pwn-radius-kartu); padding: var(--pwn-jarak-kartu-padding); }`.

Compose (KMP): salin `generated/PawoneeTokens.kt` ke `commonMain` (paket `id.chefgenie.pawonee.design`), lalu
`Card(shape = RoundedCornerShape(PawoneeTokens.Radius.kartu), colors = CardDefaults.cardColors(containerColor = PawoneeTokens.Warna.permukaan))`.

## Aksesibilitas yang divalidasi pembangkit

- teks/latar, teksSekunder/latar, teks/permukaan, teksDiAtasAksenTegas/aksenTegas >= 4,5:1.
- teksDiAtasPrimer/primer = 3,58:1: tidak memenuhi 4,5:1, hanya sah sebagai teks besar WCAG (>= 18 px tebal), karena itu `tipografi.labelTombol` dikunci 18/700. Label tombol di atas `primer` tidak boleh lebih kecil.
- peringatanPedas/latar >= 3:1 hanya untuk ikon (bukan teks); level pedas selalu juga ditulis angka "pedas n/5".

## Asumsi (turunan; tidak ada di PRD)

`teksSekunder`, `permukaan`, `aksenTegas`, `judulLayar`, `labelTombol`, `lencana`, `layarPadding`, `sentuhMin`, `kartuLebarMaks` ditambahkan di v1.0.0 repo ini untuk kebutuhan layar/komponen; nilainya mengikuti `components/RecipeCard.tsx` lama (padding 16, maks 320, badge 12) atau dipilih agar lulus kontras. Perubahan yang dipakai KMP/web/Pedaree perlu persetujuan pemilik divisi.
