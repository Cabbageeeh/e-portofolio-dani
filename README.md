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

## Menjalankan lokal

Dari folder `dist`, jalankan `python -m http.server 8080`, lalu buka http://localhost:8080. Alternatif: gunakan Live Server di editor.

## Publikasi

Folder publik adalah `dist`, tanpa instalasi atau proses build. Dapat dipasang pada Vercel sebagai proyek statis baru (Output Directory: dist). Setiap perubahan isi harus diterbitkan ulang agar terlihat oleh dosen. Font daring memiliki fallback jika koneksi tidak tersedia.

## Mengubah tema

Palet warna dan tipografi utama berada di `dist/theme-navy-sky.css`. Tema terang memakai Navy & Sky; tombol `Tema` mengaktifkan variasi gelap dari palet yang sama. Konten dan identitas portofolio tetap di `dist/content.js`.

Daftar karya pilihan, ringkasan, dan tautan repositori berada di `dist/projects.js`. Visual jadwal pada bagian itu memakai mata pelajaran contoh dan diberi label ilustrasi, bukan data jadwal sekolah.
