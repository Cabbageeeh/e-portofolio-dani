/* EDIT ISI PORTOFOLIO DI SINI. URL berkas lokal: "files/nama-berkas.pdf".
   artefak: {judul, deskripsi, url, jenis, siklus, konteks, tujuan, kelebihan, kekurangan, teori}
   Isi halaman refleksi melalui properti paragraf (array teks). */
window.portfolio = {
  profil: {nama:"Muhammad Abduramadani", nim:"2500103916225027", program:"PPG Prajabatan Informatika 2025", kampus:"Universitas Negeri Surabaya", foto:"files/dani-portrait.png", email:"", pengantar:"Selamat datang di portofolio PPG saya. Laman ini menjadi ruang dokumentasi artefak pembelajaran, pengalaman praktik, serta refleksi selama proses pendidikan profesi guru.", bio:"Mahasiswa PPG bidang studi Informatika di Universitas Negeri Surabaya. Portofolio ini memuat perjalanan belajar pada Semester 1 dan Semester 2."},
  semester: [{nomor:1,sekolah:"SMA Negeri 15 Surabaya",artefak:["LKPD","Media Pembelajaran","Video Pembelajaran","Modul Ajar","Penilaian Praktik Mengajar","Penilaian Penyusunan Perangkat"],mataKuliah:["PPP","Kebugaran Jasmani","PMAD","FPPN","Growth Mindset","Kesehatan Mental"]},{nomor:2,sekolah:"SMP Negeri 60 Surabaya",artefak:["Media Pembelajaran","Video PPL Terbimbing","Video PPL Mandiri","Modul Ajar","Kegiatan Non Mengajar","Instrumen Penilaian","Materi Pembelajaran"],mataKuliah:["Pendidikan Inklusi","Pembelajaran Sosial Emosional","PMAL","PPKPT","Proyek Kepemimpinan","SPPG"]}],
  // Kunci kategori dapat dilihat pada URL setelah tanda # saat membuka halaman.
  // Contoh: "s2-modul-ajar": {artefak:[{judul:"Modul siklus 2",url:"files/modul.pdf",jenis:"PDF",siklus:"2",konteks:"...",tujuan:"...",kelebihan:"...",kekurangan:"...",teori:"..."}]}
  isi: {
    "model-guru": {paragraf:[]}, "refleksi-akhir-praktik": {paragraf:[]}, "filosofi-mengajar": {paragraf:[]}, "rencana-tindak-lanjut": {paragraf:[]}, "harapan-pendidikan-indonesia": {paragraf:[]}, "upaya-menjadi-guru-yang-profesional": {paragraf:[]}
  }
};
