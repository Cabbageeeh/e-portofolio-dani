# Portofolio PPG Dani

Website statis tanpa login. Isi diedit di `dist/content.js`; tampilan di `dist/styles.css`.

## Mengisi portofolio

1. Ubah identitas, pengantar, bio, email, dan foto di `profil`. Foto dapat diisi `files/foto.jpg`.
2. Simpan PDF/foto di `dist/files/`. Untuk video, gunakan tautan YouTube/Drive yang dapat dibuka dosen.
3. Buka kategori situs dan salin bagian URL sesudah `#` sebagai kunci pada `isi`.
4. Contoh menambahkan artefak:

```js
"s2-modul-ajar": {
  artefak: [{
    judul: "Modul ajar praktik mandiri siklus 2",
    jenis: "PDF", siklus: "2", url: "files/modul-siklus-2.pdf",
    deskripsi: "Ringkasan modul pembelajaran.",
    konteks: "Kelas, karakteristik peserta didik, dan kondisi pembelajaran.",
    tujuan: "Tujuan pembelajaran yang ditetapkan.",
    kelebihan: "Kelebihan berdasarkan pelaksanaan.",
    kekurangan: "Kendala serta perbaikan yang direncanakan.",
    teori: "Teori mata kuliah dan hubungannya dengan praktik."
  }]
},
"refleksi-s2-pendidikan-inklusi": {
  paragraf: ["Paragraf refleksi pertama.", "Paragraf berikutnya."],
  bagian: [{judul: "Rencana tindak lanjut", teks: "Langkah pengembangan diri."}]
}
```

Pertahankan tanda kutip, koma, dan kurung JavaScript. Jangan masukkan pengalaman atau hasil penilaian yang belum ada. Lengkapi siklus 2–4 dan video praktik sesuai petunjuk tugas. Materi belum diisi ditampilkan sebagai belum ditambahkan.

## Animasi dan sumber

Enam pola animasi MasRama diadaptasi untuk portofolio pendidikan: film jadwal interaktif, gulungan judul karya, tahapan penelusuran, simulasi ketahanan sistem digital, peta karya, dan garis waktu dua semester. Kode sumbernya tersedia di `animation-src/`; lisensi MIT dan atribusinya tercantum di `THIRD-PARTY-NOTICES.md`. Paletnya disesuaikan ke Navy & Sky. Adegan yang bersifat konsep ditandai sebagai ilustrasi, bukan klaim tentang fitur atau status proyek.

Setelah mengubah source animasi, jalankan `npm install` lalu `npm run build`. Berkas statis hasilnya dibuat di `dist/portfolio-animations.js` dan `dist/portfolio-animations.css`. `vercel.json` memakai `dist` sebagai output directory.

Animasi menghormati pengaturan reduced motion perangkat. Film jadwal dan simulasi sistem dapat dijeda serta dilompati per bab, papan karya berhenti saat penunjuk diarahkan ke sana, kartu proses muncul bertahap, peta karya dapat dipilih, dan garis waktu dapat diputar ulang dari tiap karya. Kartu karya juga memiliki efek tilt ringan pada perangkat dengan pointer.

## Menjalankan lokal

Dari folder `dist`, jalankan `python -m http.server 8080`, lalu buka http://localhost:8080. Alternatif: gunakan Live Server di editor.

## Publikasi

Folder publik adalah `dist`, tanpa instalasi atau proses build. Dapat dipasang pada Vercel sebagai proyek statis baru (Output Directory: dist). Setiap perubahan isi harus diterbitkan ulang agar terlihat oleh dosen. Font daring memiliki fallback jika koneksi tidak tersedia.

## Mengubah tema

Palet warna dan tipografi utama berada di `dist/theme-navy-sky.css`. Tema terang memakai Navy & Sky; tombol `Tema` mengaktifkan variasi gelap dari palet yang sama. Konten dan identitas portofolio tetap di `dist/content.js`.

Daftar karya pilihan, ringkasan, dan tautan repositori berada di `dist/projects.js`. Simulasi jadwal memakai data contoh dan diberi label ilustrasi, bukan jadwal aktual sekolah.

Gerakan masuk yang halus untuk bagian halaman diatur oleh `dist/motion.css` dan `dist/motion.js`. Animasi mengikuti pengaturan reduced motion pada perangkat pengunjung.
