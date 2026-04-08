// =======================
// BASE DE DATOS
// =======================

const estudiantes = {
  "0000285118": { nombre: "Juan Pérez", correo: "juan@example.com", programa: "Ing. Civil" },
  "000039170pro0": { nombre: "Ana Gómez", correo: "ana@example.com", programa: "Ing. Sistemas" },
  "0000379578": { nombre: "Luis Ramírez", correo: "luis@example.com", programa: "Arquitectura" },
  "E00000000039637060F141": { nombre: "Nuevo Estudiante", correo: "", programa: "" }
};

// =======================
// ASISTENCIA POR FECHA
// =======================

// Guarda asistencia por fecha
let asistenciaPorFecha = JSON.parse(localStorage.getItem("asistenciaPorFecha") || "{}");

// Fecha activa
let fechaActiva = new Date().toISOString().split("T")[0];
document.getElementById("fecha").value = fechaActiva;

// =======================
// FUNCIONES FECHA
// =======================

document.getElementById("fecha").addEventListener("change", (e) => {
  fechaActiva = e.target.value;
  actualizarTabla();
});

function agregarFecha() {
  if (!fechaActiva) return alert("Selecciona una fecha");

  // Crear registro de la nueva fecha si no existe
  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};

  guardarAsistencia();
  actualizarTabla();
  alert(`📅 Nueva fecha ${fechaActiva} lista para registrar asistencia`);
}

// =======================
// ACTUALIZAR TABLA
// =======================

function actualizarTabla() {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  for (let id in estudiantes) {
    const asistio = asistenciaPorFecha[fechaActiva]?.[id] || false;

    let fila = document.createElement("tr");
    fila.setAttribute("data-id", id);

    fila.innerHTML = `
      <td>${id}</td>
      <td>${estudiantes[id].nombre}</td>
      <td>${estudiantes[id].correo}</td>
      <td>${estudiantes[id].programa}</td>
      <td class="estado" ondblclick="toggleAsistencia('${id}', this)">
        ${asistio ? "✅" : "❌"}
      </td>
    `;

    if (asistio) fila.classList.add("asistio");

    tbody.appendChild(fila);
  }
}

// =======================
// ESCANER
// =======================

function onScanSuccess(decodedText) {
  const id = decodedText.trim();

  if (!estudiantes[id]) { alert("❌ ID no válido"); return; }
  if (!fechaActiva) { alert("Selecciona una fecha"); return; }

  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};

  asistenciaPorFecha[fechaActiva][id] = true;
  guardarAsistencia();
  actualizarTabla();
  alert("✅ Asistencia registrada");
}

let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);

// =======================
// TOGGLE ASISTENCIA DOBLE CLICK
// =======================

function toggleAsistencia(id, celda) {
  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};

  const asistio = asistenciaPorFecha[fechaActiva][id] || false;
  asistenciaPorFecha[fechaActiva][id] = !asistio;

  guardarAsistencia();
  actualizarTabla();
}

// =======================
// ELIMINAR TODA ASISTENCIA
// =======================

function eliminarTodas() {
  const confirmacion = confirm("⚠️ ¿Seguro que quieres eliminar toda la asistencia?");
  if (!confirmacion) return;

  asistenciaPorFecha = {};
  guardarAsistencia();
  actualizarTabla();
  alert("🗑 Toda la asistencia ha sido eliminada");
}

// =======================
// EXPORTAR EXCEL
// =======================

function exportar() {
  const data = [];

  for (let id in estudiantes) {
    // Revisar todas las fechas y marcar "Asistió" si al menos en una fecha hay true
    let asistio = Object.values(asistenciaPorFecha).some(fecha => fecha[id]);
    data.push({
      ID: id,
      Nombre: estudiantes[id].nombre,
      Correo: estudiantes[id].correo,
      Programa: estudiantes[id].programa,
      Asistencia: asistio ? "Asistió" : "No asistió"
    });
  }

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia Global");
  XLSX.writeFile(wb, `asistencia_global.xlsx`);
}

// =======================
// GUARDAR LOCALSTORAGE
// =======================

function guardarAsistencia() {
  localStorage.setItem("asistenciaPorFecha", JSON.stringify(asistenciaPorFecha));
}

// =======================
// INICIAR TABLA
// =======================

actualizarTabla();
