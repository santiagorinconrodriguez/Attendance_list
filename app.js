// =======================
// BASE DE DATOS INICIAL FIJA
// =======================

let estudiantes = {
  "0000285118": { nombre: "Juan Pérez", correo: "juan@example.com", programa: "Ing. Civil" },
  "0000391700": { nombre: "Ana Gómez", correo: "ana@example.com", programa: "Ing. Sistemas" },
  "0000379578": { nombre: "Luis Ramírez", correo: "luis@example.com", programa: "Arquitectura" },
  "E00000000039637060F141": { nombre: "Nuevo Estudiante", correo: "", programa: "" }
};

let asistenciaPorFecha = {}; // { "2-48-1999": { "0000285118": "Asistió", ... } }

let fechaActiva = new Date().toISOString().split("T")[0];
document.getElementById("fecha").value = fechaActiva;

// =======================
// FUNCIONES DE FECHA
// =======================

document.getElementById("fecha").addEventListener("change", e => {
  fechaActiva = e.target.value;
  actualizarTabla();
});

function agregarFecha() {
  if (!fechaActiva) return alert("Selecciona una fecha");
  if (!asistenciaPorFecha[fechaActiva]) asistenciaPorFecha[fechaActiva] = {};
  actualizarTabla();
  alert(`📅 Nueva fecha ${fechaActiva} lista para registrar asistencia`);
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
// EXPORTAR / GUARDAR EXCEL
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
// SUBIR EXCEL EXISTENTE
// =======================

document.getElementById("fileInput").addEventListener("change", e => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = e => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(sheet);

    // No reiniciamos estudiantes, solo actualizamos/añadimos
    json.forEach(row => {
      const id = row.ID;
      if (!id) return;

      // Actualizar datos o agregar nuevos
      estudiantes[id] = { 
        nombre: row.Nombre || estudiantes[id]?.nombre || "",
        correo: row.Correo || estudiantes[id]?.correo || "",
        programa: row.Programa || estudiantes[id]?.programa || ""
      };

      // Actualizar asistencias por fecha
      Object.keys(row).forEach(key => {
        if (["ID","Nombre","Correo","Programa"].includes(key)) return;
        if (!asistenciaPorFecha[key]) asistenciaPorFecha[key] = {};
        asistenciaPorFecha[key][id] = row[key] || "No asistió";
      });
    });

    actualizarTabla();
    alert("📂 Base de datos cargada correctamente");
  };
  reader.readAsArrayBuffer(file);
});

// =======================
// GUARDAR EXCEL DESDE INTERFAZ
// =======================

function guardarExcel() {
  exportar();
  alert("💾 Base de datos guardada en Excel");
}

// =======================
// INICIALIZAR TABLA
// =======================

actualizarTabla();
