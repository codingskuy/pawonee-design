#!/usr/bin/env node
// Pemakaian: node scripts/generate-tokens.mjs [--check]
// Tanpa flag: validasi lalu tulis generated/pawonee-tokens.css dan generated/PawoneeTokens.kt.
// --check: validasi + pastikan berkas generated/ sama dengan keluaran (untuk CI); keluar 1 bila beda.
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bangkitCss, bangkitKotlin, validasi } from "./tokens-lib.mjs";

const akar = join(dirname(fileURLToPath(import.meta.url)), "..");
const tokens = JSON.parse(readFileSync(join(akar, "tokens/tokens.json"), "utf8"));
const galat = validasi(tokens);
if (galat.length) {
  console.error("Token tidak valid:\n- " + galat.join("\n- "));
  process.exit(1);
}
const keluaran = {
  "generated/pawonee-tokens.css": bangkitCss(tokens),
  "generated/PawoneeTokens.kt": bangkitKotlin(tokens),
};
const cekSaja = process.argv.includes("--check");
let beda = false;
for (const [rel, isi] of Object.entries(keluaran)) {
  const path = join(akar, rel);
  if (cekSaja) {
    if (!existsSync(path) || readFileSync(path, "utf8") !== isi) {
      console.error(`Usang: ${rel} (jalankan: node scripts/generate-tokens.mjs)`);
      beda = true;
    }
  } else {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, isi);
    console.log(`Ditulis ${rel}`);
  }
}
if (beda) process.exit(1);
if (cekSaja) console.log("Token valid dan berkas generated/ mutakhir.");
