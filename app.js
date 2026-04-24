import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, child } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getAuth, signInWithEmailAndPassword } 
from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyARUmyWKj2bhzqKuJqb_do6VUz0mvbF9_U",
  authDomain: "asistencia-qr-8f6ee.firebaseapp.com",
  databaseURL: "https://asistencia-qr-8f6ee-default-rtdb.firebaseio.com",
  projectId: "asistencia-qr-8f6ee",
  storageBucket: "asistencia-qr-8f6ee.firebasestorage.app",
  messagingSenderId: "129898951834",
  appId: "1:129898951834:web:2ac46920a01f653dfadb23"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);



const auth = getAuth(app);

let scanner;

window.login = async function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  try {
    await signInWithEmailAndPassword(auth, email, password);

    alert("✅ Sesión iniciada");

    document.getElementById("login").style.display = "none";
    document.getElementById("app").style.display = "block";

    await cargarDatos();

    scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
    scanner.render(onScanSuccess);

  } catch (error) {
    console.error("ERROR REAL:", error);
    alert("❌ " + (error?.message || "Error desconocido"));
  }
};

let estudiantes = {
  "E00000000028511868EDBD": { nombre: "ARENAS SALTOS, MARIA JOSE", correo: "mariaaresal@unisabana.edu.co", programa: "ENFERMERIA" },
  "E000000000391700F4F963": { nombre: "AREVALO ROSALES, JERONIMO", correo: "jeronimoarro@unisabana.edu.co", programa: "ADMINISTRACION DE EMPRESAS" },
  "E00000000037957842E3A1": { nombre: "BARON RAMIREZ, ANDRES FELIPE", correo: "andresbabu@unisabana.edu.co", programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "0000313245": { nombre: "BECHARA HERNANDEZ, ARTURO TOMAS", correo: "arturobe@unisabana.edu.co", programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "E000000000299883184D96": { nombre: "BETANCUR VILLA, KEVIN DE JESUS", correo: "kevinbevi@unisabana.edu.co", programa: "ENFERMERIA" },
  "E0000000003013142BB81D": { nombre: "BONZA FONSECA, LUISA FERNANDA", correo: "luisabofo@unisabana.edu.co", programa: "ENFERMERIA" },
  "E000000000382590094BE6": { nombre: "BRAUSIN CORREA, LUNA", correo: "lunabrco@unisabana.edu.co", programa: "ADMON NEGOCIOS INTERNACIONALES" }, 
  "E0000000003908983130FA": { nombre: "CASTAÑEDA GARZON, SEBASTIAN",              correo: "sebastiancasgar@unisabana.edu.co",   programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "E00000000029753410F5BB": { nombre: "CASTRO LOZANO, SAMUEL ANDRES",             correo: "samuelcaslo@unisabana.edu.co",       programa: "ENFERMERIA" },
  "E000000000372729A81839": { nombre: "COMBARIZA GONZALEZ, STEPHANIE",            correo: "stephaniecogo@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "E0000000003822370E0477": { nombre: "CRUZ HERNANDEZ, JUAN FELIPE",              correo: "juancrhe@unisabana.edu.co",          programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "E00000000038076606D1D0": { nombre: "CRUZ PEÑA, LUCIANA",                       correo: "lucianacrpe@unisabana.edu.co",       programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "E000000000335534B89DD7": { nombre: "ESTEBAN MONZON, JUAN JOSE",                correo: "juanestmo@unisabana.edu.co",         programa: "ADMON NEGOCIOS INTERNACIONALES" },
  "0000382796": { nombre: "FLORIAN RODRIGUEZ, PAULA VALENTINA",       correo: "paulaflro@unisabana.edu.co",         programa: "ADMON DE MERCADEO Y LOGIST INT" },
  "E0000000002960783715AA": { nombre: "FONSECA VILLARREAL, JUANITA DEL PILAR",    correo: "juanitafovi@unisabana.edu.co",       programa: "ENFERMERIA" }, 
  "E000000000276801DA2842": { nombre: "GALEANO MOLINA, ERIKA DANIELA",          correo: "erikagamo@unisabana.edu.co",      programa: "ENFERMERIA"},
  "E000000000368812A3CE22": { nombre: "GALINDO CHAVEZ, DAVID FELIPE",           correo: "davidgalch@unisabana.edu.co",     programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E000000000202262F1DF8A": { nombre: "GENOY URREGO, JULIAN ANDRES",            correo: "juliangeur@unisabana.edu.co",     programa: "ENFERMERIA"},
  "E000000000381633AF4286": { nombre: "GOMEZ CASTILLO, ISABELA YINETH",         correo: "isabelagoca@unisabana.edu.co",    programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E00000000027413467D00C": { nombre: "GONZALEZ BAUTISTA, KATERIN",             correo: "kateringoba@unisabana.edu.co",    programa: "ENFERMERIA"},
  "E000000000260232B47EBB": { nombre: "GONZALEZ ESCOBAR, ALEXANDRA",            correo: "alexandragoes@unisabana.edu.co",  programa: "ENFERMERIA"},
  "E000000000368335BACA7D": { nombre: "GUTIERREZ RODRIGUEZ, SAMUEL",            correo: "samuelguro@unisabana.edu.co",     programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E0000000003923149F4720": { nombre: "LOPEZ RAMOS, NICOLAS",                   correo: "nicolaslopra@unisabana.edu.co",   programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E000000000377835AD4903": { nombre: "LOZANO HOLGUIN, SAMUEL DAVID",           correo: "samuelloho@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "E000000000372548D331D8": { nombre: "MANRIQUE BENAVIDES, SHAILA",             correo: "shailamabe@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "E000000000367634C40B5B": { nombre: "MONTAÑO SANCHEZ, JUANITA",               correo: "juanitamonsa@unisabana.edu.co",   programa: "ADMINISTRACION & SERVICIO"},
  "E0000000003864005D788B": { nombre: "MORALES ALFONSO, ANTONIO JOSE",          correo: "antoniomoal@unisabana.edu.co",    programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E000000000292311068A09": { nombre: "NEMOGA RODRIGUEZ, VALERIA",              correo: "valerianero@unisabana.edu.co",    programa: "ENFERMERIA"},
  "E00000000026084269590D": { nombre: "PARRA RAMIREZ, MARIA PAULA",             correo: "mariapara@unisabana.edu.co",      programa: "ENFERMERIA"},
  "E000000000390484FB5773": { nombre: "REBOLLEDO SOTOMAYOR, MATEO",             correo: "mateoreso@unisabana.edu.co",      programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E000000000389498027FB1": { nombre: "RODRIGUEZ OLAYA, MIGUEL ALEJANDRO",      correo: "miguelrool@unisabana.edu.co",     programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "0000286011": { nombre: "SALAZAR RIVERA, MARIA FERNANDA",         correo: "mariasalri@unisabana.edu.co",     programa: "ENFERMERIA"},
  "E000000000366323DBF386": { nombre: "SANCLEMENTE ARCE, SEBASTIAN",            correo: "sebastiansanar@unisabana.edu.co", programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E000000000290074DF843E": { nombre: "SKINNER CARABALLO, NEDDY ALEXANDER",     correo: "neddyskca@unisabana.edu.co",      programa: "ENFERMERIA"},
  "E0000000003051165A2E75": { nombre: "TENORIO CANTOR, MARIA PAULA",            correo: "mariatenca@unisabana.edu.co",     programa: "ENFERMERIA"},
  "E000000000299884AD67B1": { nombre: "TORRES AYALA, SAMANTA",                  correo: "samantatoay@unisabana.edu.co",    programa: "ENFERMERIA"},
  "E000000000308084FAC82C": { nombre: "TORRES OLAYA, ANA GABRIELA",             correo: "anatool@unisabana.edu.co",        programa: "ENFERMERIA"},
  "E000000000387982A5BAA7": { nombre: "VALDERRAMA CRUZ, SANTIAGO",              correo: "santiagovacr@unisabana.edu.co",   programa: "ADMON NEGOCIOS INTERNACIONALES"},
  "E0000000003893828CA361": { nombre: "VANEGAS RUSSI, SAMANTHA",                correo: "samanthavaru@unisabana.edu.co",   programa: "ADMON DE MERCADEO Y LOGIST INT"},
  "0000372159": { nombre: "MARTINEZ SALGADO, JUAN SEBASTIAN",       correo: "juanmatsa@unisabana.edu.co",      programa: "DERECHO"},
  "E000000000361203FDA45C": { nombre: "NEIRA ZULETA, ALEJANDRA",                correo: "alejandranezu@unisabana.edu.co",  programa: "DERECHO"}
};


let asistenciaPorFecha = {}; 
let fechaActiva;

window.addEventListener("DOMContentLoaded", () => {
  fechaActiva = new Date().toISOString().split("T")[0];
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
    alert(`📅 Fecha ${fechaActiva} seleccionada`);
  });
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


  set(ref(db, "asistencia/" + fechaActiva), asistenciaPorFecha[fechaActiva]);

  actualizarTabla();
  alert("🗑 Todas las asistencias de esta fecha han sido borradas");
}

function actualizarTabla() {
  const tbody = document.querySelector("#tabla tbody");
  tbody.innerHTML = "";

  if (!estudiantes || Object.keys(estudiantes).length === 0) {
    console.error("⚠️ No hay estudiantes cargados");
    return;
  }

  for (let id in estudiantes) {
    const estudiante = estudiantes[id];

    let asistio = "No asistió";

    if (
      asistenciaPorFecha[fechaActiva] &&
      asistenciaPorFecha[fechaActiva][id] === "Asistió"
    ) {
      asistio = "Asistió";
    }

    let fila = document.createElement("tr");

    fila.innerHTML = `
      <td>${id}</td>
      <td>${estudiante.nombre || "Sin nombre"}</td>
      <td>${estudiante.correo || "-"}</td>
      <td>${estudiante.programa || "-"}</td>
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

function toggleAsistencia(id) {
  if (!asistenciaPorFecha[fechaActiva]) {
    asistenciaPorFecha[fechaActiva] = {};
  }

  const estadoActual = asistenciaPorFecha[fechaActiva][id] || "No asistió";

  asistenciaPorFecha[fechaActiva][id] =
    estadoActual === "Asistió" ? "No asistió" : "Asistió";

  set(ref(db, "asistencia/" + fechaActiva), asistenciaPorFecha[fechaActiva]);

  actualizarTabla();
}

async function exportar() {
  const snapshot = await get(ref(db, "asistencia"));

  if (snapshot.exists()) {
    asistenciaPorFecha = snapshot.val();
  } else {
    asistenciaPorFecha = {};
  }

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
  try {
    const snapshot = await get(ref(db, "asistencia"));

    if (snapshot.exists()) {
      asistenciaPorFecha = snapshot.val();
    } else {
      asistenciaPorFecha = {};
    }

    actualizarTabla();

  } catch (error) {
    console.error("Error cargando datos:", error);
  }
}

let deferredPrompt;

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (/Android|iPhone|iPad/i.test(navigator.userAgent)) {
    document.getElementById("installModal").style.display = "flex";
  }
});

document.getElementById("installBtn").addEventListener("click", async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  const choice = await deferredPrompt.userChoice;

  console.log("Resultado instalación:", choice.outcome);

  deferredPrompt = null;

  document.getElementById("installModal").style.display = "none";
});

window.exportar = exportar;
window.modificarFecha = modificarFecha;
window.borrarDatosFecha = borrarDatosFecha;
window.toggleAsistencia = toggleAsistencia;
window.cargarDatos = cargarDatos; 
