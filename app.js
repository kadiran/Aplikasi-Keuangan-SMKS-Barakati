alert("APP.JS FINAL AKTIF");

// ================================
// NAVIGASI
// ================================
function kembaliKeDasbor(){
  window.location.href = "index.html";
}

// ================================
// LOAD DATA
// ================================
let data = JSON.parse(localStorage.getItem("keuangan")) || [];
let dataTampil = data;

// ================================
// MODE AUDIT
// ================================
function kunciAudit(){
  localStorage.setItem("auditLock","true");
  alert("DATA DIKUNCI UNTUK AUDIT");
}

function bukaAudit(){
  const p = prompt("Masukkan Password Kepsek:");
  if(p === "kepsek2026"){
    localStorage.removeItem("auditLock");
    alert("KUNCI AUDIT DIBUKA");
    location.reload();
  } else {
    alert("Password salah");
  }
}

function isAuditLocked(){
  return localStorage.getItem("auditLock") === "true";
}

// ================================
// NOMOR BUKTI
// ================================
function generateNoBukti(){
  const last = localStorage.getItem("lastBukti") || 0;
  const next = Number(last) + 1;
  localStorage.setItem("lastBukti", next);
  return "BOS/SMKS-BKT/" + String(next).padStart(4,"0") + "/2026";
}

function simpanTransaksiArsip(d){
  if(isAuditLocked()){
    alert("MODE AUDIT AKTIF!");
    return;
  }
  d.noBukti = generateNoBukti();
  data.push(d);
  localStorage.setItem("keuangan", JSON.stringify(data));
  alert("Data disimpan\nNo Bukti: " + d.noBukti);
}

// ================================
// REKAP (UNTUK DASHBOARD)
// ================================
function rekap(){
  let masuk = 0;
  let keluar = 0;

  data.forEach(d => {
    if(d.jenis === "masuk") masuk += d.jumlah;
    if(d.jenis === "keluar") keluar += d.jumlah;
  });

  return {
    masuk: masuk,
    keluar: keluar,
    saldo: masuk - keluar
  };
}

// ================================
// TAMPILKAN DATA (ADMIN)
// ================================
function tampilkan(){
  dataTampil = data;
  renderTabel(dataTampil);
}

function renderTabel(arr){
  const tbody = document.getElementById("tabel");
  if(!tbody) return;

  tbody.innerHTML = "";

  let masuk = 0, keluar = 0;

  arr.forEach((d,i)=>{
    if(d.jenis === "masuk") masuk += d.jumlah;
    if(d.jenis === "keluar") keluar += d.jumlah;

    tbody.innerHTML += `
      <tr>
        <td>${i+1}</td>
        <td>${d.tanggal}</td>
        <td>${d.noBukti || "-"}</td>
        <td>${d.uraian}</td>
        <td>${d.jenis === "masuk" ? d.jumlah.toLocaleString("id-ID") : ""}</td>
        <td>${d.jenis === "keluar" ? d.jumlah.toLocaleString("id-ID") : ""}</td>
      </tr>
    `;
  });

  // update rekap di halaman admin
  const elMasuk = document.getElementById("masuk");
  const elKeluar = document.getElementById("keluar");
  const elSaldo = document.getElementById("saldo");

  if(elMasuk) elMasuk.innerText = "Rp " + masuk.toLocaleString("id-ID");
  if(elKeluar) elKeluar.innerText = "Rp " + keluar.toLocaleString("id-ID");
  if(elSaldo) elSaldo.innerText = "Rp " + (masuk - keluar).toLocaleString("id-ID");
}

// ================================
// FILTER BULAN
// ================================
function terapkanFilter(){
  const bulan = document.getElementById("filterBulan").value;
  const tahun = document.getElementById("filterTahun").value;

  dataTampil = data.filter(d=>{
    const t = new Date(d.tanggal);
    return (bulan === "" || t.getMonth() == bulan) &&
           t.getFullYear() == tahun;
  });

  renderTabel(dataTampil);
}

function resetFilter(){
  document.getElementById("filterBulan").value = "";
  renderTabel(data);
}

// ================================
// BACKUP & EXPORT
// ================================
function backupArsip(){
  const arsip = {
    sekolah: "SMKS Barakati",
    tahun: "2026",
    tanggalBackup: new Date().toLocaleString("id-ID"),
    data: dataTampil
  };

  const blob = new Blob(
    [JSON.stringify(arsip,null,2)],
    {type:"application/json"}
  );

  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ARSIP_DINAS_KEUANGAN_SMKS_BARAKATI_2026.json";
  a.click();
}

function exportExcel(){
  let html = `<table border="1">
    <tr><th colspan="6">LAPORAN KEUANGAN SMKS BARAKATI</th></tr>
    <tr><th colspan="6">TAHUN ANGGARAN 2026</th></tr>
    <tr>
      <th>No</th><th>Tanggal</th><th>No Bukti</th>
      <th>Uraian</th><th>Penerimaan</th><th>Pengeluaran</th>
    </tr>`;

  dataTampil.forEach((d,i)=>{
    html += `
      <tr>
        <td>${i+1}</td>
        <td>${d.tanggal}</td>
        <td>${d.noBukti||"-"}</td>
        <td>${d.uraian}</td>
        <td>${d.jenis==="masuk"?d.jumlah:""}</td>
        <td>${d.jenis==="keluar"?d.jumlah:""}</td>
      </tr>`;
  });

  html += "</table>";

  const blob = new Blob([html],{type:"application/vnd.ms-excel"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "LAPORAN_KEUANGAN_SMKS_BARAKATI_2026.xls";
  a.click();
}
