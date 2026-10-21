import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const baca = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const contoh = JSON.parse(baca("components/contoh-rekomendasi.json"));
const r = contoh.rekomendasi;

const KELOMPOK = ["kuah", "tumis", "sambal", "lauk", "kukus"];
const jumlahKalimat = (s) => s.split(/(?<=[.!?])\s+/).filter(Boolean).length;
const ada = (teks, ...kata) => kata.forEach((k) => expect(teks).toContain(k));

describe("contoh-rekomendasi.json sesuai skema Rekomendasi (openapi)", () => {
  test("resep: id R-01..R-12, waktu 1..45, biaya 18.000..45.000 bulat", () => {
    expect(r.resep.id).toMatch(/^R-(0[1-9]|1[0-2])$/);
    expect(KELOMPOK).toContain(r.resep.kelompok);
    expect(r.resep.waktuMenit).toBeGreaterThanOrEqual(1);
    expect(r.resep.waktuMenit).toBeLessThanOrEqual(45);
    expect(r.resep.kisaranBiayaRp).toHaveLength(2);
    for (const b of r.resep.kisaranBiayaRp) {
      expect(Number.isInteger(b)).toBe(true);
      expect(b).toBeGreaterThanOrEqual(18000);
      expect(b).toBeLessThanOrEqual(45000);
    }
  });
  test("skor 0..100", () => {
    expect(r.skorTotal).toBeGreaterThanOrEqual(0);
    expect(r.skorTotal).toBeLessThanOrEqual(100);
  });
  test("alasan tepat 2 kalimat", () => expect(jumlahKalimat(r.alasan)).toBe(2));
  test("bahan terskala: gram bulat >= 0", () => {
    expect(r.bahanTerskala.length).toBeGreaterThan(0);
    for (const b of r.bahanTerskala) expect(Number.isInteger(b.gram) && b.gram >= 0).toBe(true);
  });
  test("belanja tambahan: nama, gram, rupiah bulat; total <= budget profil", () => {
    for (const b of r.belanjaTambahan) {
      expect(b.namaBahan).toBeTruthy();
      expect(Number.isInteger(b.gram) && b.gram >= 0).toBe(true);
      expect(Number.isInteger(b.perkiraanRp) && b.perkiraanRp >= 0).toBe(true);
    }
    const total = r.belanjaTambahan.reduce((a, b) => a + b.perkiraanRp, 0);
    expect(total).toBeLessThanOrEqual(contoh.budgetPerMakan);
  });
  test("jiwa 1..8", () => {
    expect(contoh.jiwa).toBeGreaterThanOrEqual(1);
    expect(contoh.jiwa).toBeLessThanOrEqual(8);
  });
});

describe("spesifikasi memuat butir kriteria", () => {
  test("RecipeCard: skor total, alasan 2 kalimat, bahan terskala, belanja tambahan, varian, aksesibilitas", () => {
    const t = baca("components/RecipeCard.md");
    ada(t, "Skor total", "TEPAT 2 kalimat", "Bahan terskala", "Belanja tambahan", "perkiraanRp", "`ringkas`", "`penuh`", "## Aksesibilitas", "44x44");
  });
  test("RecipeCard memakai token --pwn-, bukan hex mentah, dan menyebut React lama usang", () => {
    const t = baca("components/RecipeCard.md");
    expect(t).toContain("--pwn-");
    expect(t).not.toMatch(/#[0-9A-Fa-f]{6}/);
    expect(t).toMatch(/usang/);
  });
  test("HalamanPublik: tanpa login, tombol Buka di aplikasi, deep link, fallback jiwa 4", () => {
    const t = baca("components/HalamanPublik.md");
    ada(t, "tanpa login", "Buka di aplikasi", "pawonee://resep/{id}?jiwa={n}", "jatuh ke **4**", "buka-aplikasi", "cetak", "resep-publik");
  });
  test("CetakResep: A4, 1 halaman, @media print", () => {
    const t = baca("components/CetakResep.md");
    ada(t, "A4", "Satu halaman", "@media print", "15mm");
  });
  test("selektor yang disebut spesifikasi terdaftar di flow.json (bila ada)", () => {
    let flow;
    try {
      flow = JSON.parse(baca("flow/flow.json"));
    } catch {
      return; // flow.json masuk lewat PWN-DSG-003
    }
    const ids = new Set([...flow.layarMobile.flatMap((l) => l.selektor), ...flow.selektorTambahanWeb].map((s) => s.id));
    for (const id of ["item-resep", "rekomendasi-item", "rekomendasi-skor", "rekomendasi-alasan", "rekomendasi-belanja", "buka-aplikasi", "cetak", "resep-publik"]) {
      expect(ids.has(id)).toBe(true);
    }
  });
});
