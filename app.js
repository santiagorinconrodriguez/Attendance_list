import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, child } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  databaseURL: "https://asistencia-qr-8f6ee-default-rtdb.firebaseio.com/"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth(app);

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("✅ Sesión iniciada");
      document.getElementById("login").style.display = "none";
    })
    .catch(() => {
      alert("❌ Error al iniciar sesión");
    });
}


let estudiantes = {
  "0000285118": { nombre: "ARENAS SALTOS, MARIA JOSE", correo: "mariaaresal@unisabana.edu.co", programa: "ENFERMERIA" },
  "E00000000039637060F141": { nombre: "Juan Camilo Sánchez Romero", correo: "", programa: "" },
  "0000391700": { nombre: "AREVALO ROSALES, JERONIMO", correo: "jeronimoarro@unisabana.edu.co", programa: "ADMINISTRACION DE EMPRESAS" },
  "0000379578": { nombre: "BARON RAMIREZ, ANDRES FELIPE", correo: "andresbabu@unisabana.edu.co", programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "0000313245": { nombre: "BECHARA HERNANDEZ, ARTURO TOMAS", correo: "arturobe@unisabana.edu.co", programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "0000299883": { nombre: "BETANCUR VILLA, KEVIN DE JESUS", correo: "kevinbevi@unisabana.edu.co", programa: "ENFERMERIA" },
  "0000301314": { nombre: "BONZA FONSECA, LUISA FERNANDA", correo: "luisabofo@unisabana.edu.co", programa: "ENFERMERIA" },
  "0000382590": { nombre: "BRAUSIN CORREA, LUNA", correo: "lunabrco@unisabana.edu.co", programa: "ADMON NEGOCIOS INTERNACIONALES" }, 

  "0000390898": { nombre: "CASTAÑEDA GARZON, SEBASTIAN",              correo: "sebastiancasgar@unisabana.edu.co",   programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "0000297534": { nombre: "CASTRO LOZANO, SAMUEL ANDRES",             correo: "samuelcaslo@unisabana.edu.co",       programa: "ENFERMERIA" },
  "0000372729": { nombre: "COMBARIZA GONZALEZ, STEPHANIE",            correo: "stephaniecogo@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "0000382237": { nombre: "CRUZ HERNANDEZ, JUAN FELIPE",              correo: "juancrhe@unisabana.edu.co",          programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "0000380766": { nombre: "CRUZ PEÑA, LUCIANA",                       correo: "lucianacrpe@unisabana.edu.co",       programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "0000335534": { nombre: "ESTEBAN MONZON, JUAN JOSE",                correo: "juanestmo@unisabana.edu.co",         programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "0000382796": { nombre: "FLORIAN RODRIGUEZ, PAULA VALENTINA",       correo: "paulaflro@unisabana.edu.co",         programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "0000296078": { nombre: "FONSECA VILLARREAL, JUANITA DEL PILAR",    correo: "juanitafovi@unisabana.edu.co",       programa: "ENFERMERIA" }, 

  "0000276801": { nombre: "GALEANO MOLINA, ERIKA DANIELA",          correo: "erikagamo@unisabana.edu.co",      programa: "ENFERMERIA"},
  "0000368812": { nombre: "GALINDO CHAVEZ, DAVID FELIPE",           correo: "davidgalch@unisabana.edu.co",     programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000202262": { nombre: "GENOY URREGO, JULIAN ANDRES",            correo: "juliangeur@unisabana.edu.co",     programa: "ENFERMERIA"},
  "0000381633": { nombre: "GOMEZ CASTILLO, ISABELA YINETH",         correo: "isabelagoca@unisabana.edu.co",    programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000274134": { nombre: "GONZALEZ BAUTISTA, KATERIN",             correo: "kateringoba@unisabana.edu.co",    programa: "ENFERMERIA"},
  "0000260232": { nombre: "GONZALEZ ESCOBAR, ALEXANDRA",            correo: "alexandragoes@unisabana.edu.co",  programa: "ENFERMERIA"},
  "0000368335": { nombre: "GUTIERREZ RODRIGUEZ, SAMUEL",            correo: "samuelguro@unisabana.edu.co",     programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000392314": { nombre: "LOPEZ RAMOS, NICOLAS",                   correo: "nicolaslopra@unisabana.edu.co",   programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000377835": { nombre: "LOZANO HOLGUIN, SAMUEL DAVID",           correo: "samuelloho@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "0000372548": { nombre: "MANRIQUE BENAVIDES, SHAILA",             correo: "shailamabe@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "0000367634": { nombre: "MONTAÑO SANCHEZ, JUANITA",               correo: "juanitamonsa@unisabana.edu.co",   programa: "ADMINISTRACION & SERVICIO"},
  "0000386400": { nombre: "MORALES ALFONSO, ANTONIO JOSE",          correo: "antoniomoal@unisabana.edu.co",    programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000292311": { nombre: "NEMOGA RODRIGUEZ, VALERIA",              correo: "valerianero@unisabana.edu.co",    programa: "ENFERMERIA"},
  "0000260842": { nombre: "PARRA RAMIREZ, MARIA PAULA",             correo: "mariapara@unisabana.edu.co",      programa: "ENFERMERIA"},
  "0000390484": { nombre: "REBOLLEDO SOTOMAYOR, MATEO",             correo: "mateoreso@unisabana.edu.co",      programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000389498": { nombre: "RODRIGUEZ OLAYA, MIGUEL ALEJANDRO",      correo: "miguelrool@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "0000286011": { nombre: "SALAZAR RIVERA, MARIA FERNANDA",         correo: "mariasalri@unisabana.edu.co",     programa: "ENFERMERIA"},
  "0000366323": { nombre: "SANCLEMENTE ARCE, SEBASTIAN",            correo: "sebastiansanar@unisabana.edu.co", programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000290074": { nombre: "SKINNER CARABALLO, NEDDY ALEXANDER",     correo: "neddyskca@unisabana.edu.co",      programa: "ENFERMERIA"},
  "0000305116": { nombre: "TENORIO CANTOR, MARIA PAULA",            correo: "mariatenca@unisabana.edu.co",     programa: "ENFERMERIA"},
  "0000299884": { nombre: "TORRES AYALA, SAMANTA",                  correo: "samantatoay@unisabana.edu.co",    programa: "ENFERMERIA"},
  "0000308084": { nombre: "TORRES OLAYA, ANA GABRIELA",             correo: "anatool@unisabana.edu.co",        programa: "ENFERMERIA"},
  "0000387982": { nombre: "VALDERRAMA CRUZ, SANTIAGO",              correo: "santiagovacr@unisabana.edu.co",   programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "0000389382": { nombre: "VANEGAS RUSSI, SAMANTHA",                correo: "samanthavaru@unisabana.edu.co",   programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "0000372159": { nombre: "MARTINEZ SALGADO, JUAN SEBASTIAN",       correo: "juanmatsa@unisabana.edu.co",      programa: "DERECHO"},
  "0000361203": { nombre: "NEIRA ZULETA, ALEJANDRA",                correo: "alejandranezu@unisabana.edu.co",  programa: "DERECHO"}
};


let asistenciaPorFecha = {}; 


let fechaActiva = new Date().toISOString().split("T")[0];
document.getElementById("fecha").value = fechaActiva;


if (!asistenciaPorFecha[fechaActiva]) {
  asistenciaPorFecha[fechaActiva] = {};
}

document.getElementById("fecha").addEventListener("change", e => {
  fechaActiva = e.target.value;

  if (!asistenciaPorFecha[fechaActiva]) {
    asistenciaPorFecha[fechaActiva] = {};
  }

  actualizarTabla();
  alert(`📅 Fecha ${fechaActiva} seleccionada y lista para registrar asistencia`);
});


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


function borrarDatosFecha() {
  if (!fechaActiva) return alert("Selecciona una fecha");

  const confirmacion = confirm(`⚠️ ¿Desea borrar TODAS las asistencias de ${fechaActiva}?`);
  if (!confirmacion) return;

  asistenciaPorFecha[fechaActiva] = {};
  actualizarTabla();
  alert("🗑 Todas las asistencias de esta fecha han sido borradas");
}

function actualizarTabla() {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  for (let id in estudiantes) {
    const asistio = asistenciaPorFecha[fechaActiva]?.[id] || "No asistió";

    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${id}</td>
      <td>${estudiantes[id].nombre}</td>
      <td>${estudiantes[id].correo}</td>
      <td>${estudiantes[id].programa}</td>
      <td class="estado" onclick="toggleAsistencia('${id}')">
        ${asistio === "Asistió" ? "✅" : "❌"}
      </td>
    `;

    if (asistio === "Asistió") fila.classList.add("asistio");
    tbody.appendChild(fila);
  }
}

function onScanSuccess(decodedText) {
  const id = decodedText.trim();

  if (!estudiantes[id]) {
    alert("❌ ID no válido");
    return;
  }

  if (!fechaActiva) {
    alert("Selecciona una fecha");
    return;
  }

  if (!asistenciaPorFecha[fechaActiva]) {
    asistenciaPorFecha[fechaActiva] = {};
  }

  asistenciaPorFecha[fechaActiva][id] = "Asistió";

  set(ref(db, "asistencia/" + fechaActiva), asistenciaPorFecha[fechaActiva]);

  actualizarTabla();
  alert("✅ Asistencia registrada");
}

let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess);

function toggleAsistencia(id) {
  if (!asistenciaPorFecha[fechaActiva]) {
    asistenciaPorFecha[fechaActiva] = {};
  }

  const estadoActual = asistenciaPorFecha[fechaActiva][id] || "No asistió";

  asistenciaPorFecha[fechaActiva][id] =
    estadoActual === "Asistió" ? "No asistió" : "Asistió";

  actualizarTabla();
}


function exportar() {
  if (!Object.keys(estudiantes).length) {
    alert("No hay estudiantes registrados");
    return;
  }

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

async function cargarDatos() {
  const snapshot = await get(ref(db, "asistencia"));
  
  if (snapshot.exists()) {
    asistenciaPorFecha = snapshot.val();
  } else {
    asistenciaPorFecha = {};
  }

  actualizarTabla();
}

cargarDatos();
