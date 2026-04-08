// =======================
// BASE DE DATOS (EDITAS AQUÍ)
// =======================

const estudiantes = {
  "0000285118": { nombre: "", correo: "", programa: "" },
  "0000391700": { nombre: "", correo: "", programa: "" },
  "0000379578": { nombre: "", correo: "", programa: "" },
  "0000313245": { nombre: "", correo: "", programa: "" },
  "0000299883": { nombre: "", correo: "", programa: "" },
  "0000301314": { nombre: "", correo: "", programa: "" },
  "0000382590": { nombre: "", correo: "", programa: "" },
  "0000390898": { nombre: "", correo: "", programa: "" },
  "0000297534": { nombre: "", correo: "", programa: "" },
  "0000372729": { nombre: "", correo: "", programa: "" },
  "0000382237": { nombre: "", correo: "", programa: "" },
  "0000380766": { nombre: "", correo: "", programa: "" },
  "0000335534": { nombre: "", correo: "", programa: "" },
  "0000382796": { nombre: "", correo: "", programa: "" },
  "0000296078": { nombre: "", correo: "", programa: "" },
  "0000276801": { nombre: "", correo: "", programa: "" },
  "0000368812": { nombre: "", correo: "", programa: "" },
  "0000202262": { nombre: "", correo: "", programa: "" },
  "0000381633": { nombre: "", correo: "", programa: "" },
  "0000274134": { nombre: "", correo: "", programa: "" },
  "0000260232": { nombre: "", correo: "", programa: "" },
  "0000368335": { nombre: "", correo: "", programa: "" },
  "0000392314": { nombre: "", correo: "", programa: "" },
  "0000377835": { nombre: "", correo: "", programa: "" },
  "0000372548": { nombre: "", correo: "", programa: "" },
  "0000367634": { nombre: "", correo: "", programa: "" },
  "0000386400": { nombre: "", correo: "", programa: "" },
  "0000292311": { nombre: "", correo: "", programa: "" },
  "0000260842": { nombre: "", correo: "", programa: "" },
  "0000390484": { nombre: "", correo: "", programa: "" },
  "0000389498": { nombre: "", correo: "", programa: "" },
  "0000286011": { nombre: "", correo: "", programa: "" },
  "0000366323": { nombre: "", correo: "", programa: "" },
  "0000290074": { nombre: "", correo: "", programa: "" },
  "0000305116": { nombre: "", correo: "", programa: "" },
  "0000299884": { nombre: "", correo: "", programa: "" },
  "0000308084": { nombre: "", correo: "", programa: "" },
  "0000387982": { nombre: "", correo: "", programa: "" },
  "0000389382": { nombre: "", correo: "", programa: "" },
  "0000372159": { nombre: "", correo: "", programa: "" },
  "0000361203": { nombre: "", correo: "", programa: "" },

  // NUEVO ID
  "E00000000039637060F141": { nombre: "", correo: "", programa: "" }
};

// =======================
// ASISTENCIA
// =======================

let asistencia = [];

// =======================
// CREAR TABLA
// =======================

function crearTabla() {

  let tbody = document.querySelector("#tabla tbody");

  for (let id in estudiantes) {

    let fila = document.createElement("tr");
    fila.setAttribute("data-id", id);

    fila.innerHTML = `
      <td>${id}</td>
      <td>${estudiantes[id].nombre}</td>
      <td>${estudiantes[id].correo}</td>
      <td>${estudiantes[id].programa}</td>
      <td class="estado" ondblclick="eliminarAsistencia('${id}', this)">❌</td>
    `;

    tbody.appendChild(fila);
  }
}

crearTabla();

// =======================
// ESCANER
// =======================

function onScanSuccess(decodedText) {

  let id = decodedText.trim();

  if (!estudiantes[id]) {
    alert("❌ ID no válido");
    return;
  }

  let fechaInput = document.getElementById("fecha").value;
  let hoy = new Date().toISOString().split("T")[0];

  let fecha = fechaInput || hoy;

  // evitar fechas pasadas
  if (fecha < hoy) {
    alert("⚠️ No puedes registrar asistencia en fechas pasadas");
    return;
  }

  if (asistencia.some(a => a.id === id && a.fecha === fecha)) {
    alert("⚠️ Ya registrado en esta fecha");
    return;
  }

  asistencia.push({
    id,
    ...estudiantes[id],
    fecha,
    hora: new Date().toLocaleTimeString()
  });

  let fila = document.querySelector(`tr[data-id="${id}"]`);
  let estado = fila.querySelector(".estado");

  estado.innerText = "✅";
  estado.setAttribute("data-fecha", fecha);

  fila.classList.add("asistio");

  alert("✅ Asistencia registrada");
}

// scanner
let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);

// =======================
// ELIMINAR (DOBLE CLICK)
// =======================

function eliminarAsistencia(id, celda) {

  let fecha = celda.getAttribute("data-fecha");

  if (!fecha) {
    alert("No hay asistencia registrada aquí");
    return;
  }

  let confirmacion = confirm(
    `⚠️ ¿Eliminar asistencia de este estudiante en la fecha ${fecha}?`
  );

  if (!confirmacion) return;

  // eliminar del array
  asistencia = asistencia.filter(a => !(a.id === id && a.fecha === fecha));

  // reset visual
  celda.innerText = "❌";
  celda.removeAttribute("data-fecha");

  let fila = document.querySelector(`tr[data-id="${id}"]`);
  fila.classList.remove("asistio");

  alert("🗑 Asistencia eliminada. Puedes volver a registrarla.");
}

// =======================
// ELIMINAR POR FECHA
// =======================

function eliminarPorFecha() {

  let fecha = document.getElementById("fecha").value;

  if (!fecha) {
    alert("Selecciona una fecha");
    return;
  }

  let confirmacion = confirm("¿Seguro que quieres eliminar asistencia de esta fecha?");

  if (!confirmacion) return;

  asistencia = asistencia.filter(a => a.fecha !== fecha);

  alert("🗑 Eliminado correctamente");
}

// =======================
// EXPORTAR
// =======================

function exportar() {

  if (asistencia.length === 0) {
    alert("No hay datos");
    return;
  }

  let ws = XLSX.utils.json_to_sheet(asistencia);
  let wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia");

  XLSX.writeFile(wb, "asistencia_general.xlsx");
}
