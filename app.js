// =======================
// BASE DE DATOS (EDITAS AQUÍ)
// =======================

const estudiantes = {
  "0000285118": { nombre: "Juan Pérez", correo: "juan@example.com", programa: "Ing. Civil" },
  "0000391700": { nombre: "Ana Gómez", correo: "ana@example.com", programa: "Ing. Sistemas" },
  "0000379578": { nombre: "Luis Ramírez", correo: "luis@example.com", programa: "Arquitectura" },
  // agrega más estudiantes según tu necesidad
  "E00000000039637060F141": { nombre: "Nuevo Estudiante", correo: "", programa: "" }
};

// =======================
// FECHAS Y ASISTENCIA
// =======================

let asistenciaPorFecha = JSON.parse(localStorage.getItem("asistenciaPorFecha") || "{}");
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
  if (!fechaActiva) return alert("Selecciona una fecha primero");
  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};
  guardarAsistencia();
  actualizarTabla();
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

  if (asistenciaPorFecha[fechaActiva][id]) {
    alert("⚠️ Ya registrado");
    return;
  }

  asistenciaPorFecha[fechaActiva][id] = true;
  guardarAsistencia();
  actualizarTabla();
  alert("✅ Asistencia registrada");
}

// scanner
let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);

// =======================
// TOGGLE ASISTENCIA DOBLE CLICK
// =======================

function toggleAsistencia(id, celda) {
  if (!fechaActiva) return alert("Selecciona una fecha");

  const asistio = asistenciaPorFecha[fechaActiva]?.[id] || false;
  asistenciaPorFecha[fechaActiva][id] = !asistio;

  guardarAsistencia();
  actualizarTabla();
}

// =======================
// ELIMINAR POR FECHA
// =======================

function eliminarPorFecha() {
  if (!fechaActiva) { alert("Selecciona una fecha"); return; }

  const confirmacion = confirm(`⚠️ ¿Seguro que quieres eliminar toda la asistencia de ${fechaActiva}?`);
  if (!confirmacion) return;

  delete asistenciaPorFecha[fechaActiva];
  guardarAsistencia();
  actualizarTabla();
  alert("🗑 Eliminado correctamente");
}

// =======================
// EXPORTAR
// =======================

function exportar() {
  if (!fechaActiva) { alert("Selecciona una fecha"); return; }

  const data = [];

  for (let id in estudiantes) {
    const asistio = asistenciaPorFecha[fechaActiva]?.[id] ? "Asistió" : "No asistió";
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
  XLSX.utils.book_append_sheet(wb, ws, "Asistencia " + fechaActiva);
  XLSX.writeFile(wb, `asistencia_${fechaActiva}.xlsx`);
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
