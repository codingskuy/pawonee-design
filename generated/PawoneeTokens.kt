// DIBANGKITKAN dari tokens/tokens.json (v1.0.0) oleh scripts/generate-tokens.mjs. Jangan edit manual.
package id.chefgenie.pawonee.design

import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

object PawoneeTokens {
    object Warna {
        val primer = Color(0xFFE8590C)
        val latar = Color(0xFFFFF9F2)
        val teks = Color(0xFF212529)
        val teksSekunder = Color(0xFF495057)
        val teksDiAtasPrimer = Color(0xFFFFFFFF)
        val permukaan = Color(0xFFFFFFFF)
        val aksen = Color(0xFF2F9E44)
        val aksenTegas = Color(0xFF237A35)
        val teksDiAtasAksenTegas = Color(0xFFFFFFFF)
        val peringatanPedas = Color(0xFFE03131)
    }
    object Radius {
        val kartu: Dp = 16.dp
        val tombol: Dp = 12.dp
        val lencana: Dp = 999.dp
    }
    object Jarak {
        val kartuPadding: Dp = 16.dp
        val antarKartu: Dp = 12.dp
        val layarPadding: Dp = 16.dp
    }
    object Ukuran {
        val sentuhMin: Dp = 44.dp
        val kartuLebarMaks: Dp = 320.dp
    }
    class Gaya(val ukuran: TextUnit, val berat: FontWeight)
    object Tipografi {
        val judulLayar = Gaya(24.sp, FontWeight(700))
        val judulKartu = Gaya(18.sp, FontWeight(700))
        val labelTombol = Gaya(18.sp, FontWeight(700))
        val metaKartu = Gaya(13.sp, FontWeight(400))
        val lencana = Gaya(12.sp, FontWeight(700))
    }
    /** Rasio gambar lebar:tinggi untuk Modifier.aspectRatio(). */
    const val RASIO_GAMBAR: Float = 4f / 3f
}
