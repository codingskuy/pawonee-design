#!/usr/bin/env node
// Validasi flow/flow.json: 6 layar, 5 rute, selektor unik & kebab-case, 4 profil baku, deep link.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const LAYAR = ["beranda", "stok", "rekomendasi", "resepDetail", "preferensi", "riwayat"];
export const RUTE = ["/", "/stok", "/resep/[id]", "/preferensi", "/riwayat"];
export const PROFIL = ["budi", "sari", "vegetarian", "warung"];
const ID = /^[a-z][a-z0-9]*(-[a-z0-9]+)*$/;
const ALERGI = ["udang", "telur", "kacang-tanah", "kedelai", "susu-sapi", "ikan", "gluten"];
const PANTANGAN = ["halal-selalu", "vegetarian-nabati", "tanpa-santan", "rendah-garam", "rendah-gula", "lunak-lansia"];
const ALAT = ["kompor", "wajan", "panci", "kukusan", "blender", "oven", "air-fryer"];

export function validasiFlow(f) {
  const e = [];
  const nama = (f.layarMobile ?? []).map((l) => l.nama);
  if (JSON.stringify(nama) !== JSON.stringify(LAYAR)) e.push(`layarMobile harus ${LAYAR.join(",")}`);
  const rute = (f.rutaWeb ?? []).map((r) => r.rute);
  if (JSON.stringify(rute) !== JSON.stringify(RUTE)) e.push(`rutaWeb harus ${RUTE.join(",")}`);

  const semua = new Set();
  const daftarkan = (id) => {
    if (!ID.test(id)) e.push(`selektor ${id} bukan kebab-case`);
    if (semua.has(id)) e.push(`selektor ganda: ${id}`);
    semua.add(id);
  };
  for (const l of f.layarMobile ?? []) {
    for (const k of l.ke ?? []) if (!LAYAR.includes(k)) e.push(`${l.nama}: tujuan tak dikenal ${k}`);
    if (l.selektor?.[0]?.peran !== "akar layar") e.push(`${l.nama}: selektor pertama harus akar layar`);
    for (const s of l.selektor ?? []) daftarkan(s.id);
  }
  for (const s of f.selektorTambahanWeb ?? []) daftarkan(s.id);
  for (const r of f.rutaWeb ?? []) {
    for (const s of r.selektorDipakai ?? []) if (!semua.has(s)) e.push(`${r.rute}: selektor tak terdaftar ${s}`);
    for (const m of r.setaraMobile ?? []) if (!LAYAR.includes(m)) e.push(`${r.rute}: setaraMobile tak dikenal ${m}`);
  }

  if (f.deepLink?.pola !== "pawonee://resep/{id}?jiwa={n}") e.push("deepLink.pola harus pawonee://resep/{id}?jiwa={n}");
  if (!/^pawonee:\/\/resep\/R-(0[1-9]|1[0-2])\?jiwa=[1-8]$/.test(f.deepLink?.contoh ?? "")) {
    e.push("deepLink.contoh tidak cocok dengan pola (R-01..R-12, jiwa 1..8)");
  }

  const kunci = (f.profilBaku ?? []).map((p) => p.kunci);
  if (JSON.stringify(kunci) !== JSON.stringify(PROFIL)) e.push(`profilBaku harus ${PROFIL.join(",")}`);
  for (const p of f.profilBaku ?? []) {
    if (!(p.jumlahJiwa >= 1 && p.jumlahJiwa <= 8)) e.push(`${p.kunci}: jumlahJiwa di luar 1..8`);
    const k = p.komposisi;
    if (k && k.dewasa + k.anak + k.balita + k.lansia !== p.jumlahJiwa) e.push(`${p.kunci}: komposisi tidak sama dengan jumlahJiwa`);
    if (!Number.isInteger(p.budgetPerMakan) || p.budgetPerMakan <= 0) e.push(`${p.kunci}: budgetPerMakan harus rupiah bulat`);
    if (!(p.levelPedas >= 0 && p.levelPedas <= 3)) e.push(`${p.kunci}: levelPedas 0..3`);
    for (const a of p.alergi) if (!ALERGI.includes(a)) e.push(`${p.kunci}: alergi tak sah ${a}`);
    for (const a of p.pantangan) if (!PANTANGAN.includes(a)) e.push(`${p.kunci}: pantangan tak sah ${a}`);
    for (const a of p.alatMasak) if (!ALAT.includes(a)) e.push(`${p.kunci}: alat tak sah ${a}`);
  }
  const pref = (f.layarMobile ?? []).find((l) => l.nama === "preferensi");
  for (const k of PROFIL) {
    if (!pref?.selektor.some((s) => s.id === `profil-pilih-${k}`)) e.push(`preferensi tanpa selektor profil-pilih-${k}`);
  }
  return e;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
  const f = JSON.parse(readFileSync(join(akar, "flow/flow.json"), "utf8"));
  const e = validasiFlow(f);
  if (e.length) {
    console.error("Flow tidak valid:\n- " + e.join("\n- "));
    process.exit(1);
  }
  console.log("Flow valid: 6 layar, 5 rute, 4 profil baku.");
}
