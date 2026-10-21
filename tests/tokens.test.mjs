import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { bangkitCss, bangkitKotlin, kontras, validasi } from "../scripts/tokens-lib.mjs";

const baca = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const tokens = JSON.parse(baca("tokens/tokens.json"));
const salin = () => structuredClone(tokens);

describe("tokens.json", () => {
  test("memuat nilai wajib PWN-DSG-002", () => {
    expect(tokens.warna.primer).toBe("#E8590C");
    expect(tokens.warna.latar).toBe("#FFF9F2");
    expect(tokens.warna.teks).toBe("#212529");
    expect(tokens.radius.kartu).toBe(16);
    expect(tokens.radius.tombol).toBe(12);
    expect(tokens.rasioGambar).toEqual({ lebar: 4, tinggi: 3 });
  });
  test("valid tanpa galat", () => expect(validasi(tokens)).toEqual([]));
  test("jalur token bebas React", () => {
    const pkg = JSON.parse(baca("package.json"));
    expect(JSON.stringify(pkg)).not.toMatch(/react|next/i);
    expect(JSON.stringify(tokens)).not.toMatch(/react/i);
  });
});

describe("validasi", () => {
  test("menolak primer salah", () => {
    const t = salin();
    t.warna.primer = "#000000";
    expect(validasi(t).join()).toMatch(/warna\.primer/);
  });
  test("menolak hex rusak", () => {
    const t = salin();
    t.warna.aksen = "hijau";
    expect(validasi(t).join()).toMatch(/warna\.aksen/);
  });
  test("menolak radius & rasio salah", () => {
    const t = salin();
    t.radius.kartu = 8;
    t.rasioGambar = { lebar: 16, tinggi: 9 };
    const e = validasi(t).join();
    expect(e).toMatch(/radius\.kartu/);
    expect(e).toMatch(/4:3/);
  });
  test("menolak kontras rendah", () => {
    const t = salin();
    t.warna.teksSekunder = "#CCCCCC";
    expect(validasi(t).join()).toMatch(/kontras teksSekunder/);
  });
  test("label tombol kecil menuntut 4,5:1 (putih di primer gagal)", () => {
    const t = salin();
    t.tipografi.labelTombol = { ukuran: 14, berat: 400 };
    expect(validasi(t).join()).toMatch(/teksDiAtasPrimer/);
  });
  test("kontras hitam/putih = 21", () => expect(kontras("#000000", "#FFFFFF")).toBeCloseTo(21, 5));
});

describe("pembangkit", () => {
  test("CSS memuat custom property kebab-case", () => {
    const css = bangkitCss(tokens);
    expect(css).toContain("--pwn-warna-primer: #E8590C;");
    expect(css).toContain("--pwn-radius-kartu: 16px;");
    expect(css).toContain("--pwn-rasio-gambar: 4 / 3;");
    expect(css).toContain("--pwn-tipografi-judul-kartu-ukuran: 18px;");
  });
  test("Kotlin memuat Color ARGB, Dp, sp", () => {
    const kt = bangkitKotlin(tokens);
    expect(kt).toContain("val primer = Color(0xFFE8590C)");
    expect(kt).toContain("val kartu: Dp = 16.dp");
    expect(kt).toContain("Gaya(18.sp, FontWeight(700))");
    expect(kt).toContain("package id.chefgenie.pawonee.design");
  });
  test("keluaran deterministik", () => expect(bangkitCss(tokens)).toBe(bangkitCss(salin())));
  test("berkas generated/ mutakhir terhadap tokens.json", () => {
    expect(baca("generated/pawonee-tokens.css")).toBe(bangkitCss(tokens));
    expect(baca("generated/PawoneeTokens.kt")).toBe(bangkitKotlin(tokens));
  });
});
