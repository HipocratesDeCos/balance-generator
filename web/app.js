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
  micro:   [10000,     250000],
  pyme:    [250000,   5000000],
  mediana: [5000000,  20000000],
  grande:  [20000000, 200000000],
};

// ─────────────────────────────────────────────────────────────────────────────
//  COMPTE DE PÈRDUES I GUANYS
//  Estructura: BAII (explotació) → BAI (+ financer) → BN (- impost)
//
//  INGRESSOS D'EXPLOTACIÓ
//    + Import net de la xifra de negocis (vendes)
//    + Variació d'existències de productes acabats
//    + Treballs efectuats per a l'empresa
//    + Altres ingressos d'explotació
//
//  DESPESES D'EXPLOTACIÓ
//    - Consums d'explotació (aprovisionaments)
//    - Despeses de personal
//    - Dotació a l'amortització de l'immobilitzat
//    - Altres despeses d'explotació
//
//  RESULTAT D'EXPLOTACIÓ (BAII) = ΣIngressos explotació − ΣDespeses explotació
//
//  RESULTAT FINANCER
//    + Ingressos financers
//    - Despeses financeres (interessos)
//
//  RESULTAT ABANS D'IMPOSTOS (BAI) = BAII + Resultat financer
//
//  IMPOST SOBRE BENEFICIS
//
//  RESULTAT NET (BN) = BAI − Impost sobre beneficis
// ─────────────────────────────────────────────────────────────────────────────

const PYG_ING_EXPLOTACIO = [
  { nombre: "Import net de la xifra de negocis",              peso_min: 0.75, peso_max: 0.95 },
  { nombre: "Variació d'existències de productes acabats",    peso_min: 0.00, peso_max: 0.08 },
  { nombre: "Treballs efectuats per a l'empresa",             peso_min: 0.00, peso_max: 0.05 },
  { nombre: "Altres ingressos d'explotació",                  peso_min: 0.02, peso_max: 0.10 },
];

const PYG_DES_EXPLOTACIO = [
  { nombre: "Consums d'explotació (aprovisionaments)",        peso_min: 0.30, peso_max: 0.55 },
  { nombre: "Despeses de personal",                           peso_min: 0.10, peso_max: 0.30 },
  { nombre: "Dotació a l'amortització de l'immobilitzat",     peso_min: 0.02, peso_max: 0.10 },
  { nombre: "Altres despeses d'explotació",                   peso_min: 0.05, peso_max: 0.15 },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

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
  return mulberry32(Number(seed) || 1);
}

function distribuirPorPesos(total, cuentasConf, rand) {
  const pesos = cuentasConf.map((cfg) => rand() * (cfg.peso_max - cfg.peso_min) + cfg.peso_min);
  const suma = pesos.reduce((a, b) => a + b, 0);
  if (suma <= 0) {
    const eq = 1 / cuentasConf.length;
    return cuentasConf.map((cfg) => ({ nombre: cfg.nombre, amount: total * eq }));
  }
  return cuentasConf.map((cfg, i) => ({ nombre: cfg.nombre, amount: total * (pesos[i] / suma) }));
}

// ─── Generació del balanç ────────────────────────────────────────────────────

function generarBalance(tamano, seed) {
  const rand = crearRandom(seed);
  const [minAct, maxAct] = RANGOS_ACTIVO[tamano];
  const totalActivo = rand() * (maxAct - minAct) + minAct;

  let proporAnc;
  if (tamano === "micro")    proporAnc = rand() * (0.4  - 0.1) + 0.1;
  else if (tamano === "pyme") proporAnc = rand() * (0.6  - 0.3) + 0.3;
  else                        proporAnc = rand() * (0.75 - 0.4) + 0.4;

  const totalANC = totalActivo * proporAnc;
  const totalAC  = totalActivo - totalANC;

  const anc = distribuirPerGrups(totalANC, CUENTAS.activo_no_corriente, rand);
  const ac  = distribuirPerGrups(totalAC,  CUENTAS.activo_corriente,    rand);

  let ratioDeudaPN;
  if (tamano === "micro")    ratioDeudaPN = rand() * (1.5 - 0.2) + 0.2;
  else if (tamano === "pyme") ratioDeudaPN = rand() * (2.0 - 0.5) + 0.5;
  else                        ratioDeudaPN = rand() * (2.5 - 0.8) + 0.8;

  const pn         = totalActivo / (1 + ratioDeudaPN);
  const deudaTotal = totalActivo - pn;

  const pnCuentas = distribuirPerGrups(pn, CUENTAS.patrimonio_neto, rand);

  let proporPNC;
  if (tamano === "micro" || tamano === "pyme") proporPNC = rand() * (0.6 - 0.3) + 0.3;
  else                                          proporPNC = rand() * (0.8 - 0.5) + 0.5;

  const totalPNC = deudaTotal * proporPNC;
  const totalPC  = deudaTotal - totalPNC;

  const pnc = distribuirPerGrups(totalPNC, CUENTAS.pasivo_no_corriente, rand);
  const pc  = distribuirPerGrups(totalPC,  CUENTAS.pasivo_corriente,    rand);

  return { activo_no_corriente: anc, activo_corriente: ac, patrimonio_neto: pnCuentas, pasivo_no_corriente: pnc, pasivo_corriente: pc };
}

