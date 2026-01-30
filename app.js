alert("APP.JS FINAL AKTIF");

// ================================
// LOAD DATA DARI LOCAL STORAGE
// ================================
let data = JSON.parse(localStorage.getItem("keuangan")) || [];

// ================================
// MODE KUNCI DATA AUDIT
// ================================
function kunciAudit(){
  localStorage.setItem("auditLock", "true");
  alert("DATA DIKUNCI UNTUK AUDIT");
}

function bukaAudit(password){
  if(password === "kepsek2026"){
    localStorage.removeItem("auditLock");
    alert("KUNCI AUDIT DIBUKA");
  } else {
    alert("Password salah");
  }
}

function isAuditLocked(){
  return localStorage.getItem("auditLock") === "true";
}

// =======================================
// MODE ARSIP DINAS PENDIDIKAN
// =======================================
function generateNoBukti(){
  const last = localStorage.getItem("lastBukti") || 0;
  const next = Number(last) + 1;
  localStorage.setItem("lastBukti", next);
  return "BOS/SMKS-BKT/" + String(next).padStart(4,"0") + "/2026";
}

function simpanTransaksiArsip(d){
  if (isAuditLocked()) {
    alert("MODE AUDIT AKTIF!\nData terkunci.");
    return;
  }

  d.noBukti = generateNoBukti();
  data.push(d);
  localStorage.setItem("keuangan", JSON.stringify(data));
  alert("Data disimpan\nNo Bukti: " + d.noBukti);
}

// ================================
// TAMPILKAN DATA KE TABEL ADMIN
// ================================
function tampilkan(){
  const tbody = document.getElementById("tabel");
  if(!tbody) return;

  tbody.innerHTML = "";

  data.forEach((d, i) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${i + 1}</td>
      <td>${d.tanggal}</td>
      <td>${d.noBukti || "-"}</td>
      <td>${d.uraian}</td>
      <td>${d.jenis === "masuk" ? d.jumlah.toLocaleString("id-ID") : ""}</td>
      <td>${d.jenis === "keluar" ? d.jumlah.toLocaleString("id-ID") : ""}</td>
    `;
    tbody.appendChild(tr);
  });
}

// ================================
// REKAP DATA
// ================================
function rekap(){
  let masuk = 0;
  let keluar = 0;

  data.forEach(d => {
    if(d.jenis === "masuk") masuk += d.jumlah;
    if(d.jenis === "keluar") keluar += d.jumlah;
  });

  return {
    masuk: masuk.toLocaleString("id-ID"),
    keluar: keluar.toLocaleString("id-ID"),
    saldo: (masuk - keluar).toLocaleString("id-ID")
  };
}

// ================================
// BACKUP ARSIP DINAS
// ================================
function backupArsip(){
  const arsip = {
    sekolah: "SMKS Barakati",
    tahun: "2026",
    tanggalBackup: new Date().toLocaleString("id-ID"),
    data: data
  };

  const blob = new Blob(
    [JSON.stringify(arsip, null, 2)],
    { type: "application/json" }
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ARSIP_DINAS_KEUANGAN_SMKS_BARAKATI_2026.json";
  a.click();
}

// ================================
// EXPORT EXCEL (FORMAT DINAS)
// ================================
function exportExcel(){
  if(data.length === 0){
    alert("Data masih kosong");
    return;
  }

  let html = `
  <table border="1">
    <tr>
      <th colspan="6">LAPORAN KEUANGAN SMKS BARAKATI</th>
    </tr>
    <tr>
      <th colspan="6">TAHUN ANGGARAN 2026</th>
    </tr>
    <tr>
      <th>No</th>
      <th>Tanggal</th>
      <th>No Bukti</th>
      <th>Uraian</th>
      <th>Penerimaan</th>
      <th>Pengeluaran</th>
    </tr>
  `;

  data.forEach((d, i) => {
    html += `
      <tr>
        <td>${i + 1}</td>
        <td>${d.tanggal}</td>
        <td>${d.noBukti || "-"}</td>
        <td>${d.uraian}</td>
        <td>${d.jenis === "masuk" ? d.jumlah : ""}</td>
        <td>${d.jenis === "keluar" ? d.jumlah : ""}</td>
      </tr>
    `;
  });

  html += `</table>`;

  const blob = new Blob([html], {
    type: "application/vnd.ms-excel"
  });

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "LAPORAN_KEUANGAN_SMKS_BARAKATI_2026.xls";
  a.click();
}
