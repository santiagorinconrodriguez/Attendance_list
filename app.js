// =======================
// BASE DE DATOS (EDITAS AQUÍ)
// =======================

const estudiantes = {
  "0000285118": { nombre: "Juan Pérez", correo: "juan@example.com", programa: "Ing. Civil" },
  "0000391700": { nombre: "Ana Gómez", correo: "ana@example.com", programa: "Ing. Sistemas" },
  "0000379578": { nombre: "Luis Ramírez", correo: "luis@example.com", programa: "Arquitectura" },
  "E00000000039637060F141": { nombre: "Nuevo Estudiante", correo: "", programa: "" }
};

// =======================
// ASISTENCIA GLOBAL
// =======================

// Guardar asistencia por estudiante, sin importar fecha
let asistenciaGlobal = JSON.parse(localStorage.getItem("asistenciaGlobal") || "{}");

// Fecha activa (solo para registro del QR)
let fechaActiva = new Date().toISOString().split("T")[0];
document.getElementById("fecha").value = fechaActiva;

// =======================
// FUNCIONES FECHA
// =======================

document.getElementById("fecha").addEventListener("change", (e) => {
  fechaActiva = e.target.value;
});

// Agregar fecha (registrar asistencia si no existe)
function agregarFecha() {
  if (!fechaActiva) return alert("Selecciona una fecha");
  // No hacemos nada especial por ahora; la tabla se actualizará automáticamente
  actualizarTabla();
  alert(`Fecha ${fechaActiva} lista para registrar asistencia`);
}

// =======================
// ACTUALIZAR TABLA
// =======================

function actualizarTabla() {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  for (let id in estudiantes) {
    const asistio = asistenciaGlobal[id] || false;

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

  asistenciaGlobal[id] = true;
  guardarAsistencia();
  actualizarTabla();
  alert("✅ Asistencia registrada");
}

// Inicializar scanner
let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);

// =======================
// TOGGLE ASISTENCIA DOBLE CLICK
// =======================

function toggleAsistencia(id, celda) {
  const asistio = asistenciaGlobal[id] || false;
  asistenciaGlobal[id] = !asistio;

  guardarAsistencia();
  actualizarTabla();
}

// =======================
// ELIMINAR TODA ASISTENCIA
// =======================

function eliminarTodas() {
  const confirmacion = confirm("⚠️ ¿Seguro que quieres eliminar toda la asistencia?");
  if (!confirmacion) return;

  asistenciaGlobal = {};
  guardarAsistencia();
  actualizarTabla();
  alert("🗑 Asistencia eliminada");
}

// =======================
// EXPORTAR EXCEL
// =======================

function exportar() {
  const data = [];

  for (let id in estudiantes) {
    const asistio = asistenciaGlobal[id] ? "Asistió" : "No asistió";
    data.push({
      ID: id,
      Nombre: estudiantes[id].nombre,
      Correo: estudiantes[id].correo,
      Programa: estudiantes[id].programa,
      Asistencia: asistio
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
  localStorage.setItem("asistenciaGlobal", JSON.stringify(asistenciaGlobal));
}

// =======================
// INICIAR TABLA
// =======================

actualizarTabla();