// distribuirPerGrups conserva el camp `grupo` necessari per renderTablaAgrupada
function distribuirPerGrups(total, conf, rand) {
  const pesos = conf.map((cfg) => rand() * (cfg.peso_max - cfg.peso_min) + cfg.peso_min);
  const suma  = pesos.reduce((a, b) => a + b, 0);
  return conf.map((cfg, i) => ({
    grupo:  cfg.grupo,
    nombre: cfg.nombre,
    amount: suma > 0 ? total * (pesos[i] / suma) : total / conf.length,
  }));
}

// ─── Generació del compte de pèrdues i guanys ────────────────────────────────
//
//  Retorna:
//   ingExpl   → llista de partides d'ingressos d'explotació
//   desExpl   → llista de partides de despeses d'explotació
//   BAII      → Resultat d'explotació (Benefici Abans d'Interessos i Impostos)
//   ingFin    → ingressos financers (número)
//   desFin    → despeses financeres / interessos (número)
//   resultFin → Resultat financer = ingFin − desFin
//   BAI       → BAII + resultFin
//   impost    → Impost sobre beneficis (25 % si BAI > 0, altrament 0)
//   BN        → BAI − impost  (Resultat net / Benefici Net)
//
function generarPyG(seed) {
  const rand = crearRandom(seed);

  // ── 1. Ingressos d'explotació ──
  const totalIngExpl = rand() * (2000000 - 70000) + 70000;
  const ingExpl = distribuirPorPesos(totalIngExpl, PYG_ING_EXPLOTACIO, rand);

  // ── 2. Despeses d'explotació (marge net entre 3 % i 30 %) ──
  const margeExpl    = 0.03 + rand() * 0.27;          // proporció de benefici sobre ingressos
  const totalDesExpl = totalIngExpl * (1 - margeExpl);
  const desExpl      = distribuirPorPesos(totalDesExpl, PYG_DES_EXPLOTACIO, rand);

  // ── 3. BAII ──
  const BAII = totalIngExpl - totalDesExpl;

  // ── 4. Resultat financer ──
  const ingFin    = totalIngExpl * rand() * 0.03;      // fins a 3 % d'ingressos expl.
  const desFin    = totalIngExpl * rand() * 0.06;      // fins a 6 % (interessos deute)
  const resultFin = ingFin - desFin;

  // ── 5. BAI i impost ──
  const BAI    = BAII + resultFin;
  const impost = BAI > 0 ? BAI * 0.25 : 0;            // tipus impositiu simplificat 25 %

  // ── 6. BN ──
  const BN = BAI - impost;

  return {
    ingExpl,          // partides d'ingressos d'explotació
    desExpl,          // partides de despeses d'explotació
    totalIngExpl,     // total ingressos explotació
    totalDesExpl,     // total despeses explotació
    BAII,             // Resultat d'explotació
    ingFin,           // ingressos financers
    desFin,           // despeses financeres
    resultFin,        // resultat financer
    BAI,              // Resultat abans d'impostos
    impost,           // Impost sobre beneficis
    BN,               // Resultat net
  };
}

// ─── Història de l'empresa ────────────────────────────────────────────────────

