# 🏁 Paddock Hub - Formula 1 & MotoGP 2026 Live Portal

Portal resmi kejuaraan dunia **FIA Formula 1 World Championship 2026** & **FIM MotoGP World Championship 2026** dengan data realtime asli, jadwal balapan lengkap waktu Indonesia (WIB/WITA/WIT), klasifikasi hasil balapan resmi, grid lineup pembalap foto resmi, dan berita terhangat.

---

## 📱 Fitur Utama & Mobile Responsiveness

- **100% Mobile Responsive:** Dioptimalkan khusus untuk layar smartphone (iPhone, Android), tablet, dan desktop.
- **Mobile Bottom Navigation Bar:** Navigasi bawah modern bergaya aplikasi native olahraga untuk memudahkan navigasi satu tangan di HP.
- **Data Resmi & Otentik 2026:** Standings, podium, dan jadwal balap diambil langsung dari official FIA F1 Jolpica API dan FIM MotoGP Pulselive API.
- **Official Driver Cutouts & Numbers:** Foto pembalap resmi dari `formula1.com/en/drivers` dan `motogp.com/en/riders/motogp`.
- **Hasil Balapan & Klasifikasi Lengkap:** Urutan finis posisi 1 sampai akhir untuk Grand Prix utama dan Sprint Race.
- **Waktu Lokal:** Pilihan zona waktu otomatis (WIB, WITA, WIT, UTC).
- **Vercel Production Ready:** Dilengkapi konfigurasi `vercel.json` dengan URL rewrite & API proxy untuk menghindari CORS.

---

## 🚀 Panduan Deploy ke Vercel

Ada dua cara mudah untuk mendeploy website ini ke Vercel:

### Cara 1: Deploy Otomatis via GitHub (Paling Direkomendasikan)

1. Buat repository baru di akun [GitHub](https://github.com/new) Anda (misalnya beri nama `paddock-hub`).
2. Di terminal folder proyek ini, hubungkan dan push repository ke GitHub:
   ```bash
   git branch -M main
   git remote add origin https://github.com/USERNAME_ANDA/paddock-hub.git
   git push -u origin main
   ```
3. Buka dashboard [Vercel](https://vercel.com).
4. Klik **"Add New..."** -> **"Project"**.
5. Pilih repository `paddock-hub` yang baru saja Anda push.
6. Pengaturan build akan otomatis terdeteksi:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
7. Klik **"Deploy"**. Website Anda akan aktif dalam hitungan detik dan bisa langsung diakses dari browser HP Anda!

---

### Cara 2: Deploy Langsung via Vercel CLI (Tanpa GitHub)

Jika ingin mendeploy langsung dari komputer tanpa perlu push ke GitHub:

1. Buka terminal di folder project:
   ```bash
   npx vercel
   ```
2. Ikuti instruksi login di browser jika belum login ke Vercel.
3. Saat ditanya:
   - `Set up and deploy?` -> Ketik `y`
   - `Which scope?` -> Pilih akun Anda
   - `Link to existing project?` -> Ketik `n`
   - `What's your project's name?` -> Tekan `Enter` (default: `motorsport-hub`)
   - `In which directory is your code located?` -> Tekan `Enter` (`./`)
   - `Want to modify settings?` -> Ketik `n`
4. Untuk deploy ke production domain:
   ```bash
   npx vercel --prod
   ```
5. Salin link domain yang diberikan Vercel (contoh: `https://motorsport-hub-xxxx.vercel.app`) dan buka langsung dari HP Anda!

---

## 🛠️ Pengembangan Lokal

```bash
# Menjalankan development server
npm run dev

# Membangun bundle produksi
npm run build

# Menjalankan preview produksi
npm run preview
```
