// Pembangkit & validator token desain Pawonee (framework-agnostik, tanpa dependensi).
// Satuan: warna hex #RRGGBB; radius/jarak/ukuran dp (Compose) = px (CSS); tipografi ukuran sp = px.

export const PREFIKS_CSS = "pwn";
export const PAKET_KOTLIN = "id.chefgenie.pawonee.design";

const HEX = /^#[0-9A-Fa-f]{6}$/;

export const kebab = (s) => s.replace(/([A-Z])/g, "-$1").toLowerCase();

/** Kontras WCAG 2.1 antara dua warna hex. */
export function kontras(a, b) {
  const lum = (h) => {
    const [r, g, bl] = [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Kembalikan daftar galat validasi (kosong = valid). */
export function validasi(t) {
  const e = [];
  const w = t.warna ?? {};
  const wajib = { primer: "#E8590C", latar: "#FFF9F2", teks: "#212529" };
  for (const [k, v] of Object.entries(wajib)) if (w[k]?.toUpperCase() !== v) e.push(`warna.${k} harus ${v}`);
  for (const [k, v] of Object.entries(w)) if (!HEX.test(v)) e.push(`warna.${k} bukan hex #RRGGBB: ${v}`);
  if (t.radius?.kartu !== 16) e.push("radius.kartu harus 16");
  if (t.radius?.tombol !== 12) e.push("radius.tombol harus 12");
  if (t.rasioGambar?.lebar !== 4 || t.rasioGambar?.tinggi !== 3) e.push("rasioGambar harus 4:3");
  if (!(t.ukuran?.sentuhMin >= 44)) e.push("ukuran.sentuhMin minimal 44");
  for (const [g, v] of Object.entries(t.tipografi ?? {})) {
    if (!Number.isInteger(v.ukuran) || !Number.isInteger(v.berat)) e.push(`tipografi.${g} harus bilangan bulat`);
  }
  // Aksesibilitas (AGENTS/RecipeCard.md: kontras >= 4.5:1; teks besar >= 18px tebal boleh 3:1).
  const cek = (nm, fg, bg, min) => {
    if (!HEX.test(w[fg] ?? "") || !HEX.test(w[bg] ?? "")) return e.push(`kontras ${nm}: warna ${fg}/${bg} tidak ada`);
    const c = kontras(w[fg], w[bg]);
    if (c < min) e.push(`kontras ${nm} ${c.toFixed(2)} < ${min}`);
  };
  cek("teks/latar", "teks", "latar", 4.5);
  cek("teksSekunder/latar", "teksSekunder", "latar", 4.5);
  cek("teks/permukaan", "teks", "permukaan", 4.5);
  const lt = t.tipografi?.labelTombol;
  const besar = lt && lt.ukuran >= 18 && lt.berat >= 700; // teks besar WCAG
  cek("teksDiAtasPrimer/primer", "teksDiAtasPrimer", "primer", besar ? 3 : 4.5);
  cek("teksDiAtasAksenTegas/aksenTegas", "teksDiAtasAksenTegas", "aksenTegas", 4.5);
  cek("peringatanPedas/latar (non-teks)", "peringatanPedas", "latar", 3);
  return e;
}

export function bangkitCss(t) {
  const p = (...s) => `--${PREFIKS_CSS}-${s.map(kebab).join("-")}`;
  const baris = [];
  for (const [k, v] of Object.entries(t.warna)) baris.push(`  ${p("warna", k)}: ${v};`);
  for (const [k, v] of Object.entries(t.radius)) baris.push(`  ${p("radius", k)}: ${v}px;`);
  for (const [k, v] of Object.entries(t.jarak)) baris.push(`  ${p("jarak", k)}: ${v}px;`);
  for (const [k, v] of Object.entries(t.ukuran)) baris.push(`  ${p("ukuran", k)}: ${v}px;`);
  for (const [k, v] of Object.entries(t.tipografi)) {
    baris.push(`  ${p("tipografi", k, "ukuran")}: ${v.ukuran}px;`);
    baris.push(`  ${p("tipografi", k, "berat")}: ${v.berat};`);
  }
  baris.push(`  ${p("rasio-gambar")}: ${t.rasioGambar.lebar} / ${t.rasioGambar.tinggi};`);
  return `/* DIBANGKITKAN dari tokens/tokens.json (v${t.versi}) oleh scripts/generate-tokens.mjs. Jangan edit manual. */\n:root {\n${baris.join("\n")}\n}\n`;
}

export function bangkitKotlin(t) {
  const argb = (h) => `Color(0xFF${h.slice(1).toUpperCase()})`;
  const o = [];
  o.push(`// DIBANGKITKAN dari tokens/tokens.json (v${t.versi}) oleh scripts/generate-tokens.mjs. Jangan edit manual.`);
  o.push(`package ${PAKET_KOTLIN}`, "");
  o.push("import androidx.compose.ui.graphics.Color", "import androidx.compose.ui.text.font.FontWeight", "import androidx.compose.ui.unit.Dp", "import androidx.compose.ui.unit.TextUnit", "import androidx.compose.ui.unit.dp", "import androidx.compose.ui.unit.sp", "");
  o.push("object PawoneeTokens {");
  o.push("    object Warna {");
  for (const [k, v] of Object.entries(t.warna)) o.push(`        val ${k} = ${argb(v)}`);
  o.push("    }", "    object Radius {");
  for (const [k, v] of Object.entries(t.radius)) o.push(`        val ${k}: Dp = ${v}.dp`);
  o.push("    }", "    object Jarak {");
  for (const [k, v] of Object.entries(t.jarak)) o.push(`        val ${k}: Dp = ${v}.dp`);
  o.push("    }", "    object Ukuran {");
  for (const [k, v] of Object.entries(t.ukuran)) o.push(`        val ${k}: Dp = ${v}.dp`);
  o.push("    }", "    class Gaya(val ukuran: TextUnit, val berat: FontWeight)", "    object Tipografi {");
  for (const [k, v] of Object.entries(t.tipografi)) o.push(`        val ${k} = Gaya(${v.ukuran}.sp, FontWeight(${v.berat}))`);
  o.push("    }");
  o.push(`    /** Rasio gambar lebar:tinggi untuk Modifier.aspectRatio(). */`, `    const val RASIO_GAMBAR: Float = ${t.rasioGambar.lebar}f / ${t.rasioGambar.tinggi}f`);
  o.push("}", "");
  return o.join("\n");
}
