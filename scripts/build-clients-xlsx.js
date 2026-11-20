/**
 * Generator clients/info_client.xlsx — XLSX murni tanpa dependency.
 * ------------------------------------------------------------------
 * Environment tidak punya Python/openpyxl maupun paket xlsx, jadi file
 * Office Open XML disusun manual lalu dibungkus ZIP (method: stored).
 *
 * Sumber data: hasil pencarian publik Google Maps (place URLs di bawah)
 * + situs resmi usaha untuk email. Data kontak adalah data publik usaha;
 * tetap lakukan verifikasi sebelum menghubungi.
 *
 * Jalankan: node scripts/build-clients-xlsx.js
 */
const fs = require("fs")
const path = require("path")
const zlib = require("zlib")

const OUT = path.resolve(__dirname, "..", "clients", "info_client.xlsx")

// Kolom: No, Nama Usaha, Bidang/Industri, Area, Produk Cocok, Alamat,
// Telepon/WhatsApp, Email, Website/IG, Sumber, Prioritas, Catatan
const ROWS = [
  ["RS Grha Permata Ibu", "Rumah sakit swasta", "Depok", "SIMRS", "Jl. K.H.M. Usman No.168, Kukusan, Beji, Depok", "+62 21 7778899", "-", "grhapermataibu.com", "https://www.google.com/maps/place?q=place_id:ChIJK-i_GKbuaS4R7OgYAVM4qHI", "Tinggi", "RS besar dengan 3.800+ ulasan; butuh RME & integrasi BPJS"],
  ["RS Puri Cinere", "Rumah sakit swasta", "Depok", "SIMRS", "Jl. Maribaya No.1, Pangkalan Jati, Cinere, Depok", "+62 21 7545488", "-", "rspuricinere.id", "https://www.google.com/maps/place?q=place_id:ChIJHWe8DkjuaS4RQi0gDy8dkow", "Tinggi", "2.100+ ulasan; kandidat SIMRS & website"],
  ["RS Tugu Ibu", "Rumah sakit umum", "Depok", "SIMRS", "Jl. Raya Jakarta-Bogor KM 29, Mekarsari, Cimanggis, Depok", "+62 21 8710870", "-", "rstuguibu.com", "https://www.google.com/maps/place?q=place_id:ChIJhwYifazraS4RnJcAyKACfKY", "Tinggi", "2.100+ ulasan; sistem pendaftaran & farmasi"],
  ["RS Simpangan Depok", "Rumah sakit swasta", "Depok", "SIMRS", "Jl. Raya Jakarta-Bogor No.36, Sukamaju, Cilodong, Depok", "+62 21 8741549", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJIxzP_KbraS4RQlFTVyPd4Y0", "Menengah", "1.500+ ulasan; perlu verifikasi email"],
  ["RS Islam PKU Muhammadiyah Depok", "Rumah sakit Islam", "Depok", "SIMRS", "Jl. H. Sulaeman, Bedahan, Sawangan, Depok", "+62 817-845-930", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJ53Hw0BPpaS4RvGqjChWmU5c", "Menengah", "Nomor seluler — kemungkinan WA"],
  ["RS Syar'i", "Rumah sakit spesialis", "Depok", "SIMRS", "Jl. Caringin Gg. Belimbing, Rangkapan Jaya, Pancoran Mas, Depok", "+62 895-2204-9597", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJZ7BuRj_paS4RFfL69ucMZG0", "Menengah", "Nomor seluler — kemungkinan WA"],
  ["RS Tiara Bekasi", "Rumah sakit swasta", "Bekasi", "SIMRS", "Jl. Raya Babelan No.63, Kebalen, Babelan, Bekasi", "+62 821-2330-1690", "-", "tiarabekasi.com", "https://www.google.com/maps/place?q=place_id:ChIJc2B0K6mJaS4ROHlybfQU9as", "Tinggi", "2.500+ ulasan; keluhan jadwal dokter → cocok untuk modul jadwal"],
  ["RS Paramedika Bekasi", "Rumah sakit swasta", "Bekasi", "SIMRS", "Jl. Raya Kaliabang Tengah, Pejuang, Medan Satria, Bekasi", "+62 811-1915-1555", "-", "rsparamedika.com", "https://www.google.com/maps/place?q=place_id:ChIJgX096muLaS4ReuqOxK8mmh4", "Tinggi", "Nomor seluler — kemungkinan WA"],
  ["RS Annisa Cikarang", "Rumah sakit umum", "Bekasi", "SIMRS", "Jl. Raya Lemahabang No.31, Simpangan, Cikarang Utara, Bekasi", "+62 896-8539-3749", "-", "rsannisacikarang.com", "https://www.google.com/maps/place?q=place_id:ChIJtcfOwriEaS4RzutxoyeLGpk", "Tinggi", "4.300+ ulasan; prioritas utama SIMRS"],
  ["RS Umum Puspa Husada", "Rumah sakit umum", "Bekasi", "SIMRS", "Jl. Pondok Timur Indah No.27, Jatimulya, Tambun Selatan, Bekasi", "+62 821-3003-9902", "-", "puspahusada.com", "https://www.google.com/maps/place?q=place_id:ChIJy9YoiBGOaS4R34Id48N_6f0", "Tinggi", "880+ ulasan"],
  ["RS Mekar Sari", "Rumah sakit swasta", "Bekasi", "SIMRS", "Jl. Mekar Sari No.1, Bekasi Jaya, Bekasi Timur", "+62 822-8888-6236", "-", "rsmekarsari.com", "https://www.google.com/maps/place?q=place_id:ChIJJbENY0CPaS4R1TsLvhPjoRo", "Menengah", "Fokus vaksin & MCU; cocok modul pendaftaran"],
  ["Klinik Utama Cakra Medika", "Klinik & MCU", "Bekasi", "SIMRS", "Jl. Inspeksi Kalimalang No.27 Blok D25, Jatimulya, Tambun Selatan, Bekasi", "+62 813-1464-9409", "-", "cakramedika.co.id", "https://www.google.com/maps/place?q=place_id:ChIJ40xRiGWOaS4RczgyvQ4jI0w", "Tinggi", "1.000+ ulasan; antrean MCU panjang → sistem antrean"],
  ["Klinik Mata SMEC Bekasi", "Klinik mata", "Bekasi", "SIMRS", "Jl. Sultan Agung No.1-3, Medan Satria, Bekasi", "+62 804 122 7788", "-", "rsmatasmec.com", "https://www.google.com/maps/place?q=place_id:ChIJ9WIEDpGLaS4RC1nAkXxrx5w", "Menengah", "Sudah ada registrasi online; peluang integrasi"],
  ["Klinik Pratama Alobelo", "Klinik umum 24 jam", "Bekasi", "SIMRS", "Jl. Kaliabang Bungur, Pejuang, Medan Satria, Bekasi", "+62 812-9738-8013", "-", "instagram.com/alobelo_bekasi", "https://www.google.com/maps/place?q=place_id:ChIJz0ps4LGLaS4RiRLrtG6EP3M", "Menengah", "Nomor seluler — kemungkinan WA"],
  ["Klinik Rayyan Medika", "Klinik umum", "Jakarta Selatan", "SIMRS", "Jl. Raya Lenteng Agung Blok Masjid No.50, Jagakarsa, Jakarta Selatan", "+62 822-2422-4975", "-", "rayyanmedika.com", "https://www.google.com/maps/place?q=place_id:ChIJB43aTgDtaS4RCTLPkhXlszw", "Menengah", "Beberapa layanan (lab, kebidanan) → modul terintegrasi"],
  ["Jakarta Men Clinic", "Klinik kesehatan pria", "Jakarta Selatan", "SIMRS + Website", "Jl. Gandaria 1 No.10, Kramat Pela, Kebayoran Baru, Jakarta Selatan", "+62 818-0660-0888", "jakartamenclinic@gmail.com", "jakartamenclinic.com", "https://jakartamenclinic.com/", "Tinggi", "Email & WA eksplisit di situs resmi"],
  ["Klinik Lantana Medika", "Klinik umum", "Jakarta Selatan", "SIMRS", "Jl. Mampang Prapatan No.19a, Mampang Prapatan, Jakarta Selatan", "0811-8787-499", "-", "-", "https://aido.id/health-articles/tinggal-di-daerah-jakarta-selatan-kunjungi-beberapa-pilihan-klinik-terdekat-ini/detail", "Menengah", "WA tercantum di artikel direktori; verifikasi dulu"],
  ["Digitalindo Academy", "Pusat pelatihan digital", "Depok", "LMS + CMS", "Ruko Mitra Niaga, Jl. Raya Abdul Gani No.5, Jatimulya, Cilodong, Depok", "0813-1982-2025 / 0821-2166-0559", "Digitalindoacademy@gmail.com", "digitalindoacademy.com", "https://digitalindoacademy.com/", "Tinggi", "Butuh LMS untuk kelas & sertifikasi"],
  ["Ashhab Edu", "Lembaga kursus & training", "Depok", "LMS", "Jl. Mangga, Kecamatan Beji, Depok", "0851-9933-1679", "info@ashhabedu.com", "ashhabedu.com", "https://ashhabedu.com/", "Tinggi", "WA & email eksplisit; kelas online + onsite"],
  ["Accalls Training Center", "Pelatihan teknisi & sertifikasi", "Depok", "LMS + EMS", "Jl. Delima Raya No.139, Perumnas Depok 1, Pancoran Mas, Depok", "0813-1726-6950", "accalls.indonesia@gmail.com", "accalls.id", "https://accalls.id/", "Tinggi", "Pendaftaran kursus & sertifikat"],
  ["Kursusmart (LKP)", "Kursus bahasa Inggris", "Depok", "LMS", "Jl. Madrasah No.47, Limo, Depok", "+62 858-9400-4342", "-", "kursusmart.com", "https://www.google.com/maps/place?q=place_id:ChIJs0vHU0DuaS4RX40g9fY55vQ", "Tinggi", "Rating 4.9; 30 ulasan"],
  ["LPIA Margonda", "Kursus komputer & bahasa", "Depok", "LMS + CMS", "Jl. Margonda Raya No.91C, Pancoran Mas, Depok", "0851-0271-1743", "-", "lpiamargondadepokraya.blogspot.com", "http://lpiamargondadepokraya.blogspot.com/", "Menengah", "WA tercantum di blog lama — verifikasi"],
  ["Pusilkom UI", "Pusat pelatihan & sistem informasi", "Depok / Jakarta Pusat", "LMS", "Gedung C Fasilkom UI, Kampus UI Depok / Jl. Salemba Raya No.4", "0856-9530-5057", "training-pusilkom@cs.ui.ac.id", "pusilkom.ui.ac.id", "https://pusilkom.ui.ac.id/", "Menengah", "Sudah pakai Moodle; peluang integrasi/ penggembangan"],
  ["Pondok Pesantren Darussa'adah", "Pondok pesantren", "Bogor", "LMS + Website", "Jl. Alternatif Sentul No.38, Cijujung, Sukaraja, Bogor", "+62 858-1396-3483", "-", "darussaadah.ponpes.id", "https://www.google.com/maps/place?q=place_id:ChIJp30N0D_BaS4R0BeDYMVq7hA", "Menengah", "Nomor seluler — kemungkinan WA"],
  ["Pondok Pesantren Nurul Yatama", "Pondok pesantren", "Bogor", "LMS + Website", "Jl. Permata Sari No.2 Blok D, Tonjong, Tajur Halang, Bogor", "+62 856-9518-7694", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJ8fKbb0PDaS4RkHkQrwDqgag", "Menengah", "Rating 5.0"],
  ["Pondok Pesantren Siba Al Wahid", "Pondok pesantren", "Bogor", "LMS + Website", "Jl. Jampang Pulo, Jampang, Kemang, Bogor", "+62 857-9721-3488", "-", "alhikmahbogor.org", "https://www.google.com/maps/place?q=place_id:ChIJ67JSOBHDaS4Rw-TDVbHZA5g", "Menengah", "Rating 4.8"],
  ["Pondok Pesantren Tahfidz Anwar Syarif", "Pondok pesantren tahfidz", "Bogor", "LMS + Website", "Jl. Kp. Sawah, Sukawening, Dramaga, Bogor", "+62 812-9373-9151", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJzSDteNrFaS4Rya1Zcpz_7qM", "Menengah", "Nomor seluler — kemungkinan WA"],
  ["ArsenEO Event Organizer", "Event organizer", "Jakarta Barat", "EMS", "Perumahan Budi Indah No.8, Kalideres, Jakarta Barat", "+62 818-0321-1168", "-", "arseneo.com", "https://www.google.com/maps/place?q=place_id:ChIJUQj57375aS4RVoXc6z-92ik", "Tinggi", "Rating 5.0; tiket & check-in peserta"],
  ["Double Helix Event Organizer", "Event organizer", "Jakarta Selatan", "EMS", "Jl. Damai Raya No.19, Cipete Utara, Kebayoran Baru, Jakarta Selatan", "+62 812-2077-7567", "-", "doublehelix.co.id", "https://www.google.com/maps/place?q=place_id:ChIJ46KTmqzxaS4RSBro-davofc", "Tinggi", "Rating 4.9"],
  ["Vecha Event Organizer", "Event organizer korporat", "Jakarta Barat", "EMS", "Jl. H. Kelik, Srengseng, Kembangan, Jakarta Barat", "+62 858-6117-1154", "-", "eventorganizerjakarta.co.id", "https://www.google.com/maps/place?q=place_id:ChIJ7bC1Psv3aS4RWtS3pw5nT4I", "Tinggi", "348 ulasan; cocok untuk modul tiket & QR"],
  ["Eventify Event Organizer", "Event organizer", "Tangerang Selatan", "EMS", "Ciater Permai Blok E7 No.2, Serpong, Tangerang Selatan", "+62 859-2050-1737", "-", "eventify.co.id", "https://www.google.com/maps/place?q=place_id:ChIJ9ckyHMHxaS4RQNhhpFwDHrI", "Tinggi", "Rating 5.0"],
  ["TD Corporation Event Organizer", "Event organizer", "Jakarta Pusat", "EMS", "Jl. Letjen Suprapto No.1, Cempaka Putih Timur, Jakarta Pusat", "+62 811-3889-922", "-", "td-corporation.com", "https://www.google.com/maps/place?q=place_id:ChIJfe-Jwdr1aS4RqaWuKS0A2RQ", "Menengah", "Rating 4.9"],
  ["Toko Buah Tangerang", "Toko buah & hamper", "Tangerang", "POS + ERP", "Maggiore Junction Blok P2, Cihuni, Pagedangan, Tangerang", "+62 838-9909-9678", "-", "instagram.com/tokobuahtangerang", "https://www.google.com/maps/place?q=place_id:ChIJZ5T5NCf7aS4ReOm4B40_E4s", "Tinggi", "138 ulasan; pesanan via WA → butuh POS & inventory"],
  ["Toko Murah Rezeki", "Toko kelontong grosir", "Tangerang", "POS + ERP", "Jl. Kihajar Dewantoro Blok A1, Gondrong, Cipondoh, Tangerang", "+62 812-8312-6709", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJO0woHAD5aS4R4tEYeu88If8", "Menengah", "Ulasan menyebut pesan lewat WA"],
  ["Toko Mama - Kp Kelapa", "Grosir FMCG", "Tangerang", "POS + ERP", "Jl. PLN Raya, Kelapa Indah, Tangerang", "+62 851-1176-3539", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJiZBEx2_5aS4RHPXv0TA2hb4", "Menengah", "74 ulasan; banyak kasir"],
  ["Kafe Jati", "Kafe & restoran", "Jakarta Selatan", "POS + Website", "Jl. Tebet Barat IX No.30, Tebet Barat, Jakarta Selatan", "+62 878-7751-0000", "-", "instagram.com/kafejati.official", "https://www.google.com/maps/place?q=place_id:ChIJ-8lqzk3zaS4Rh2M9FQYV9e4", "Tinggi", "1.700 ulasan; ramai → butuh POS & reservasi"],
  ["Kafe Pinarak", "Kafe", "Jakarta Selatan", "POS + Website", "Jl. Abdul Majid Raya No.30A, Cipete Selatan, Cilandak, Jakarta Selatan", "+62 821-1153-3552", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJZ78ZVprxaS4REid9H6q_bYg", "Menengah", "Rating 4.6"],
  ["Restoran Cangkir Java", "Restoran", "Jakarta Selatan", "POS + Website", "Jl. Gandaria Tengah III No.44, Kramat Pela, Kebayoran Baru, Jakarta Selatan", "+62 815-1118-6018", "-", "-", "https://www.google.com/maps/place?q=place_id:ChIJH8wN2BLxaS4R1tOByKIOUa4", "Menengah", "Sudah masuk Gojek; peluang integrasi pesanan"],
]

/**
 * Lead tambahan hasil riset paralel per kategori. File JSON ditulis agent ke
 * clients/raw/. File yang belum ada dilewati sehingga generator tetap jalan.
 */
const EXTRA_FILES = [
  "clients/raw/leads-healthcare.json",
  "clients/raw/leads-education.json",
  "clients/raw/leads-hospitality.json",
  "clients/raw/leads-events.json",
  "clients/raw/leads-retail.json",
  "clients/raw/leads-services.json",
]

function loadExtraRows() {
  const rows = []
  for (const rel of EXTRA_FILES) {
    const file = path.resolve(__dirname, "..", rel)
    if (!fs.existsSync(file)) continue
    try {
      const items = JSON.parse(fs.readFileSync(file, "utf8"))
      if (!Array.isArray(items)) continue
      for (const item of items) {
        rows.push([
          item.name, item.industry, item.area, item.product, item.address,
          item.phone, item.email, item.website, item.source, item.priority, item.note,
        ])
      }
    } catch (err) {
      console.warn(`Lewati ${rel}: ${err.message}`)
    }
  }
  return rows
}

function dedupe(rows) {
  const seen = new Set()
  return rows.filter((row) => {
    const key = String(row[0] || "").trim().toLowerCase()
    if (!key || seen.has(key)) return false
    seen.add(key)
    return true
  })
}

// 38 lead awal + semua lead tambahan, dibersihkan dari nama ganda.
const FINAL_ROWS = dedupe([...ROWS, ...loadExtraRows()])

const HEADERS = [
  "No", "Nama Usaha", "Bidang/Industri", "Area (Jabodetabek)", "Produk Kafeinarts Cocok",
  "Alamat Singkat", "Telepon / WhatsApp", "Email", "Website / IG", "Sumber Data",
  "Prioritas", "Catatan Follow-up",
]

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function colName(n) {
  let s = ""
  while (n > 0) {
    const rem = (n - 1) % 26
    s = String.fromCharCode(65 + rem) + s
    n = Math.floor((n - 1) / 26)
  }
  return s
}

function sheetXml() {
  const widths = [5, 30, 24, 20, 22, 52, 26, 32, 32, 62, 12, 52]
  const cols = widths.map((w, i) => `<col min="${i + 1}" max="${i + 1}" width="${w}" customWidth="1"/>`).join("")

  const headerCells = HEADERS.map((h, i) =>
    `<c r="${colName(i + 1)}1" s="1" t="inlineStr"><is><t xml:space="preserve">${esc(h)}</t></is></c>`,
  ).join("")

  const bodyRows = FINAL_ROWS.map((row, r) => {
    // Kolom A = nomor urut (angka), data usaha mulai di kolom B.
    const noCell = `<c r="A${r + 2}"><v>${r + 1}</v></c>`
    const cells = row.map((value, c) =>
      `<c r="${colName(c + 2)}${r + 2}" t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`,
    ).join("")
    return `<row r="${r + 2}">${noCell}${cells}</row>`
  }).join("")

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<sheetPr/><dimension ref="A1:${colName(HEADERS.length)}${FINAL_ROWS.length + 1}"/>
<sheetViews><sheetView workbookViewId="0"><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>
<sheetFormatPr defaultRowHeight="15"/>
<cols>${cols}</cols>
<sheetData><row r="1" ht="22" customHeight="1">${headerCells}</row>${bodyRows}</sheetData>
<autoFilter ref="A1:${colName(HEADERS.length)}${FINAL_ROWS.length + 1}"/>
</worksheet>`
}

const CONTENT_TYPES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
<Default Extension="xml" ContentType="application/xml"/>
<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>`

const ROOT_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>`

const WORKBOOK = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
<sheets><sheet name="Prospek Client" sheetId="1" r:id="rId1"/></sheets>
</workbook>`

const WORKBOOK_RELS = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>`

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2">
<font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font>
<font><b/><sz val="11"/><color rgb="FF0A0A0D"/><name val="Calibri"/><family val="2"/></font>
</fonts>
<fills count="3">
<fill><patternFill patternType="none"/></fill>
<fill><patternFill patternType="gray125"/></fill>
<fill><patternFill patternType="solid"><fgColor rgb="FFD9FF3D"/><bgColor indexed="64"/></patternFill></fill>
</fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="2">
<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>
<xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1"/>
</cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`

// ---- Minimal ZIP (store, no compression) ----
const CRC_TABLE = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[n] = c >>> 0
  }
  return table
})()

function crc32(buf) {
  let c = 0xffffffff
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}

function zip(files) {
  const now = new Date()
  const time = ((now.getHours() & 31) << 11) | ((now.getMinutes() & 63) << 5) | ((now.getSeconds() / 2) & 31)
  const date = (((now.getFullYear() - 1980) & 127) << 9) | (((now.getMonth() + 1) & 15) << 5) | (now.getDate() & 31)

  const locals = []
  const centrals = []
  let offset = 0

  for (const file of files) {
    const name = Buffer.from(file.name, "utf8")
    const data = Buffer.from(file.data, "utf8")
    const crc = crc32(data)

    const local = Buffer.alloc(30 + name.length)
    local.writeUInt32LE(0x04034b50, 0)
    local.writeUInt16LE(20, 4)
    local.writeUInt16LE(0x0800, 6)
    local.writeUInt16LE(0, 8)
    local.writeUInt16LE(time, 10)
    local.writeUInt16LE(date, 12)
    local.writeUInt32LE(crc, 14)
    local.writeUInt32LE(data.length, 18)
    local.writeUInt32LE(data.length, 22)
    local.writeUInt16LE(name.length, 26)
    local.writeUInt16LE(0, 28)
    name.copy(local, 30)
    locals.push(local, data)

    const central = Buffer.alloc(46 + name.length)
    central.writeUInt32LE(0x02014b50, 0)
    central.writeUInt16LE(20, 4)
    central.writeUInt16LE(20, 6)
    central.writeUInt16LE(0x0800, 8)
    central.writeUInt16LE(0, 10)
    central.writeUInt16LE(time, 12)
    central.writeUInt16LE(date, 14)
    central.writeUInt32LE(crc, 16)
    central.writeUInt32LE(data.length, 20)
    central.writeUInt32LE(data.length, 24)
    central.writeUInt16LE(name.length, 28)
    central.writeUInt16LE(0, 30)
    central.writeUInt16LE(0, 32)
    central.writeUInt16LE(0, 34)
    central.writeUInt16LE(0, 36)
    central.writeUInt32LE(0, 38)
    central.writeUInt32LE(offset, 42)
    name.copy(central, 46)
    centrals.push(central)

    offset += local.length + data.length
  }

  const centralBuf = Buffer.concat(centrals)
  const end = Buffer.alloc(22)
  end.writeUInt32LE(0x06054b50, 0)
  end.writeUInt16LE(0, 4)
  end.writeUInt16LE(0, 6)
  end.writeUInt16LE(files.length, 8)
  end.writeUInt16LE(files.length, 10)
  end.writeUInt32LE(centralBuf.length, 12)
  end.writeUInt32LE(offset, 16)
  end.writeUInt16LE(0, 20)

  return Buffer.concat([...locals, centralBuf, end])
}

const files = [
  { name: "[Content_Types].xml", data: CONTENT_TYPES },
  { name: "_rels/.rels", data: ROOT_RELS },
  { name: "xl/workbook.xml", data: WORKBOOK },
  { name: "xl/_rels/workbook.xml.rels", data: WORKBOOK_RELS },
  { name: "xl/styles.xml", data: STYLES },
  { name: "xl/worksheets/sheet1.xml", data: sheetXml() },
]

fs.mkdirSync(path.dirname(OUT), { recursive: true })
const xlsx = zip(files)

try {
  fs.writeFileSync(OUT, xlsx)
  console.log(`OK — ${FINAL_ROWS.length} leads written to ${OUT}`)
} catch (err) {
  // Excel sering mengunci file saat masih terbuka. Fallback agar data tetap dihasilkan.
  if (err.code !== "EBUSY" && err.code !== "EPERM") throw err
  const fallback = path.join(path.dirname(OUT), "info_client.updated.xlsx")
  fs.writeFileSync(fallback, xlsx)
  console.log(`OK — ${FINAL_ROWS.length} leads written to ${fallback}`)
  console.warn(`File utama masih terbuka/dikunci; tutup Excel lalu jalankan ulang script untuk menimpa ${OUT}.`)
}
