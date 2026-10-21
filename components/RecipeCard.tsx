// USANG (PWN-DSG-004): referensi React lama, JANGAN diadopsi. Web target Svelte 5; sumber kebenaran = components/RecipeCard.md.
// Implementasi referensi kartu resep untuk web (React 19).
// Data mengikuti modul `:shared:pantry-resep` milik Pawonee.

export interface RecipeCardProps {
  nama: string;
  menit: number;
  levelPedas: number;
  estimasiBiaya: number;
  grade?: number;
  gambar?: string;
}

export function RecipeCard({ nama, menit, levelPedas, estimasiBiaya, grade, gambar }: RecipeCardProps) {
  return (
    <article
      style={{
        borderRadius: 16,
        background: "#FFF9F2",
        padding: 16,
        color: "#212529",
        maxWidth: 320,
      }}
    >
      {gambar && <img src={gambar} alt={nama} style={{ width: "100%", aspectRatio: "4 / 3", borderRadius: 12 }} />}
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <h3 style={{ fontSize: 18, margin: "8px 0" }}>{nama}</h3>
        {grade === 2 && (
          <span style={{ borderRadius: 999, background: "#2F9E44", color: "#fff", padding: "2px 10px", fontSize: 12 }}>
            KURASI
          </span>
        )}
      </div>
      <p style={{ fontSize: 13, margin: 0 }}>
        {menit} mnt • pedas {levelPedas}/5 • Rp{estimasiBiaya.toLocaleString("id-ID")}
      </p>
      <button style={{ marginTop: 12, borderRadius: 12, background: "#E8590C", color: "#fff", padding: "10px 16px" }}>
        Lihat Resep
      </button>
    </article>
  );
}
