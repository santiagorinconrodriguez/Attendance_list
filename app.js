// =======================
// LISTA DE IDS
// =======================

const estudiantes = [
"0000285118","0000391700","0000379578","0000313245","0000299883",
"0000301314","0000382590","0000390898","0000297534","0000372729",
"0000382237","0000380766","0000335534","0000382796","0000296078",
"0000276801","0000368812","0000202262","0000381633","0000274134",
"0000260232","0000368335","0000392314","0000377835","0000372548",
"0000367634","0000386400","0000292311","0000260842","0000390484",
"0000389498","0000286011","0000366323","0000290074","0000305116",
"0000299884","0000308084","0000387982","0000389382","0000372159",
"0000361203"
];

// =======================
// CREAR TABLA
// =======================

function crearTabla() {

  let tbody = document.querySelector("#tabla tbody");

  estudiantes.forEach(id => {

    let fila = document.createElement("tr");
    fila.setAttribute("data-id", id);

    fila.innerHTML = `
      <td>${id}</td>
      <td><input placeholder="Nombre"></td>
      <td><input placeholder="Correo"></td>
      <td><input placeholder="Programa"></td>
      <td class="estado">❌</td>
    `;

    tbody.appendChild(fila);
  });
}

crearTabla();

// =======================
// ESCANER QR
// =======================

function onScanSuccess(decodedText) {

  let id = decodedText.trim();

  let fila = document.querySelector(`tr[data-id="${id}"]`);

  if (!fila) {
    alert("❌ ID no válido");
    return;
  }

  let estado = fila.querySelector(".estado");

  if (estado.innerText === "✅") {
    alert("⚠️ Ya registrado");
    return;
  }

  estado.innerText = "✅";
  fila.classList.add("asistio");

  alert("✅ Asistencia marcada");
}

// iniciar scanner
let scanner = new Html5QrcodeScanner("reader", {
  fps: 10,
  qrbox: 250
});

scanner.render(onScanSuccess);

// =======================
// EXPORTAR A EXCEL
// =======================

function exportar() {

  let filas = document.querySelectorAll("#tabla tbody tr");

  let datos = [];

  filas.forEach(fila => {

    let celdas = fila.querySelectorAll("td");

    datos.push({
      id: celdas[0].innerText,
      nombre: celdas[1].querySelector("input").value,
      correo: celdas[2].querySelector("input").value,
      programa: celdas[3].querySelector("input").value,
      asistencia: celdas[4].innerText
    });
  });

  let ws = XLSX.utils.json_to_sheet(datos);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia");

  XLSX.writeFile(wb, "asistencia_general.xlsx");
}
