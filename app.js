// =======================
// BASE DE DATOS INICIAL FIJA
// =======================

let estudiantes = {
  "0000285118": { nombre: "Juan Pérez", correo: "juan@example.com", programa: "Ing. Civil" },
  "0000391700": { nombre: "Ana Gómez", correo: "ana@example.com", programa: "Ing. Sistemas" },
  "0000379578": { nombre: "Luis Ramírez", correo: "luis@example.com", programa: "Arquitectura" },
  "E00000000039637060F141": { nombre: "Nuevo Estudiante", correo: "", programa: "" }
};

// Historial de asistencia por fecha
let asistenciaPorFecha = {}; // { "2026-04-08": { "0000285118": "Asistió", ... } }

// Fecha activa
let fechaActiva = new Date().toISOString().split("T")[0];
document.getElementById("fecha").value = fechaActiva;

// =======================
// FUNCIONES DE FECHA
// =======================

document.getElementById("fecha").addEventListener("change", e => {
  fechaActiva = e.target.value;
  actualizarTabla();
});

// Cambiar la fecha y reiniciar asistencias visuales para esa fecha
function modificarFecha() {
  const nuevaFecha = prompt("Ingrese la nueva fecha (YYYY-MM-DD):", fechaActiva);
  if (!nuevaFecha) return;

  const confirmacion = confirm(`⚠️ ¿Desea cambiar la fecha activa de ${fechaActiva} a ${nuevaFecha}?`);
  if (!confirmacion) return;

  fechaActiva = nuevaFecha;
  document.getElementById("fecha").value = fechaActiva;

  if (!asistenciaPorFecha[fechaActiva]) {
    asistenciaPorFecha[fechaActiva] = {};
  }

  actualizarTabla();
  alert(`📅 Fecha activa cambiada a ${fechaActiva}`);
}
// Borrar todas las asistencias de la fecha activa
function borrarDatosFecha() {
  if (!fechaActiva) return alert("Selecciona una fecha");

  const confirmacion = confirm(`⚠️ ¿Desea borrar TODAS las asistencias de ${fechaActiva}?`);
  if (!confirmacion) return;

  asistenciaPorFecha[fechaActiva] = {};
  actualizarTabla();
  alert("🗑 Todas las asistencias de esta fecha han sido borradas");
}

// =======================
// TABLA DE ESTUDIANTES
// =======================

function actualizarTabla() {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  for (let id in estudiantes) {
    const asistio = asistenciaPorFecha[fechaActiva]?.[id] || "No asistió";

    let fila = document.createElement("tr");
    fila.setAttribute("data-id", id);

    fila.innerHTML = `
      <td>${id}</td>
      <td>${estudiantes[id].nombre}</td>
      <td>${estudiantes[id].correo}</td>
      <td>${estudiantes[id].programa}</td>
      <td class="estado" ondblclick="toggleAsistencia('${id}', this)">
        ${asistio === "Asistió" ? "✅" : "❌"}
      </td>
    `;

    if (asistio === "Asistió") fila.classList.add("asistio");
    tbody.appendChild(fila);
  }
}

// =======================
// ESCANER DE QR
// =======================

function onScanSuccess(decodedText) {
  const id = decodedText.trim();
  if (!estudiantes[id]) { alert("❌ ID no válido"); return; }
  if (!fechaActiva) { alert("Selecciona una fecha"); return; }

  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};
  asistenciaPorFecha[fechaActiva][id] = "Asistió";

  actualizarTabla();
  alert("✅ Asistencia registrada");
}

let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);

// =======================
// DOBLE CLICK PARA TOGGLE
// =======================

function toggleAsistencia(id, celda) {
  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};
  const estadoActual = asistenciaPorFecha[fechaActiva][id] || "No asistió";
  asistenciaPorFecha[fechaActiva][id] = estadoActual === "Asistió" ? "No asistió" : "Asistió";
  actualizarTabla();
}

// =======================
// EXPORTAR EXCEL
// =======================

function exportar() {
  if (!Object.keys(estudiantes).length) return alert("No hay estudiantes registrados");

  const fechas = Object.keys(asistenciaPorFecha).sort();
  const data = [];

  for (let id in estudiantes) {
    let fila = {
      ID: id,
      Nombre: estudiantes[id].nombre,
      Correo: estudiantes[id].correo,
      Programa: estudiantes[id].programa
    };

    fechas.forEach(f => {
      fila[f] = asistenciaPorFecha[f][id] || "No asistió";
    });

    data.push(fila);
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia");
  XLSX.writeFile(wb, "asistencia_global.xlsx");
}

// =======================
// INICIALIZAR TABLA
// =======================

actualizarTabla();