function generarHistoriaEmpresa(tamano, balance, pyg) {
  const { activo, pn } = calcularTotales(balance);
  const ratios         = calcularRatios(balance);
  const { fm, endeudamiento, liquidez } = ratios;

  let descripcionTamano;
  if (tamano === "micro")        descripcionTamano = "microempresa local";
  else if (tamano === "pyme")    descripcionTamano = "petita i mitjana empresa (pime)";
  else if (tamano === "mediana") descripcionTamano = "empresa mitjana consolidada";
  else                           descripcionTamano = "gran empresa amb presència rellevant en el seu sector";

  const situacionEndeudamiento =
    endeudamiento > 2
      ? "un nivell d'endeutament elevat que obliga a gestionar amb prudència el risc financer"
      : "un endeutament raonable que combina recursos propis i aliens de manera equilibrada";

  const situacionLiquidez =
    liquidez < 1
      ? "una liquiditat ajustada, per sota de la unitat, que obliga a vigilar el fons de maniobra i els terminis de cobrament i pagament"
      : "una liquiditat adequada, amb un fons de maniobra positiu que permet atendre les obligacions a curt termini amb certa comoditat";

  const vendes  = pyg.totalIngExpl;
  const resultat = pyg.BN;

  const par1 =
    `L'empresa simulada és una ${descripcionTamano} que opera en el mercat nacional, amb un actiu total proper a ${formatearNumero(activo)} € i un patrimoni net al voltant de ${formatearNumero(pn)} €. ` +
    `Durant l'exercici analitzat, la xifra de negoci se situa entorn de ${formatearNumero(vendes)} €, amb un resultat net de l'exercici de ${formatearNumero(resultat)} €, ` +
    `fet que indica ${resultat >= 0 ? "una capacitat de generar beneficis" : "dificultats per assolir la rendibilitat desitjada"}.`;

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

// ─── Càlculs totals i ràtios ──────────────────────────────────────────────────

function sumar(lista) {
  return lista.reduce((acc, c) => acc + c.amount, 0);
}

function calcularTotales(balance) {
  const anc    = sumar(balance.activo_no_corriente);
  const ac     = sumar(balance.activo_corriente);
  const pn     = sumar(balance.patrimonio_neto);
  const pnc    = sumar(balance.pasivo_no_corriente);
  const pc     = sumar(balance.pasivo_corriente);
  const activo = anc + ac;
  const pasivo = pnc + pc;
  return { activo, pn, pasivo };
}

function validarBalance(balance, tolerancia = 0.5) {
  const { activo, pn, pasivo } = calcularTotales(balance);
  const errores = [];
  if (Math.abs(activo - (pn + pasivo)) > tolerancia)
    errores.push(`El balanç no està quadrat: actiu=${activo.toFixed(2)} vs PN+Passiu=${(pn + pasivo).toFixed(2)}`);
  if (activo <= 0)  errores.push("L'actiu total ha de ser positiu.");
  if (pn < 0)       errores.push("El patrimoni net no pot ser negatiu en el mode estàndard.");
  if (pasivo > 3 * activo) errores.push("El passiu total és desproporcionat respecte a l'actiu (possible incoherència econòmica).");
  return { ok: errores.length === 0, errores, activo, pn, pasivo };
}

function calcularRatios(balance) {
  const { activo, pn, pasivo } = calcularTotales(balance);
  const ac = sumar(balance.activo_corriente);
  const pc = sumar(balance.pasivo_corriente);
  return {
    fm:            ac - pc,
    liquidez:      pc === 0 ? Infinity : ac / pc,
    solvencia:     pasivo === 0 ? Infinity : activo / pasivo,
    endeudamiento: pn === 0 ? Infinity : pasivo / pn,
  };
}

// ─── Format ───────────────────────────────────────────────────────────────────

function formatearNumero(n) {
  if (!isFinite(n)) return "∞";
  return n.toLocaleString("ca-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ─── Renders ──────────────────────────────────────────────────────────────────

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

// Renderitza la taula del PyG amb estructura BAII → BAI → BN
function renderPyGComplet(pyg) {
  const cont = document.getElementById("pyg-taula-completa");
  if (!cont) return;

  function fila(label, valor, cls) {
    return `<tr class="${cls || ""}"><td>${label}</td><td class="importe">${formatearNumero(valor)}</td></tr>`;
  }
  function filaTotal(label, valor, cls) {
    return `<tr class="grup-total ${cls || ""}"><td><strong>${label}</strong></td><td class="importe"><strong>${formatearNumero(valor)}</strong></td></tr>`;
  }
  function separador(label) {
    return `<tr class="sep-bloc"><td colspan="2">${label}</td></tr>`;
  }

  let html = "<thead><tr><th>Partida</th><th class=\"importe\">Import (€)</th></tr></thead><tbody>";

  // ── Bloc 1: Ingressos d'explotació ──
  html += separador("A. INGRESSOS D'EXPLOTACIÓ");
  pyg.ingExpl.forEach((p) => { html += fila("&nbsp;&nbsp;&nbsp;" + p.nombre, p.amount); });
  html += filaTotal("Total ingressos d'explotació", pyg.totalIngExpl, "subtotal-positiu");

  // ── Bloc 2: Despeses d'explotació ──
  html += separador("B. DESPESES D'EXPLOTACIÓ");
  pyg.desExpl.forEach((p) => { html += fila("&nbsp;&nbsp;&nbsp;" + p.nombre, -p.amount); });
  html += filaTotal("Total despeses d'explotació", -pyg.totalDesExpl, "subtotal-negatiu");

  // ── BAII ──
  html += `<tr class="resultat-clau baii"><td><strong>RESULTAT D'EXPLOTACIÓ (BAII)</strong></td><td class="importe"><strong>${formatearNumero(pyg.BAII)}</strong></td></tr>`;

  // ── Bloc 3: Resultat financer ──
  html += separador("C. RESULTAT FINANCER");
  html += fila("&nbsp;&nbsp;&nbsp;Ingressos financers",   pyg.ingFin);
  html += fila("&nbsp;&nbsp;&nbsp;Despeses financeres (interessos)", -pyg.desFin);
  html += filaTotal("Resultat financer", pyg.resultFin, pyg.resultFin >= 0 ? "subtotal-positiu" : "subtotal-negatiu");

  // ── BAI ──
  html += `<tr class="resultat-clau bai"><td><strong>RESULTAT ABANS D'IMPOSTOS (BAI)</strong></td><td class="importe"><strong>${formatearNumero(pyg.BAI)}</strong></td></tr>`;

  // ── Impost ──
  html += separador("D. IMPOST SOBRE BENEFICIS");
  html += fila("&nbsp;&nbsp;&nbsp;Impost sobre beneficis (25 %)", -pyg.impost);

  // ── BN ──
  html += `<tr class="resultat-clau bn"><td><strong>RESULTAT NET (BN)</strong></td><td class="importe"><strong>${formatearNumero(pyg.BN)}</strong></td></tr>`;

  html += "</tbody>";
  cont.innerHTML = html;
}

// ─── Alertes del balanç ───────────────────────────────────────────────────────

function mostrarAlertas(validacion) {
  const cont = document.getElementById("alertas");
  if (!cont) return;
  cont.innerHTML = "";
  if (validacion.ok) {
    cont.innerHTML = '<div class="alert ok">Balanç vàlid: l\'equació patrimonial es compleix (diferències només per arrodoniment).</div>';
  } else {
    let html = '<div class="alert error"><strong>Balanç NO vàlid:</strong><ul>';
    validacion.errores.forEach((e) => { html += `<li>${e}</li>`; });
    html += "</ul></div>";
    cont.innerHTML = html;
  }
}

// ─── Tabs del balanç ──────────────────────────────────────────────────────────

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

// ─── Control de blocs visibles ────────────────────────────────────────────────

function ocultarTodosLosBloques() {
  document.getElementById("bloc-historia").classList.add("hidden");
  document.getElementById("bloc-balance").classList.add("hidden");
  document.getElementById("bloc-pyg").classList.add("hidden");
}

// ─── Inicialització ───────────────────────────────────────────────────────────

function inicializar() {
  const btnBalance = document.getElementById("btn-generar");
  const btnPyG     = document.getElementById("btn-generar-pyg");
  const btnHistoria = document.getElementById("btn-generar-historia");
  const resultado   = document.getElementById("resultado");
  const tamanoSelect = document.getElementById("tamano");
  const semillaInput = document.getElementById("semilla");

  // ── Balanç de situació ──
  btnBalance.addEventListener("click", () => {
    const tamano = tamanoSelect.value;
    const seed   = semillaInput.value ? Number(semillaInput.value) : undefined;

    const balance = generarBalance(tamano, seed);
    const valid   = validarBalance(balance);
    const ratios  = calcularRatios(balance);

    mostrarAlertas(valid);

    document.getElementById("historia-empresa").innerHTML = "";
    // Netejar PyG
    const pygTaula = document.getElementById("pyg-taula-completa");
    if (pygTaula) pygTaula.innerHTML = "";
    const pygRes = document.getElementById("pyg-resum");
    if (pygRes) pygRes.innerHTML = "";

    document.getElementById("tot-activo").textContent    = formatearNumero(valid.activo);
    document.getElementById("tot-pn").textContent        = formatearNumero(valid.pn);
    document.getElementById("tot-pasivo").textContent    = formatearNumero(valid.pasivo);
    document.getElementById("tot-pn-pasivo").textContent = formatearNumero(valid.pn + valid.pasivo);

    document.getElementById("ratio-fm").textContent          = formatearNumero(ratios.fm);
    document.getElementById("ratio-liquidez").textContent    = formatearNumero(ratios.liquidez);
    document.getElementById("ratio-solvencia").textContent   = formatearNumero(ratios.solvencia);
    document.getElementById("ratio-endeudamiento").textContent = formatearNumero(ratios.endeudamiento);

    renderTablaAgrupada("tabla-anc", balance.activo_no_corriente);
    renderTablaAgrupada("tabla-ac",  balance.activo_corriente);
    renderTablaAgrupada("tabla-pn",  balance.patrimonio_neto);
    renderTablaAgrupada("tabla-pnc", balance.pasivo_no_corriente);
    renderTablaAgrupada("tabla-pc",  balance.pasivo_corriente);

    ocultarTodosLosBloques();
    document.getElementById("bloc-balance").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  // ── Compte de pèrdues i guanys ──
  btnPyG.addEventListener("click", () => {
    const seed = semillaInput.value ? Number(semillaInput.value) : undefined;
    const pyg  = generarPyG(seed);

    document.getElementById("historia-empresa").innerHTML = "";
    document.getElementById("alertas").innerHTML = "";

    // Netejar totals i ràtios del balanç
    ["tot-activo","tot-pn","tot-pasivo","tot-pn-pasivo",
     "ratio-fm","ratio-liquidez","ratio-solvencia","ratio-endeudamiento"].forEach((id) => {
       const el = document.getElementById(id);
       if (el) el.textContent = "";
     });
    ["tabla-anc","tabla-ac","tabla-pn","tabla-pnc","tabla-pc"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });

    // Resum numèric PyG
    const pygRes = document.getElementById("pyg-resum");
    if (pygRes) {
      pygRes.innerHTML =
        `<p><strong>Ingressos d'explotació:</strong> ${formatearNumero(pyg.totalIngExpl)} €</p>` +
        `<p><strong>Despeses d'explotació:</strong> ${formatearNumero(pyg.totalDesExpl)} €</p>` +
        `<p><strong>BAII (Resultat d'explotació):</strong> ${formatearNumero(pyg.BAII)} €</p>` +
        `<p><strong>Resultat financer:</strong> ${formatearNumero(pyg.resultFin)} €</p>` +
        `<p><strong>BAI (Resultat abans d'impostos):</strong> ${formatearNumero(pyg.BAI)} €</p>` +
        `<p><strong>Impost sobre beneficis (25 %):</strong> ${formatearNumero(pyg.impost)} €</p>` +
        `<p><strong>BN (Resultat net):</strong> ${formatearNumero(pyg.BN)} €</p>`;
    }

    renderPyGComplet(pyg);

    ocultarTodosLosBloques();
    document.getElementById("bloc-pyg").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  // ── Història de l'empresa ──
  btnHistoria.addEventListener("click", () => {
    const tamano = tamanoSelect.value;
    const seed   = semillaInput.value ? Number(semillaInput.value) : undefined;

    const balance = generarBalance(tamano, seed);
    const pyg     = generarPyG(seed);

    document.getElementById("alertas").innerHTML = "";
    ["tot-activo","tot-pn","tot-pasivo","tot-pn-pasivo",
     "ratio-fm","ratio-liquidez","ratio-solvencia","ratio-endeudamiento"].forEach((id) => {
       const el = document.getElementById(id);
       if (el) el.textContent = "";
     });
    ["tabla-anc","tabla-ac","tabla-pn","tabla-pnc","tabla-pc"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = "";
    });
    const pygTaula = document.getElementById("pyg-taula-completa");
    if (pygTaula) pygTaula.innerHTML = "";
    const pygRes = document.getElementById("pyg-resum");
    if (pygRes) pygRes.innerHTML = "";

    const parrafos    = generarHistoriaEmpresa(tamano, balance, pyg);
    const contHistoria = document.getElementById("historia-empresa");
    contHistoria.innerHTML = "";
    parrafos.forEach((p) => {
      const elP = document.createElement("p");
      elP.textContent = p;
      contHistoria.appendChild(elP);
    });

    ocultarTodosLosBloques();
    document.getElementById("bloc-historia").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  ocultarTodosLosBloques();
  activarTabs();
}

window.addEventListener("DOMContentLoaded", inicializar);
