// Configuración de cuentas y rangos similar a cuentas.json de Python
const CUENTAS = {
  activo_no_corriente: [
    { grupo: "Immobilitzat intangible", nombre: "Aplicacions informàtiques", peso_min: 0.10, peso_max: 0.40 },
    { grupo: "Immobilitzat intangible", nombre: "Propietat industrial", peso_min: 0.02, peso_max: 0.15 },

    { grupo: "Immobilitzat material", nombre: "Construccions", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Immobilitzat material", nombre: "Elements de transport", peso_min: 0.02, peso_max: 0.15 },
    { grupo: "Immobilitzat material", nombre: "Mobles i estris", peso_min: 0.02, peso_max: 0.15 },

    { grupo: "Inversions financeres a llarg termini", nombre: "Participacions en empreses del grup i associades", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Inversions financeres a llarg termini", nombre: "Altres valors representatius de deute a llarg termini", peso_min: 0.0, peso_max: 0.08 },
  ],
  activo_corriente: [
    { grupo: "Existències", nombre: "Existències de mercaderies", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Existències", nombre: "Existències de productes acabats", peso_min: 0.0, peso_max: 0.10 },

    { grupo: "Deutors comercials", nombre: "Clients", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Deutors comercials", nombre: "Deutors diversos", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Deutors comercials", nombre: "Hisenda Pública deutora", peso_min: 0.0, peso_max: 0.08 },

    { grupo: "Inversions financeres a curt termini", nombre: "Inversions financeres a curt termini", peso_min: 0.0, peso_max: 0.20 },

    { grupo: "Efectiu i altres actius líquids", nombre: "Tresoreria (caixa i bancs)", peso_min: 0.01, peso_max: 0.25 },
  ],
  patrimonio_neto: [
    { grupo: "Fons propis", nombre: "Capital social", peso_min: 0.20, peso_max: 0.60 },
    { grupo: "Fons propis", nombre: "Prima d'emissió i aportacions de socis", peso_min: 0.0, peso_max: 0.05 },
    { grupo: "Fons propis", nombre: "Reserves", peso_min: 0.0, peso_max: 0.30 },
    { grupo: "Fons propis", nombre: "Resultats d'exercicis anteriors", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Fons propis", nombre: "Resultat de l'exercici", peso_min: 0.0, peso_max: 0.08 },
  ],
  pasivo_no_corriente: [
    { grupo: "Deutes a llarg termini", nombre: "Deutes amb entitats de crèdit a llarg termini", peso_min: 0.05, peso_max: 0.30 },
    { grupo: "Deutes a llarg termini", nombre: "Deutes amb empreses del grup i associades a llarg termini", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Deutes a llarg termini", nombre: "Altres deutes a llarg termini", peso_min: 0.0, peso_max: 0.15 },
    { grupo: "Provisions a llarg termini", nombre: "Provisions a llarg termini", peso_min: 0.0, peso_max: 0.10 },
  ],
  pasivo_corriente: [
    { grupo: "Creditors comercials", nombre: "Proveïdors", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Creditors comercials", nombre: "Creditors diversos", peso_min: 0.0, peso_max: 0.15 },

    { grupo: "Administracions públiques", nombre: "Hisenda Pública creditora", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Administracions públiques", nombre: "Organismes de la Seguretat Social creditors", peso_min: 0.0, peso_max: 0.08 },

    { grupo: "Deutes financers a curt termini", nombre: "Deutes amb entitats de crèdit a curt termini", peso_min: 0.02, peso_max: 0.25 },
    { grupo: "Altres deutes a curt termini", nombre: "Altres deutes a curt termini", peso_min: 0.0, peso_max: 0.15 },
  ],
};

const RANGOS_ACTIVO = {
  micro: [10000, 250000],
  pyme: [250000, 5000000],
  mediana: [5000000, 20000000],
  grande: [20000000, 200000000],
};

// Configuración simplificada de la cuenta de pérdidas y ganancias (modelo abreviado)
const PYG_INGRESOS = [
  { grupo: "Explotació", nombre: "Import net de la xifra de negocis", peso_min: 0.60, peso_max: 0.85 },
  { grupo: "Explotació", nombre: "Altres ingressos d'explotació", peso_min: 0.00, peso_max: 0.10 },
  { grupo: "Financers", nombre: "Ingressos financers", peso_min: 0.00, peso_max: 0.05 },
  { grupo: "Extraordinaris", nombre: "Ingressos extraordinaris", peso_min: 0.00, peso_max: 0.05 },
];

const PYG_GASTOS = [
  { grupo: "Consums i personal", nombre: "Consums d'explotació", peso_min: 0.30, peso_max: 0.55 },
  { grupo: "Consums i personal", nombre: "Despeses de personal", peso_min: 0.10, peso_max: 0.25 },
  { grupo: "Estructura", nombre: "Altres despeses d'explotació", peso_min: 0.05, peso_max: 0.15 },
  { grupo: "Amortitzacions i provisions", nombre: "Amortitzacions i provisions", peso_min: 0.02, peso_max: 0.10 },
  { grupo: "Financers", nombre: "Despeses financeres", peso_min: 0.00, peso_max: 0.06 },
  { grupo: "Extraordinaris", nombre: "Despeses i impostos extraordinaris", peso_min: 0.00, peso_max: 0.04 },
];

// Utilidad para semillas reproducibles
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function crearRandom(seed) {
  if (!seed && seed !== 0) return Math.random;
  const s = Number(seed) || 1;
  return mulberry32(s);
}

function distribuirPorPesos(total, cuentasConf, rand) {
  const pesos = cuentasConf.map((cfg) => rand() * (cfg.peso_max - cfg.peso_min) + cfg.peso_min);
  let suma = pesos.reduce((a, b) => a + b, 0);
  if (suma <= 0) {
    const equit = 1 / cuentasConf.length;
    return cuentasConf.map((cfg) => ({ grupo: cfg.grupo, nombre: cfg.nombre, amount: total * equit }));
  }
  return cuentasConf.map((cfg, i) => ({
    grupo: cfg.grupo,
    nombre: cfg.nombre,
    amount: total * (pesos[i] / suma),
  }));
}

function generarBalance(tamano, seed) {
  const rand = crearRandom(seed);
  const [minAct, maxAct] = RANGOS_ACTIVO[tamano];
  const totalActivo = rand() * (maxAct - minAct) + minAct;

  let proporAnc;
  if (tamano === "micro") proporAnc = rand() * (0.4 - 0.1) + 0.1;
  else if (tamano === "pyme") proporAnc = rand() * (0.6 - 0.3) + 0.3;
  else proporAnc = rand() * (0.75 - 0.4) + 0.4;

  const totalANC = totalActivo * proporAnc;
  const totalAC = totalActivo - totalANC;

  const anc = distribuirPorPesos(totalANC, CUENTAS.activo_no_corriente, rand);
  const ac = distribuirPorPesos(totalAC, CUENTAS.activo_corriente, rand);

  let ratioDeudaPN;
  if (tamano === "micro") ratioDeudaPN = rand() * (1.5 - 0.2) + 0.2;
  else if (tamano === "pyme") ratioDeudaPN = rand() * (2.0 - 0.5) + 0.5;
  else ratioDeudaPN = rand() * (2.5 - 0.8) + 0.8;

  const pn = totalActivo / (1 + ratioDeudaPN);
  const deudaTotal = totalActivo - pn;

  const pnCuentas = distribuirPorPesos(pn, CUENTAS.patrimonio_neto, rand);

  let proporPNC;
  if (tamano === "micro" || tamano === "pyme") proporPNC = rand() * (0.6 - 0.3) + 0.3;
  else proporPNC = rand() * (0.8 - 0.5) + 0.5;

  const totalPNC = deudaTotal * proporPNC;
  const totalPC = deudaTotal - totalPNC;

  const pnc = distribuirPorPesos(totalPNC, CUENTAS.pasivo_no_corriente, rand);
  const pc = distribuirPorPesos(totalPC, CUENTAS.pasivo_corriente, rand);

  return {
    activo_no_corriente: anc,
    activo_corriente: ac,
    patrimonio_neto: pnCuentas,
    pasivo_no_corriente: pnc,
    pasivo_corriente: pc,
  };
}

function generarPyG(seed) {
  const rand = crearRandom(seed);

  const ventasNetas = rand() * (2000000 - 70000) + 70000;

  const totalIngresos = ventasNetas * (1 + rand() * 0.2);
  const ingresos = distribuirPorPesos(totalIngresos, PYG_INGRESOS, rand);

  const margen = 0.05 + rand() * 0.25;
  const totalGastos = totalIngresos * (1 - margen);
  const gastos = distribuirPorPesos(totalGastos, PYG_GASTOS, rand);

  const resultado = totalIngresos - totalGastos;

  return {
    ingresos,
    gastos,
    ventasNetas,
    totalIngresos,
    totalGastos,
    resultado,
  };
}

function generarHistoriaEmpresa(tamano, balance, pyg) {
  const { activo, pn, pasivo } = calcularTotales(balance);
  const ratios = calcularRatios(balance);
  const endeudamiento = ratios.endeudamiento;
  const liquidez = ratios.liquidez;
  const fm = ratios.fm;
  const ventas = pyg.ventasNetas;
  const resultado = pyg.resultado;

  let descripcionTamano;
  if (tamano === "micro") descripcionTamano = "microempresa local";
  else if (tamano === "pyme") descripcionTamano = "petita i mitjana empresa (pime)";
  else if (tamano === "mediana") descripcionTamano = "empresa mitjana consolidada";
  else descripcionTamano = "gran empresa amb presència rellevant en el seu sector";

  const situacionEndeudamiento =
    endeudamiento > 2
      ? "un nivell d'endeutament elevat que obliga a gestionar amb prudència el risc financer"
      : "un endeutament raonable que combina recursos propis i aliens de manera equilibrada";

  const situacionLiquidez =
    liquidez < 1
      ? "una liquiditat ajustada, per sota de la unitat, que obliga a vigilar el fons de maniobra i els terminis de cobrament i pagament"
      : "una liquiditat adequada, amb un fons de maniobra positiu que permet atendre les obligacions a curt termini amb certa comoditat";

  const par1 =
    `L'empresa simulada és una ${descripcionTamano} que opera en el mercat nacional, amb un actiu total proper a ${formatearNumero(activo)} € i un patrimoni net al voltant de ${formatearNumero(pn)} €. ` +
    `Durant l'exercici analitzat, la xifra de negoci se situa entorn de ${formatearNumero(ventas)} €, amb un resultat de l'exercici de ${formatearNumero(resultado)} €, ` +
    `fet que indica ${resultado >= 0 ? "una capacitat de generar beneficis" : "dificultats per assolir la rendibilitat desitjada"}.`;

  const par2 =
    `L'estructura financera mostra ${situacionEndeudamiento}, amb una ràtio d'endeutament (Passiu/Patrimoni net) pròxima a ${endeudamiento.toFixed(2)}. ` +
    `Pel que fa a la posició a curt termini, l'empresa presenta ${situacionLiquidez} (fons de maniobra aproximat de ${formatearNumero(fm)} €).`;

  const par3 =
    `A partir d'aquesta situació econòmico-financera, la direcció està revisant el seu model de negoci mitjançant una anàlisi DAFO, ` +
    `el càlcul del punt mort o llindar de rendibilitat i l'estudi de la TIR dels principals projectes d'inversió, tal com es treballa al temari de funcionament de l'empresa i disseny de models de negoci.`;

  const par4 =
    `Al mateix temps, l'empresa vol reforçar la seva responsabilitat social corporativa (RSC): està elaborant un codi de conducta intern i un balanç social que reculli les actuacions en matèria social i mediambiental, ` +
    `alineant-se amb els objectius de desenvolupament sostenible relacionats amb l'energia assequible, la innovació i el consum responsable.`;

  const par5 =
    `Tot plegat ha de permetre mantenir-se competitiva en un entorn globalitzat, combinant una estructura financera sòlida amb una proposta de valor diferenciada, sostenible i orientada al benestar de la clientela i de la societat en el seu conjunt.`;

  return [par1, par2, par3, par4, par5];
}

function sumar(lista) {
  return lista.reduce((acc, c) => acc + c.amount, 0);
}

function calcularTotales(balance) {
  const anc = sumar(balance.activo_no_corriente);
  const ac = sumar(balance.activo_corriente);
  const pn = sumar(balance.patrimonio_neto);
  const pnc = sumar(balance.pasivo_no_corriente);
  const pc = sumar(balance.pasivo_corriente);
  const activo = anc + ac;
  const pasivo = pnc + pc;
  return { activo, pn, pasivo };
}

function validarBalance(balance, tolerancia = 0.5) {
  const { activo, pn, pasivo } = calcularTotales(balance);
  const errores = [];

  if (Math.abs(activo - (pn + pasivo)) > tolerancia) {
    errores.push(`El balanç no està quadrat: actiu=${activo.toFixed(2)} vs PN+Passiu=${(pn + pasivo).toFixed(2)}`);
  }
  if (activo <= 0) {
    errores.push("L'actiu total ha de ser positiu.");
  }
  if (pn < 0) {
    errores.push("El patrimoni net no pot ser negatiu en el mode estàndard.");
  }
  if (pasivo > 3 * activo) {
    errores.push("El passiu total és desproporcionat respecte a l'actiu (possible incoherència econòmica).");
  }

  return { ok: errores.length === 0, errores, activo, pn, pasivo };
}

function calcularRatios(balance) {
  const { activo, pn, pasivo } = calcularTotales(balance);
  const ac = sumar(balance.activo_corriente);
  const pc = sumar(balance.pasivo_corriente);

  const fm = ac - pc;
  const liquidez = pc === 0 ? Infinity : ac / pc;
  const solvencia = pasivo === 0 ? Infinity : activo / pasivo;
  const endeudamiento = pn === 0 ? Infinity : pasivo / pn;

  return { fm, liquidez, solvencia, endeudamiento };
}

function formatearNumero(n) {
  if (!isFinite(n)) return "∞";
  return n.toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderTablaAgrupada(elementId, cuentas) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const grupos = {};
  cuentas.forEach((c) => {
    const g = c.grupo || "Altres";
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(c);
  });

  let html = "<thead><tr><th>Submassa / Compte</th><th class=\"importe\">Import (€)</th></tr></thead><tbody>";
  Object.keys(grupos).forEach((grupo) => {
    const partidas = grupos[grupo];
    const subtotal = sumar(partidas);
    html += `<tr class="grupo"><td><strong>${grupo}</strong></td><td class="importe"><strong>${formatearNumero(subtotal)}</strong></td></tr>`;
    partidas.forEach((c) => {
      html += `<tr><td>&nbsp;&nbsp;&nbsp;${c.nombre}</td><td class="importe">${formatearNumero(c.amount)}</td></tr>`;
    });
  });

  const total = sumar(cuentas);
  html += `<tr><td><strong>Total secció</strong></td><td class="importe"><strong>${formatearNumero(total)}</strong></td></tr>`;
  html += "</tbody>";
  el.innerHTML = html;
}

function renderTablaSimplePyG(elementId, partidas) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const grupos = {};
  partidas.forEach((p) => {
    const g = p.grupo || "Altres";
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(p);
  });

  let html = "<thead><tr><th>Grup / Partida</th><th class=\"importe\">Import (€)</th></tr></thead><tbody>";
  Object.keys(grupos).forEach((grupo) => {
    const lista = grupos[grupo];
    const subtotal = sumar(lista);
    html += `<tr class="grupo"><td><strong>${grupo}</strong></td><td class="importe"><strong>${formatearNumero(subtotal)}</strong></td></tr>`;
    lista.forEach((p) => {
      html += `<tr><td>&nbsp;&nbsp;&nbsp;${p.nombre}</td><td class="importe">${formatearNumero(p.amount)}</td></tr>`;
    });
  });

  const total = sumar(partidas);
  html += `<tr><td><strong>Total</strong></td><td class="importe"><strong>${formatearNumero(total)}</strong></td></tr>`;
  html += "</tbody>";
  el.innerHTML = html;
}

function mostrarAlertas(validacion) {
  const cont = document.getElementById("alertas");
  if (!cont) return;
  cont.innerHTML = "";
  if (validacion.ok) {
    cont.innerHTML = '<div class="alert ok">Balanç vàlid: l\'equació patrimonial es compleix (diferències només per arrodoniment).</div>';
  } else {
    let html = '<div class="alert error"><strong>Balanç NO vàlid:</strong><ul>';
    validacion.errores.forEach((e) => {
      html += `<li>${e}</li>`;
    });
    html += "</ul></div>";
    cont.innerHTML = html;
  }
}

function activarTabs() {
  const tabs = document.querySelectorAll(".tab");
  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const tabName = tab.dataset.tab;
      document.getElementById("tab-activo").classList.toggle("hidden", tabName !== "activo");
      document.getElementById("tab-pn-pasivo").classList.toggle("hidden", tabName !== "pn-pasivo");
    });
  });
}

function inicializar() {
  const btnBalance = document.getElementById("btn-generar");
  const btnPyG = document.getElementById("btn-generar-pyg");
  const btnHistoria = document.getElementById("btn-generar-historia");
  const resultado = document.getElementById("resultado");
  const tamanoSelect = document.getElementById("tamano");
  const semillaInput = document.getElementById("semilla");

  btnBalance.addEventListener("click", () => {
    const tamano = tamanoSelect.value;
    const seed = semillaInput.value ? Number(semillaInput.value) : undefined;

    const balance = generarBalance(tamano, seed);
    const valid = validarBalance(balance);
    const ratios = calcularRatios(balance);

    mostrarAlertas(valid);

    document.getElementById("historia-empresa").innerHTML = "";
    document.getElementById("pyg-ventas").textContent = "";
    document.getElementById("pyg-gastos").textContent = "";
    document.getElementById("pyg-resultado").textContent = "";
    document.getElementById("tabla-pyg-ing").innerHTML = "";
    document.getElementById("tabla-pyg-gas").innerHTML = "";

    document.getElementById("tot-activo").textContent = formatearNumero(valid.activo);
    document.getElementById("tot-pn").textContent = formatearNumero(valid.pn);
    document.getElementById("tot-pasivo").textContent = formatearNumero(valid.pasivo);
    document.getElementById("tot-pn-pasivo").textContent = formatearNumero(valid.pn + valid.pasivo);

    document.getElementById("ratio-fm").textContent = formatearNumero(ratios.fm);
    document.getElementById("ratio-liquidez").textContent = formatearNumero(ratios.liquidez);
    document.getElementById("ratio-solvencia").textContent = formatearNumero(ratios.solvencia);
    document.getElementById("ratio-endeudamiento").textContent = formatearNumero(ratios.endeudamiento);

    renderTablaAgrupada("tabla-anc", balance.activo_no_corriente);
    renderTablaAgrupada("tabla-ac", balance.activo_corriente);
    renderTablaAgrupada("tabla-pn", balance.patrimonio_neto);
    renderTablaAgrupada("tabla-pnc", balance.pasivo_no_corriente);
    renderTablaAgrupada("tabla-pc", balance.pasivo_corriente);

    resultado.classList.remove("hidden");
  });

  btnPyG.addEventListener("click", () => {
    const seed = semillaInput.value ? Number(semillaInput.value) : undefined;
    const pyg = generarPyG(seed);

    document.getElementById("historia-empresa").innerHTML = "";
    document.getElementById("alertas").innerHTML = "";
    document.getElementById("tot-activo").textContent = "";
    document.getElementById("tot-pn").textContent = "";
    document.getElementById("tot-pasivo").textContent = "";
    document.getElementById("tot-pn-pasivo").textContent = "";
    document.getElementById("ratio-fm").textContent = "";
    document.getElementById("ratio-liquidez").textContent = "";
    document.getElementById("ratio-solvencia").textContent = "";
    document.getElementById("ratio-endeudamiento").textContent = "";
    document.getElementById("tabla-anc").innerHTML = "";
    document.getElementById("tabla-ac").innerHTML = "";
    document.getElementById("tabla-pn").innerHTML = "";
    document.getElementById("tabla-pnc").innerHTML = "";
    document.getElementById("tabla-pc").innerHTML = "";

    document.getElementById("pyg-ventas").textContent = formatearNumero(pyg.ventasNetas);
    document.getElementById("pyg-gastos").textContent = formatearNumero(pyg.totalGastos);
    document.getElementById("pyg-resultado").textContent = formatearNumero(pyg.resultado);

    renderTablaSimplePyG("tabla-pyg-ing", pyg.ingresos);
    renderTablaSimplePyG("tabla-pyg-gas", pyg.gastos);

    resultado.classList.remove("hidden");
  });

  btnHistoria.addEventListener("click", () => {
    const tamano = tamanoSelect.value;
    const seed = semillaInput.value ? Number(semillaInput.value) : undefined;

    const balance = generarBalance(tamano, seed);
    const valid = validarBalance(balance);
    const ratios = calcularRatios(balance);
    const pyg = generarPyG(seed);

    document.getElementById("pyg-ventas").textContent = "";
    document.getElementById("pyg-gastos").textContent = "";
    document.getElementById("pyg-resultado").textContent = "";
    document.getElementById("tabla-pyg-ing").innerHTML = "";
    document.getElementById("tabla-pyg-gas").innerHTML = "";

    mostrarAlertas(valid);

    document.getElementById("tot-activo").textContent = formatearNumero(valid.activo);
    document.getElementById("tot-pn").textContent = formatearNumero(valid.pn);
    document.getElementById("tot-pasivo").textContent = formatearNumero(valid.pasivo);
    document.getElementById("tot-pn-pasivo").textContent = formatearNumero(valid.pn + valid.pasivo);

    document.getElementById("ratio-fm").textContent = formatearNumero(ratios.fm);
    document.getElementById("ratio-liquidez").textContent = formatearNumero(ratios.liquidez);
    document.getElementById("ratio-solvencia").textContent = formatearNumero(ratios.solvencia);
    document.getElementById("ratio-endeudamiento").textContent = formatearNumero(ratios.endeudamiento);

    renderTablaAgrupada("tabla-anc", balance.activo_no_corriente);
    renderTablaAgrupada("tabla-ac", balance.activo_corriente);
    renderTablaAgrupada("tabla-pn", balance.patrimonio_neto);
    renderTablaAgrupada("tabla-pnc", balance.pasivo_no_corriente);
    renderTablaAgrupada("tabla-pc", balance.pasivo_corriente);

    const parrafos = generarHistoriaEmpresa(tamano, balance, pyg);
    const contHistoria = document.getElementById("historia-empresa");
    contHistoria.innerHTML = "";
    parrafos.forEach((p) => {
      const elP = document.createElement("p");
      elP.textContent = p;
      contHistoria.appendChild(elP);
    });

    resultado.classList.remove("hidden");
  });

  activarTabs();
}

window.addEventListener("DOMContentLoaded", inicializar);
