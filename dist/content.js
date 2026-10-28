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
      mataKuliah: ["Pendidikan Inklusi", "Pembelajaran Sosial Emosional", "PMAL", "PPKPT", "Proyek Kepemimpinan", "Seminar PPG"]
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
    "refleksi-s2-pendidikan-inklusi": {
      paragraf: ["Pendidikan Inklusi mengajak saya melihat keberagaman kebutuhan peserta didik sebagai titik awal merancang pembelajaran yang memberi kesempatan belajar bagi semua."],
      bagian: [
        { judul: "Connection", teks: "Latar belakang saya di Teknik Informatika murni membiasakan saya mencari solusi yang terstruktur. Di PPG, saya belajar bahwa solusi pembelajaran perlu mempertimbangkan siapa yang akan menggunakannya. Pendidikan Inklusi menghubungkan cara berpikir itu dengan kebutuhan untuk mengenali karakteristik, potensi, dan hambatan belajar setiap peserta didik." },
        { judul: "Challenge", teks: "Tantangan saya adalah tidak menganggap satu strategi, media, atau bentuk penilaian akan cocok bagi semua peserta didik. Saya perlu belajar mengidentifikasi kebutuhan secara cermat, merancang akomodasi yang relevan, dan mengevaluasi apakah dukungan yang diberikan benar-benar membantu keterlibatan serta perkembangan belajar." },
        { judul: "Concept", teks: "Saya memahami bahwa pendidikan inklusif mencakup pengenalan kebutuhan peserta didik, perencanaan dan pelaksanaan pembelajaran akomodatif, serta evaluasi dukungannya. Inklusi bukan sekadar menempatkan semua peserta didik di ruang yang sama, melainkan menata lingkungan dan pengalaman belajar agar setiap orang dapat berpartisipasi." },
        { judul: "Change", teks: "Saya akan memeriksa aksesibilitas materi, instruksi, aktivitas, dan asesmen saat merancang pembelajaran Informatika. Saya ingin menyediakan pilihan cara mengakses materi dan menunjukkan pemahaman, serta menggunakan pengamatan dan umpan balik untuk memperbaiki dukungan tanpa memberi label atau menurunkan harapan belajar." }
      ]
    },
    "refleksi-s2-pembelajaran-sosial-emosional": {
      paragraf: ["Pembelajaran Sosial Emosional memperluas pemahaman saya bahwa proses belajar juga dibentuk oleh kesadaran diri, hubungan yang sehat, dan rasa aman di kelas."],
      bagian: [
        { judul: "Connection", teks: "Saya sebelumnya banyak memikirkan bagaimana menjelaskan konsep Informatika dan menyusun langkah kerja. Mata kuliah ini mengingatkan saya bahwa peserta didik belajar bersama orang lain dengan perasaan, kebutuhan, dan pengalaman yang berbeda. Relasi guru dengan peserta didik menjadi bagian penting dari suasana belajar." },
        { judul: "Challenge", teks: "Tantangan saya adalah menjaga respons yang tenang dan empatik ketika muncul perbedaan pendapat, kesulitan, atau perilaku yang mengganggu proses belajar. Saya juga perlu memastikan pembelajaran sosial emosional tidak berhenti sebagai nasihat, tetapi hadir konsisten dalam cara berkomunikasi, bekerja sama, dan menyelesaikan masalah." },
        { judul: "Concept", teks: "Saya memahami bahwa pembelajaran sosial emosional membantu peserta didik mengenali dan mengelola emosi, memahami orang lain, membangun hubungan positif, serta mengambil keputusan yang bertanggung jawab. Keterampilan tersebut mendukung keterlibatan belajar dan perlu ditumbuhkan melalui budaya kelas yang menghargai semua pihak." },
        { judul: "Change", teks: "Saya akan membangun kesepakatan kelas, memberi ruang untuk mendengarkan dan bekerja sama, serta menggunakan bahasa yang menghargai. Dalam kegiatan Informatika, seperti diskusi atau proyek kelompok, saya ingin memberi perhatian pada proses komunikasi dan kontribusi anggota, bukan hanya hasil akhirnya." }
      ]
    },
    "refleksi-s2-pmal": {
      paragraf: ["Pembelajaran Mendalam dan Asesmen Lanjut (PMAL) membantu saya menghubungkan tujuan belajar, kebutuhan peserta didik, konteks kelas, dan bukti asesmen ke dalam rancangan pembelajaran yang lebih adaptif."],
      bagian: [
        { judul: "Connection", teks: "Di bidang Informatika, saya terbiasa memecah persoalan menjadi bagian-bagian yang dapat dianalisis. PMAL menghubungkan kebiasaan itu dengan keputusan pedagogis: data dan konteks belajar perlu dibaca untuk menentukan pengalaman belajar yang tepat, bukan hanya untuk mencatat nilai." },
        { judul: "Challenge", teks: "Tantangan saya adalah menerjemahkan hasil asesmen menjadi tindak lanjut yang sesuai, terutama ketika kesiapan dan kebutuhan peserta didik beragam. Saya perlu menjaga agar aktivitas tetap menantang, tetapi dapat dijangkau, serta tidak menyamakan kedalaman belajar dengan banyaknya materi atau tugas." },
        { judul: "Concept", teks: "Saya belajar mempertimbangkan tiga kerangka dalam merancang pembelajaran: Universal Design for Learning (UDL), Teaching at the Right Level (TaRL), dan Culturally Responsive Teaching (CRT). Data asesmen, kebutuhan belajar, dan konteks budaya membantu guru menentukan strategi yang adaptif, inklusif, dan berpihak pada murid." },
        { judul: "Change", teks: "Saya akan menggunakan bukti asesmen untuk mengenali pemahaman awal, menentukan variasi dukungan dan tantangan, lalu memeriksa kembali dampaknya. Dalam Informatika, saya ingin memberi pilihan representasi atau cara menyelesaikan masalah sambil menjaga tujuan belajar tetap jelas bagi semua peserta didik." }
      ]
    },
    "refleksi-s2-ppkpt": {
      paragraf: ["Pencegahan dan Penanganan Kekerasan di Lingkungan Pendidikan (PPKPT) menegaskan bahwa rasa aman dan dihargai merupakan prasyarat agar peserta didik dapat belajar dan berkembang."],
      bagian: [
        { judul: "Connection", teks: "Pembelajaran Informatika sering melibatkan diskusi, kerja kelompok, dan penggunaan ruang digital. Saya menghubungkan hal itu dengan tanggung jawab guru untuk memastikan interaksi berlangsung dengan aman, menghormati martabat peserta didik, dan tidak membiarkan kekerasan maupun perundungan dianggap sebagai hal biasa." },
        { judul: "Challenge", teks: "Tantangan saya adalah peka terhadap tanda-tanda situasi yang tidak aman dan merespons laporan secara tenang serta berpihak pada keselamatan peserta didik. Niat baik saja tidak cukup; saya perlu memahami batas peran, menghindari menyalahkan korban, menjaga kerahasiaan secara bertanggung jawab, dan mengikuti mekanisme penanganan yang berlaku di satuan pendidikan." },
        { judul: "Concept", teks: "Saya memahami pentingnya mengenali urgensi lingkungan pendidikan yang aman dan menyenangkan, memahami bentuk serta cakupan kekerasan, dan mengetahui prinsip pencegahan serta penanganannya. Pencegahan juga tumbuh dari budaya sekolah yang menghormati batas, membangun relasi sehat, dan menyediakan jalur bantuan yang jelas." },
        { judul: "Change", teks: "Saya akan menyepakati aturan interaksi yang saling menghormati, termasuk saat peserta didik berkomunikasi di ruang digital. Jika menemukan dugaan kekerasan, saya akan mendengarkan dengan empati, mengutamakan keselamatan, mencatat informasi seperlunya, dan menghubungi pihak atau mekanisme resmi sekolah sesuai prosedur." }
      ]
    },
    "refleksi-s2-proyek-kepemimpinan": {
      paragraf: ["Proyek Kepemimpinan memberi ruang untuk belajar bahwa kepemimpinan pendidikan tumbuh lewat kerja kolaboratif: memahami masalah, menyusun inisiatif, dan mengupayakan solusi yang bermakna."],
      bagian: [
        { judul: "Connection", teks: "Pengalaman mengembangkan SIGAP bersama kelompok menghubungkan kemampuan teknis saya dengan kebutuhan untuk bekerja bersama orang lain. Saya melihat bahwa sebuah proyek pendidikan tidak hanya membutuhkan perangkat yang berfungsi, tetapi juga pemahaman masalah, tujuan bersama, komunikasi, dan pertimbangan terhadap orang yang akan menggunakannya." },
        { judul: "Challenge", teks: "Tantangan dalam proyek kolaboratif adalah menyatukan sudut pandang, membagi tanggung jawab dengan jelas, dan menjaga agar solusi tetap berangkat dari kebutuhan nyata. Saya juga belajar bahwa gagasan yang menarik perlu diuji dan diperbaiki, bukan hanya diselesaikan dari sisi teknis." },
        { judul: "Concept", teks: "Saya memahami kepemimpinan sebagai proses mengajak tim bergerak menuju tujuan yang bermanfaat. Pengalaman berbasis proyek melatih perencanaan, kolaborasi, komunikasi, pengambilan keputusan, dan pemecahan masalah dalam konteks nyata. Keberhasilan inisiatif perlu dilihat dari relevansi solusi dan proses belajar bersama." },
        { judul: "Change", teks: "Pada proyek berikutnya, saya ingin lebih awal mendengarkan calon pengguna, menyepakati ukuran keberhasilan, dan membagi peran berdasarkan kekuatan anggota. Saya juga akan menyediakan waktu untuk meminta masukan, menguji solusi, dan mendokumentasikan perubahan agar keputusan tim dapat dipertanggungjawabkan." }
      ]
    },
    "refleksi-s2-seminar-ppg": {
      paragraf: ["Seminar PPG menjadi ruang untuk menyatukan pengalaman belajar, praktik, dan karya ke dalam refleksi yang dapat dijelaskan serta ditinjau kembali."],
      bagian: [
        { judul: "Connection", teks: "Saya menghubungkan seminar dengan perjalanan saya dari latar Teknik Informatika murni menuju peran calon guru. Selama PPG, saya belajar banyak konsep pedagogik yang sebelumnya belum menjadi bagian dari pendidikan awal saya. Portofolio digital ini membantu menautkan pembelajaran, praktik, dan karya sebagai bukti perkembangan tersebut." },
        { judul: "Challenge", teks: "Tantangan saya adalah menyampaikan proses dan alasan di balik sebuah karya secara ringkas, runtut, dan didukung bukti. Saya perlu membedakan antara menjelaskan apa yang dibuat dan menganalisis mengapa pilihan pembelajaran dibuat, apa yang dipelajari, serta bagian mana yang masih perlu diperbaiki." },
        { judul: "Concept", teks: "Saya memahami seminar sebagai kegiatan akademik yang menuntut refleksi berbasis data, komunikasi yang efektif, dan keterbukaan terhadap tanggapan. Dokumentasi portofolio, partisipasi, dan pemaparan karya dapat menjadi kesempatan untuk menguji pemahaman dan menghubungkan pengalaman praktik dengan gagasan yang dipelajari." },
        { judul: "Change", teks: "Saya akan menyiapkan pemaparan dengan menyertakan konteks, tujuan, bukti proses, analisis, dan refleksi. Saya ingin menggunakan pertanyaan serta masukan dari dosen dan rekan sebagai bahan untuk memperbaiki karya dan rancangan pembelajaran, bukan sekadar sebagai penilaian atas hasil akhir." }
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
