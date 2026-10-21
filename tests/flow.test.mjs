import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { LAYAR, PROFIL, RUTE, validasiFlow } from "../scripts/validate-flow.mjs";

const flow = JSON.parse(readFileSync(new URL("../flow/flow.json", import.meta.url), "utf8"));
const salin = () => structuredClone(flow);

describe("flow.json", () => {
  test("valid tanpa galat", () => expect(validasiFlow(flow)).toEqual([]));
  test("6 layar mobile dan 5 rute web", () => {
    expect(flow.layarMobile.map((l) => l.nama)).toEqual(LAYAR);
    expect(flow.rutaWeb.map((r) => r.rute)).toEqual(RUTE);
  });
  test("4 profil baku dengan jiwa 4, balita, 3 vegetarian, 8", () => {
    expect(flow.profilBaku.map((p) => p.kunci)).toEqual(PROFIL);
    expect(flow.profilBaku.map((p) => p.jumlahJiwa)).toEqual([4, 3, 3, 8]);
    expect(flow.profilBaku[1].komposisi.balita).toBe(1);
    expect(flow.profilBaku[2].pantangan).toContain("vegetarian-nabati");
  });
  test("deep link pawonee://resep/{id}?jiwa=4", () => {
    expect(flow.deepLink.pola).toBe("pawonee://resep/{id}?jiwa={n}");
    expect(flow.deepLink.contoh).toMatch(/\?jiwa=4$/);
  });
  test("selektor yang sudah dipakai pawonee-web dipertahankan", () => {
    const ada = new Set([...flow.layarMobile.flatMap((l) => l.selektor), ...flow.selektorTambahanWeb].map((s) => s.id));
    for (const id of ["beranda", "buka-aplikasi", "cetak", "galat", "hasil", "item-resep", "jiwa", "mode-hemat", "resep-publik", "riwayat"]) {
      expect(ada.has(id)).toBe(true);
    }
  });
});

describe("validasiFlow", () => {
  test("menolak layar hilang", () => {
    const f = salin();
    f.layarMobile.pop();
    expect(validasiFlow(f).join()).toMatch(/layarMobile harus/);
  });
  test("menolak selektor ganda", () => {
    const f = salin();
    f.layarMobile[1].selektor.push({ id: "beranda", peran: "bentrok" });
    expect(validasiFlow(f).join()).toMatch(/selektor ganda: beranda/);
  });
  test("menolak selektor bukan kebab-case", () => {
    const f = salin();
    f.layarMobile[1].selektor[1].id = "StokDaftar";
    expect(validasiFlow(f).join()).toMatch(/bukan kebab-case/);
  });
  test("menolak rute yang memakai selektor tak terdaftar", () => {
    const f = salin();
    f.rutaWeb[1].selektorDipakai.push("tidak-ada");
    expect(validasiFlow(f).join()).toMatch(/tak terdaftar tidak-ada/);
  });
  test("menolak profil jiwa di luar 1..8 dan komposisi tak cocok", () => {
    const f = salin();
    f.profilBaku[0].jumlahJiwa = 9;
    const e = validasiFlow(f).join();
    expect(e).toMatch(/di luar 1\.\.8/);
    expect(e).toMatch(/komposisi/);
  });
  test("menolak deep link contoh di luar R-01..R-12", () => {
    const f = salin();
    f.deepLink.contoh = "pawonee://resep/R-13?jiwa=4";
    expect(validasiFlow(f).join()).toMatch(/deepLink\.contoh/);
  });
});
