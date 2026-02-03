let data = JSON.parse(localStorage.getItem("keuangan")) || [];

const form = document.getElementById("form");
const tbody = document.getElementById("data");
const laporan = document.getElementById("laporan");

if(form){
form.onsubmit = e => {
e.preventDefault();
data.push({
tgl: tgl.value,
uraian: uraian.value,
masuk: masuk.value,
keluar: keluar.value
});
localStorage.setItem("keuangan", JSON.stringify(data));
form.reset();
tampil();
}
}

function tampil(){
if(tbody){
tbody.innerHTML="";
data.forEach(d=>{
tbody.innerHTML += `
<tr>
<td>${d.tgl}</td>
<td>${d.uraian}</td>
<td>${d.masuk}</td>
<td>${d.keluar}</td>
</tr>`;
});
}
if(laporan){
laporan.innerHTML="";
data.forEach((d,i)=>{
laporan.innerHTML += `
<tr>
<td>${i+1}</td>
<td>${d.tgl}</td>
<td>${d.uraian}</td>
<td>${d.masuk}</td>
<td>${d.keluar}</td>
</tr>`;
});
}
}
tampil();
