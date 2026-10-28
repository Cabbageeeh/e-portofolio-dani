/* EDIT ISI PORTOFOLIO DI SINI. URL berkas lokal: "files/nama-berkas.pdf".
   artefak: {judul, deskripsi, url, jenis, siklus, konteks, tujuan, kelebihan, kekurangan, teori}
   Refleksi dapat memakai paragraf (array teks) dan bagian: [{judul, teks}]. */
window.portfolio = {
  profil: {
    nama: "Muhammad Abduramadani",
    nim: "2500103916225027",
    program: "PPG Prajabatan Informatika 2026",
    kampus: "Universitas Negeri Surabaya",
    foto: "files/dani-portrait.png",
    email: "",
    pengantar: "Selamat datang di portofolio PPG saya. Laman ini menjadi ruang dokumentasi artefak pembelajaran, pengalaman praktik, serta refleksi selama proses pendidikan profesi guru.",
    bio: "Mahasiswa PPG bidang studi Informatika di Universitas Negeri Surabaya. Portofolio ini memuat perjalanan belajar pada Semester 1 dan Semester 2."
  },
  semester: [
    {
      nomor: 1,
      sekolah: "SMA Negeri 15 Surabaya",
      artefak: ["LKPD", "Media Pembelajaran", "Video Pembelajaran", "Modul Ajar", "Penilaian Praktik Mengajar", "Penilaian Penyusunan Perangkat"],
      mataKuliah: ["PPP", "Pengembangan Kebugaran Jasmani", "FPPN", "PMAD", "Growth Mindset", "Literasi Kesehatan Mental"]
    },
    {
      nomor: 2,
      sekolah: "SMP Negeri 60 Surabaya",
      artefak: ["Media Pembelajaran", "Video PPL Terbimbing", "Video PPL Mandiri", "Modul Ajar", "Kegiatan Non Mengajar", "Instrumen Penilaian", "Materi Pembelajaran"],
      mataKuliah: ["Pendidikan Inklusi", "Pembelajaran Sosial Emosional", "PMAL", "PPKPT", "Proyek Kepemimpinan", "SPPG"]
    }
  ],
  // Kunci halaman refleksi mengikuti slug judul mata kuliah pada URL sesudah tanda #.
  isi: {
    "refleksi-s1-ppp": {
      paragraf: ["Mata kuliah Pemahaman tentang Peserta Didik dan Pembelajaran (PPP) mengubah titik berangkat saya: dari berfokus pada materi Informatika menjadi lebih dulu memahami peserta didik yang akan belajar."],
      bagian: [
        { judul: "Connection", teks: "Dengan latar belakang Teknik Informatika murni, saya terbiasa memulai pekerjaan dari materi, logika, dan solusi. PPP menghubungkan pengetahuan bidang studi dengan pertanyaan yang sebelumnya belum selalu saya tempatkan di depan: siapa peserta didik, apa kebutuhan dan potensinya, serta bagaimana ia belajar. Saya menyadari bahwa penguasaan Informatika saja belum cukup untuk membuat pembelajaran bermakna." },
        { judul: "Challenge", teks: "Tantangan saya adalah menggeser fokus dari sekadar menuntaskan materi ke mengenali kemampuan awal, kebutuhan, minat, dan konteks peserta didik. Keragaman tersebut membuat satu cara belajar belum tentu memberi kesempatan yang setara bagi semua. Saya juga perlu belajar mengumpulkan bukti pemahaman sebelum menyimpulkan kemampuan seorang peserta didik." },
        { judul: "Concept", teks: "Saya memahami peserta didik secara holistik—mencakup aspek kognitif, sosial-emosional, moral, fisik, serta latar sosial dan budaya. Pembelajaran yang konstruktif, humanistik, berdiferensiasi, dan adaptif membantu guru merancang pengalaman yang merespons kebutuhan itu. Observasi, asesmen, dan refleksi menjadi dasar untuk mengenali kebutuhan belajar dan memperbaiki pembelajaran." },
        { judul: "Change", teks: "Dalam merancang pembelajaran Informatika, saya akan mulai dengan mempertimbangkan karakteristik dan pengetahuan awal peserta didik. Saya ingin menggunakan contoh yang dekat dengan kehidupan mereka, memberi ruang bagi cara belajar yang beragam, lalu memakai asesmen dan refleksi untuk menyesuaikan dukungan—bukan menyamaratakan proses belajar." }
      ]
    },
    "refleksi-s1-pengembangan-kebugaran-jasmani": {
      paragraf: ["Mata kuliah Pengembangan Kebugaran Jasmani memperluas pemahaman saya bahwa kesiapan belajar dan mengajar juga berkaitan dengan kesehatan serta kebugaran."],
      bagian: [
        { judul: "Connection", teks: "Sebagai calon guru Informatika, perhatian saya sebelumnya lebih sering tertuju pada materi dan penggunaan teknologi. Mata kuliah ini menghubungkan kesejahteraan pribadi guru dengan kualitas kehidupan di sekolah. Saya melihat bahwa kebugaran dan kebiasaan hidup sehat merupakan bagian dari kesiapan saya untuk menjalankan peran pendidik." },
        { judul: "Challenge", teks: "Tantangan bagi saya adalah menjaga kebiasaan sehat secara konsisten di tengah berbagai tanggung jawab, sekaligus memahami bahwa kondisi dan kemampuan fisik setiap orang berbeda. Mengajak peserta didik hidup sehat juga perlu dilakukan dengan cara yang realistis, kontekstual, dan tidak menghakimi." },
        { judul: "Concept", teks: "Saya belajar bahwa kebugaran jasmani dan kesejahteraan personal mendukung guru untuk menjadi teladan serta penggerak budaya hidup sehat di satuan pendidikan. Pembiasaan yang aktif dan lingkungan belajar yang aman serta inklusif dapat mendukung kesehatan warga sekolah, bukan hanya menjadi kegiatan sesaat." },
        { judul: "Change", teks: "Saya ingin lebih sadar menjaga kebugaran diri dan menunjukkan kebiasaan sehat melalui tindakan sehari-hari. Dalam pembelajaran Informatika, saya akan mempertimbangkan jeda aktif atau aktivitas yang sesuai dengan konteks kelas, serta mendukung budaya sekolah sehat tanpa mengabaikan kebutuhan peserta didik yang beragam." }
      ]
    },
    "refleksi-s1-fppn": {
      paragraf: ["Mata kuliah Filosofi Pendidikan dan Pendidikan Nilai (FPPN) membantu saya melihat bahwa pendidikan selalu membawa nilai dan arah, bukan hanya menyampaikan pengetahuan atau keterampilan."],
      bagian: [
        { judul: "Connection", teks: "Latar belakang saya di bidang Informatika membuat saya terbiasa menilai apakah suatu sistem atau solusi berfungsi dengan baik. FPPN memperluas cara pandang itu: guru juga bertanggung jawab membimbing manusia, menumbuhkan nilai, dan mengambil keputusan yang bermakna bagi kehidupan bersama." },
        { judul: "Challenge", teks: "Tantangan saya adalah menerjemahkan filosofi pendidikan dan pendidikan nilai ke dalam pilihan serta tindakan pembelajaran sehari-hari, bukan berhenti pada slogan. Saya perlu konsisten menghargai keberagaman, bersikap etis, dan memberi teladan, terutama ketika membahas teknologi yang dampaknya dekat dengan kehidupan peserta didik." },
        { judul: "Concept", teks: "Saya memahami filosofi pendidikan sebagai landasan untuk menentukan tujuan, sikap, dan cara mendidik. Nilai kebangsaan, moral, etika, kepemimpinan, serta semangat belajar sepanjang hayat perlu tampak dalam hubungan guru dengan peserta didik dan dalam pengalaman belajar yang dirancang." },
        { judul: "Change", teks: "Saya akan mengaitkan pembelajaran Informatika dengan tanggung jawab dan etika digital, seperti menghargai karya, menjaga privasi, dan berkomunikasi dengan santun. Saya juga ingin menimbang apakah keputusan mengajar saya memanusiakan peserta didik dan memberi teladan atas nilai yang saya sampaikan." }
      ]
    },
    "refleksi-s1-pmad": {
      paragraf: ["Pembelajaran Mendalam dan Asesmen Dasar (PMAD) menggeser perhatian saya dari sekadar hasil akhir tugas menuju proses belajar yang bermakna, kontekstual, dan berpusat pada peserta didik."],
      bagian: [
        { judul: "Connection", teks: "Dalam Informatika, saya akrab dengan masalah, langkah penyelesaian, dan keluaran yang dapat diperiksa. PMAD menghubungkan pola pikir tersebut dengan pembelajaran mendalam: peserta didik perlu memahami alasan di balik suatu konsep dan menggunakannya pada konteks yang bermakna, bukan hanya memperoleh jawaban benar." },
        { judul: "Challenge", teks: "Tantangan saya adalah merancang aktivitas yang mendorong peserta didik berpikir lebih dalam sekaligus menyiapkan asesmen yang sesuai dengan tujuan. Saya perlu melihat proses dan pemahaman mereka, bukan hanya produk akhir, serta menggunakan bukti belajar untuk menentukan dukungan berikutnya." },
        { judul: "Concept", teks: "Saya memahami pentingnya menyelaraskan tujuan pembelajaran, aktivitas, dan asesmen. Pembelajaran mendalam menempatkan pemahaman yang bermakna dan kontekstual sebagai tujuan, sedangkan asesmen membantu melihat perkembangan belajar dan memberi dasar untuk memperbaiki rancangan pembelajaran." },
        { judul: "Change", teks: "Saat menyusun pembelajaran Informatika, saya akan merumuskan tujuan dengan jelas, memilih masalah yang relevan, dan menilai proses maupun hasil belajar sesuai tujuan tersebut. Hasil asesmen akan saya gunakan untuk memberi umpan balik dan menyesuaikan kegiatan, bukan hanya sebagai angka akhir." }
      ]
    },
    "refleksi-s1-growth-mindset": {
      paragraf: ["Mata kuliah Growth Mindset—pola pikir bertumbuh dalam pembelajaran—menguatkan keyakinan saya bahwa kompetensi pedagogik dapat berkembang melalui strategi, latihan, umpan balik, dan refleksi."],
      bagian: [
        { judul: "Connection", teks: "Ketika memulai PPG dari latar belakang Informatika murni, banyak konsep pedagogik terasa baru bagi saya. Pengalaman belajar ini membuat gagasan pola pikir bertumbuh terasa dekat: belum memahami sesuatu bukan berarti tidak mampu mempelajarinya. Hal yang sama berlaku bagi peserta didik saat menghadapi konsep Informatika yang menantang." },
        { judul: "Challenge", teks: "Tantangan saya adalah tidak menyederhanakan growth mindset menjadi pesan ‘terus berusaha’ saja. Peserta didik juga perlu strategi yang tepat, kesempatan mencoba, umpan balik yang membantu, dan dukungan ketika menghadapi kesulitan. Saya perlu memberi apresiasi pada proses tanpa mengabaikan kebutuhan akan arahan yang konkret." },
        { judul: "Concept", teks: "Saya memahami bahwa pola pikir bertumbuh berkaitan dengan keyakinan bahwa kemampuan dapat dikembangkan. Strategi belajar, refleksi, ketekunan, dan umpan balik yang membangun membantu proses itu. Guru berperan sebagai fasilitator yang menciptakan iklim kelas agar kesalahan dapat dipakai sebagai informasi untuk belajar." },
        { judul: "Change", teks: "Saya akan membiasakan diri merefleksikan dan memperbaiki rancangan mengajar, serta menerima umpan balik sebagai bagian dari pengembangan diri. Kepada peserta didik, saya ingin memberi komentar yang spesifik tentang strategi dan kemajuan mereka, lalu membantu menentukan langkah berikutnya ketika mereka menemui kesulitan." }
      ]
    },
    "refleksi-s1-literasi-kesehatan-mental": {
      paragraf: ["Literasi Kesehatan Mental mengingatkan saya bahwa guru perlu membantu membangun ruang belajar yang mendukung kesejahteraan, sekaligus memahami batas perannya."],
      bagian: [
        { judul: "Connection", teks: "Dalam pembelajaran Informatika, peserta didik diharapkan berani mencoba, bertanya, dan menunjukkan proses berpikirnya. Saya menghubungkan hal itu dengan pentingnya kesehatan mental: rasa aman dan dukungan dapat membantu peserta didik terlibat dalam belajar. Guru juga perlu menjaga kesejahteraan dirinya agar dapat hadir secara utuh bagi kelas." },
        { judul: "Challenge", teks: "Tantangan saya adalah mengenali miskonsepsi dan stigma tanpa menyederhanakan kondisi seseorang. Sebagai calon guru, saya perlu merespons dengan empati, tetapi juga memahami bahwa peran guru bukan mendiagnosis atau menggantikan tenaga profesional. Mengetahui kapan dan ke mana meminta bantuan merupakan bagian dari tanggung jawab." },
        { judul: "Concept", teks: "Materi ini mengajak saya membedakan kesehatan mental dan gangguan mental, mengkaji stigma, serta memahami cara mencari dan memberi dukungan secara positif. Kesehatan mental juga berkaitan dengan pemeliharaan diri dan lingkungan belajar yang membuat warga sekolah merasa dihargai serta aman untuk meminta bantuan." },
        { judul: "Change", teks: "Saya akan berusaha memakai bahasa yang menghargai, mendengarkan tanpa menghakimi, dan ikut membangun suasana kelas yang aman. Saya juga akan menjaga kebiasaan perawatan diri serta mengarahkan peserta didik kepada pihak yang tepat apabila kebutuhan dukungannya melampaui kapasitas saya sebagai guru." }
      ]
    },
    "model-guru": { paragraf: [] },
    "refleksi-akhir-praktik": { paragraf: [] },
    "filosofi-mengajar": { paragraf: [] },
    "rencana-tindak-lanjut": { paragraf: [] },
    "harapan-pendidikan-indonesia": { paragraf: [] },
    "upaya-menjadi-guru-yang-profesional": { paragraf: [] }
  }
};
