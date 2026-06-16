// =============================================================================
// app.js  —  Generador de Balanços de Situació i Compte de Pèrdues i Guanys
// Normativa: PGC espanyol (RD 1514/2007) / model AEAT
// =============================================================================

// ─── Configuració de comptes del balanç ───────────────────────────────────────
const CUENTAS = {
  activo_no_corriente: [
    { grupo: "Immobilitzat intangible",              nombre: "Aplicacions informàtiques",                                    peso_min: 0.10, peso_max: 0.40 },
    { grupo: "Immobilitzat intangible",              nombre: "Propietat industrial",                                         peso_min: 0.02, peso_max: 0.15 },
    { grupo: "Immobilitzat material",                nombre: "Construccions",                                                peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Immobilitzat material",                nombre: "Elements de transport",                                       peso_min: 0.02, peso_max: 0.15 },
    { grupo: "Immobilitzat material",                nombre: "Mobles i estris",                                             peso_min: 0.02, peso_max: 0.15 },
    { grupo: "Inversions financeres a llarg termini",nombre: "Participacions en empreses del grup i associades",            peso_min: 0.00, peso_max: 0.10 },
    { grupo: "Inversions financeres a llarg termini",nombre: "Altres valors representatius de deute a llarg termini",      peso_min: 0.00, peso_max: 0.08 },
  ],
  activo_corriente: [
    { grupo: "Existències",                          nombre: "Existències de mercaderies",                                  peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Existències",                          nombre: "Existències de productes acabats",                           peso_min: 0.00, peso_max: 0.10 },
    { grupo: "Deutors comercials",                   nombre: "Clients",                                                    peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Deutors comercials",                   nombre: "Deutors diversos",                                           peso_min: 0.00, peso_max: 0.10 },
    { grupo: "Deutors comercials",                   nombre: "Hisenda Pública deutora",                                    peso_min: 0.00, peso_max: 0.08 },
    { grupo: "Inversions financeres a curt termini", nombre: "Inversions financeres a curt termini",                       peso_min: 0.00, peso_max: 0.20 },
    { grupo: "Efectiu i altres actius líquids",      nombre: "Tresoreria (caixa i bancs)",                                 peso_min: 0.01, peso_max: 0.25 },
  ],
  patrimonio_neto: [
    { grupo: "Fons propis", nombre: "Capital social",                         peso_min: 0.20, peso_max: 0.60 },
    { grupo: "Fons propis", nombre: "Prima d'emissió i aportacions de socis", peso_min: 0.00, peso_max: 0.05 },
    { grupo: "Fons propis", nombre: "Reserves",                               peso_min: 0.00, peso_max: 0.30 },
    { grupo: "Fons propis", nombre: "Resultats d'exercicis anteriors",        peso_min: 0.00, peso_max: 0.10 },
    { grupo: "Fons propis", nombre: "Resultat de l'exercici",                 peso_min: 0.00, peso_max: 0.08 },
  ],
  pasivo_no_corriente: [
    { grupo: "Deutes a llarg termini",   nombre: "Deutes amb entitats de crèdit a llarg termini",           peso_min: 0.05, peso_max: 0.30 },
    { grupo: "Deutes a llarg termini",   nombre: "Deutes amb empreses del grup i associades a llarg termini",peso_min: 0.00, peso_max: 0.10 },
    { grupo: "Deutes a llarg termini",   nombre: "Altres deutes a llarg termini",                           peso_min: 0.00, peso_max: 0.15 },
    { grupo: "Provisions a llarg termini",nombre: "Provisions a llarg termini",                             peso_min: 0.00, peso_max: 0.10 },
  ],
  pasivo_corriente: [
    { grupo: "Creditors comercials",         nombre: "Proveïdors",                                         peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Creditors comercials",         nombre: "Creditors diversos",                                 peso_min: 0.00, peso_max: 0.15 },
    { grupo: "Administracions públiques",    nombre: "Hisenda Pública creditora",                          peso_min: 0.00, peso_max: 0.10 },
    { grupo: "Administracions públiques",    nombre: "Organismes de la Seguretat Social creditors",        peso_min: 0.00, peso_max: 0.08 },
    { grupo: "Deutes financers a curt termini",nombre: "Deutes amb entitats de crèdit a curt termini",     peso_min: 0.02, peso_max: 0.25 },
    { grupo: "Altres deutes a curt termini", nombre: "Altres deutes a curt termini",                       peso_min: 0.00, peso_max: 0.15 },
  ],
};

const RANGOS_ACTIVO = {
  micro:   [10000,     250000],
  pyme:    [250000,   5000000],
  mediana: [5000000,  20000000],
  grande:  [20000000, 200000000],
};

// ─── Helpers aleatoris ────────────────────────────────────────────────────────
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
function rnd(rand, min, max) { return rand() * (max - min) + min; }
function distribuirPorPesos(total, conf, rand) {
  const pesos = conf.map((c) => rnd(rand, c.peso_min, c.peso_max));
  const suma  = pesos.reduce((a, b) => a + b, 0);
  return conf.map((c, i) => ({ nombre: c.nombre, amount: suma > 0 ? total * pesos[i] / suma : total / conf.length }));
}
function distribuirPerGrups(total, conf, rand) {
  const pesos = conf.map((c) => rnd(rand, c.peso_min, c.peso_max));
  const suma  = pesos.reduce((a, b) => a + b, 0);
  return conf.map((c, i) => ({ grupo: c.grupo, nombre: c.nombre, amount: suma > 0 ? total * pesos[i] / suma : total / conf.length }));
}

// ─── Generació del balanç ─────────────────────────────────────────────────────
function generarBalance(tamano, seed) {
  const rand = crearRandom(seed);
  const [minAct, maxAct] = RANGOS_ACTIVO[tamano];
  const totalActivo = rnd(rand, minAct, maxAct);

  const proporAnc = tamano === "micro"  ? rnd(rand, 0.10, 0.40)
                  : tamano === "pyme"   ? rnd(rand, 0.30, 0.60)
                  :                       rnd(rand, 0.40, 0.75);

  const anc = distribuirPerGrups(totalActivo * proporAnc,       CUENTAS.activo_no_corriente, rand);
  const ac  = distribuirPerGrups(totalActivo * (1 - proporAnc), CUENTAS.activo_corriente,    rand);

  const ratioDeudaPN = tamano === "micro" ? rnd(rand, 0.2, 1.5)
                     : tamano === "pyme"  ? rnd(rand, 0.5, 2.0)
                     :                      rnd(rand, 0.8, 2.5);
  const pn         = totalActivo / (1 + ratioDeudaPN);
  const deudaTotal = totalActivo - pn;

  const proporPNC = (tamano === "micro" || tamano === "pyme") ? rnd(rand, 0.3, 0.6) : rnd(rand, 0.5, 0.8);

  return {
    activo_no_corriente: anc,
    activo_corriente:    ac,
    patrimonio_neto:     distribuirPerGrups(pn,                   CUENTAS.patrimonio_neto,    rand),
    pasivo_no_corriente: distribuirPerGrups(deudaTotal * proporPNC, CUENTAS.pasivo_no_corriente, rand),
    pasivo_corriente:    distribuirPerGrups(deudaTotal * (1 - proporPNC), CUENTAS.pasivo_corriente, rand),
  };
}

// ─── Generació del compte de pèrdues i guanys (estructura AEAT) ──────────────
//
//  Partides numerades seguint el model normalitzat AEAT:
//  1.  Import net de la xifra de negocis
//        a) Vendes
//        b) Prestacions de serveis
//  2.  Variació d'existències de productes acabats i en curs
//  4.  Aprovisionaments
//        a) Consum de mercaderies
//        b) Treballs realitzats per altres empreses
//  5.  Altres ingressos d'explotació
//        a) Ingressos per arrendaments
//        b) Altres de gestió corrent
//  6.  Despeses de personal
//        a) Sous i salaris
//        b) Seguretat Social a càrrec empresa
//  7.  Altres despeses d'explotació
//        a) Serveis exteriors (lloguers, llum, etc.)
//        b) Tributs
//  8.  Amortització de l'immobilitzat
//  A.1 RESULTAT D'EXPLOTACIÓ (BAII)
//  14. Ingressos financers
//        a) De participacions en instruments de patrimoni
//        b) De valors negociables i altres
//  15. Despeses financeres
//        a) Per deutes amb tercers
//        b) Per actualització de provisions
//  17. Diferències de canvi
//  A.2 RESULTAT FINANCER
//  A.3 RESULTAT ABANS D'IMPOSTOS (A.1 + A.2)
//  20. Impost sobre beneficis (25 %)
//  A.5 RESULTAT DE L'EXERCICI (BN)
// ─────────────────────────────────────────────────────────────────────────────
function generarPyG(seed) {
  const rand = crearRandom(seed);

  // 1. Import net de la xifra de negocis
  const totalInxn   = rnd(rand, 70000, 2000000);
  const p1a_vendes  = totalInxn * rnd(rand, 0.70, 0.90);   // a) Vendes
  const p1b_serveis = totalInxn - p1a_vendes;              // b) Prestacions de serveis

  // 2. Variació d'existències (pot ser + o −)
  const varExist = totalInxn * rnd(rand, -0.04, 0.06);

  // 5. Altres ingressos d'explotació
  const altresIng    = totalInxn * rnd(rand, 0.005, 0.02);
  const p5a_arrend   = altresIng * rnd(rand, 0.50, 0.80);
  const p5b_gestio   = altresIng - p5a_arrend;

  // Total ingressos explotació
  const totalIngExpl = totalInxn + varExist + altresIng;

  // 4. Aprovisionaments (despesa)
  const totalAprov   = totalInxn * rnd(rand, 0.28, 0.52);
  const p4a_mercd    = totalAprov * rnd(rand, 0.75, 0.95);
  const p4b_treballs = totalAprov - p4a_mercd;

  // 6. Despeses de personal
  const totalPersonal = totalInxn * rnd(rand, 0.10, 0.28);
  const p6a_sous      = totalPersonal * rnd(rand, 0.75, 0.85);
  const p6b_ss        = totalPersonal - p6a_sous;

  // 7. Altres despeses d'explotació
  const altresDes   = totalInxn * rnd(rand, 0.04, 0.12);
  const p7a_serveis = altresDes * rnd(rand, 0.80, 0.95);
  const p7b_tributs = altresDes - p7a_serveis;

  // 8. Amortització
  const amortitzacio = totalInxn * rnd(rand, 0.02, 0.08);

  // Total despeses explotació
  const totalDesExpl = totalAprov + totalPersonal + altresDes + amortitzacio;

  // A.1 BAII
  const BAII = totalIngExpl - totalDesExpl;

  // 14. Ingressos financers
  const ingFin_a = totalInxn * rnd(rand, 0.00, 0.015);  // a) De participacions
  const ingFin_b = totalInxn * rnd(rand, 0.00, 0.010);  // b) De valors negociables
  const ingFin   = ingFin_a + ingFin_b;

  // 15. Despeses financeres
  const desFin_a = totalInxn * rnd(rand, 0.005, 0.04);  // a) Per deutes amb tercers
  const desFin_b = totalInxn * rnd(rand, 0.00,  0.01);  // b) Per actualització provisions
  const desFin   = desFin_a + desFin_b;

  // 17. Diferències de canvi
  const difCanvi = totalInxn * rnd(rand, -0.005, 0.005);

  // A.2 Resultat financer
  const resultFin = ingFin - desFin + difCanvi;

  // A.3 BAI
  const BAI = BAII + resultFin;

  // 20. Impost sobre beneficis (25 % si BAI > 0)
  const impost = BAI > 0 ? BAI * 0.25 : 0;

  // A.5 BN
  const BN = BAI - impost;

  return {
    // Partida 1
    totalInxn, p1a_vendes, p1b_serveis,
    // Partida 2
    varExist,
    // Partida 4
    totalAprov, p4a_mercd, p4b_treballs,
    // Partida 5
    altresIng, p5a_arrend, p5b_gestio,
    // Partida 6
    totalPersonal, p6a_sous, p6b_ss,
    // Partida 7
    altresDes, p7a_serveis, p7b_tributs,
    // Partida 8
    amortitzacio,
    // Totals i resultats
    totalIngExpl, totalDesExpl,
    BAII,
    ingFin, ingFin_a, ingFin_b,
    desFin, desFin_a, desFin_b,
    difCanvi, resultFin,
    BAI, impost, BN,
  };
}

// ─── Història de l'empresa ────────────────────────────────────────────────────
function generarHistoriaEmpresa(tamano, balance, pyg) {
  const { activo, pn } = calcularTotales(balance);
  const { fm, endeudamiento, liquidez } = calcularRatios(balance);

  const descTamano = tamano === "micro" ? "microempresa local"
    : tamano === "pyme"    ? "petita i mitjana empresa (pime)"
    : tamano === "mediana" ? "empresa mitjana consolidada"
    : "gran empresa amb presència rellevant en el seu sector";

  const descEndeu = endeudamiento > 2
    ? "un nivell d'endeutament elevat que obliga a gestionar amb prudència el risc financer"
    : "un endeutament raonable que combina recursos propis i aliens de manera equilibrada";

  const descLiq = liquidez < 1
    ? "una liquiditat ajustada, per sota de la unitat, que obliga a vigilar el fons de maniobra"
    : "una liquiditat adequada, amb un fons de maniobra positiu que permet atendre les obligacions a curt termini";

  return [
    `L'empresa simulada és una ${descTamano} que opera en el mercat nacional, amb un actiu total proper a ${formatearNumero(activo)} € i un patrimoni net al voltant de ${formatearNumero(pn)} €. Durant l'exercici, la xifra de negoci se situa entorn de ${formatearNumero(pyg.totalInxn)} €, amb un resultat net de ${formatearNumero(pyg.BN)} €, fet que indica ${pyg.BN >= 0 ? "capacitat de generar beneficis" : "dificultats per assolir la rendibilitat desitjada"}.`,
    `L'estructura financera mostra ${descEndeu}, amb una ràtio d'endeutament pròxima a ${endeudamiento.toFixed(2)}. Pel que fa a la posició a curt termini, l'empresa presenta ${descLiq} (fons de maniobra aproximat de ${formatearNumero(fm)} €).`,
    `A partir d'aquesta situació, la direcció revisa el seu model de negoci mitjançant una anàlisi DAFO, el càlcul del punt mort i l'estudi de la TIR dels principals projectes d'inversió.`,
    `Al mateix temps, l'empresa reforça la seva responsabilitat social corporativa (RSC), elaborant un balanç social alineat amb els objectius de desenvolupament sostenible.`,
    `Tot plegat ha de permetre mantenir-se competitiva en un entorn globalitzat, combinant una estructura financera sòlida amb una proposta de valor diferenciada i sostenible.`,
  ];
}

// ─── Càlculs ──────────────────────────────────────────────────────────────────
function sumar(lista) { return lista.reduce((a, c) => a + c.amount, 0); }
function calcularTotales(balance) {
  const activo = sumar(balance.activo_no_corriente) + sumar(balance.activo_corriente);
  const pn     = sumar(balance.patrimonio_neto);
  const pasivo = sumar(balance.pasivo_no_corriente) + sumar(balance.pasivo_corriente);
  return { activo, pn, pasivo };
}
function validarBalance(balance) {
  const { activo, pn, pasivo } = calcularTotales(balance);
  const errores = [];
  if (Math.abs(activo - (pn + pasivo)) > 0.5)
    errores.push(`El balanç no està quadrat: actiu=${activo.toFixed(2)} vs PN+Passiu=${(pn + pasivo).toFixed(2)}`);
  if (activo <= 0)         errores.push("L'actiu total ha de ser positiu.");
  if (pn < 0)              errores.push("El patrimoni net no pot ser negatiu.");
  if (pasivo > 3 * activo) errores.push("El passiu és desproporcionat respecte a l'actiu.");
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
function fmt(n) { return formatearNumero(n); }
function fmtNeg(n) { return n < 0 ? `(${fmt(-n)})` : fmt(n); }  // valors negatius entre parèntesis com AEAT

// ─── Renders ──────────────────────────────────────────────────────────────────
function renderTablaAgrupada(elementId, cuentas) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const grupos = {};
  cuentas.forEach((c) => { (grupos[c.grupo || "Altres"] ||= []).push(c); });
  let html = "<thead><tr><th>Submassa / Compte</th><th class=\"importe\">Import (€)</th></tr></thead><tbody>";
  for (const [g, parts] of Object.entries(grupos)) {
    html += `<tr class="grupo"><td><strong>${g}</strong></td><td class="importe"><strong>${fmt(sumar(parts))}</strong></td></tr>`;
    parts.forEach((c) => { html += `<tr><td>&nbsp;&nbsp;&nbsp;${c.nombre}</td><td class="importe">${fmt(c.amount)}</td></tr>`; });
  }
  html += `<tr class="grup-total"><td><strong>Total secció</strong></td><td class="importe"><strong>${fmt(sumar(cuentas))}</strong></td></tr></tbody>`;
  el.innerHTML = html;
}

// Renderitza el compte de pèrdues i guanys amb estructura AEAT
function renderPyGComplet(pyg) {
  const el = document.getElementById("tabla-pyg-completa");
  if (!el) return;

  // Helpers locals
  const h = (cls, label, valor, esNegatiu) => {
    const v = esNegatiu ? `(${fmt(Math.abs(valor))})` : fmt(valor);
    return `<tr class="${cls}"><td>${label}</td><td class="importe">${v}</td></tr>`;
  };
  const sub   = (label)         => `<tr class="sep-bloc"><td colspan="2">${label}</td></tr>`;
  const fila  = (label, v, neg) => h("",            label, v, neg);
  const fsub  = (label, v, neg) => h("grup-total",   `<strong>${label}</strong>`, v, neg);
  const fcl   = (cls, label, v) => `<tr class="resultat-clau ${cls}"><td><strong>${label}</strong></td><td class="importe"><strong>${v >= 0 ? fmt(v) : `(${fmt(-v)})`}</strong></td></tr>`;

  let html = "<thead><tr><th>Partida</th><th class=\"importe\">Import (€)</th></tr></thead><tbody>";

  // ── A. OPERACIONS CONTINUADES ─────────────────────────────────────────────
  html += sub("A) OPERACIONS CONTINUADES");

  // 1. Import net de la xifra de negocis
  html += `<tr class="grup-total"><td><strong>1. Import net de la xifra de negocis</strong></td><td class="importe"><strong>${fmt(pyg.totalInxn)}</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Vendes",              pyg.p1a_vendes);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Prestacions de serveis", pyg.p1b_serveis);

  // 2. Variació d'existències
  const varPos = pyg.varExist >= 0;
  html += `<tr><td>2. Variació d'existències de productes acabats i en curs</td><td class="importe">${varPos ? fmt(pyg.varExist) : `(${fmt(-pyg.varExist)})`}</td></tr>`;

  // 4. Aprovisionaments (despesa → negatiu)
  html += `<tr class="grup-total"><td><strong>4. Aprovisionaments</strong></td><td class="importe"><strong>(${fmt(pyg.totalAprov)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Consum de mercaderies",              pyg.p4a_mercd,    true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Treballs realitzats per altres empreses", pyg.p4b_treballs, true);

  // 5. Altres ingressos d'explotació
  html += `<tr class="grup-total"><td><strong>5. Altres ingressos d'explotació</strong></td><td class="importe"><strong>${fmt(pyg.altresIng)}</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Ingressos per arrendaments",  pyg.p5a_arrend);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Altres de gestió corrent",    pyg.p5b_gestio);

  // 6. Despeses de personal
  html += `<tr class="grup-total"><td><strong>6. Despeses de personal</strong></td><td class="importe"><strong>(${fmt(pyg.totalPersonal)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Sous i salaris",                   pyg.p6a_sous, true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Seguretat Social a càrrec empresa", pyg.p6b_ss,   true);

  // 7. Altres despeses d'explotació
  html += `<tr class="grup-total"><td><strong>7. Altres despeses d'explotació</strong></td><td class="importe"><strong>(${fmt(pyg.altresDes)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Serveis exteriors",  pyg.p7a_serveis, true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Tributs",            pyg.p7b_tributs, true);

  // 8. Amortització
  html += `<tr><td>8. Amortització de l'immobilitzat</td><td class="importe">(${fmt(pyg.amortitzacio)})</td></tr>`;

  // A.1 BAII
  html += fcl("baii", "A.1) RESULTAT D'EXPLOTACIÓ (BAII)", pyg.BAII);

  // ── Bloc financer ─────────────────────────────────────────────────────────
  // 14. Ingressos financers
  html += `<tr class="grup-total"><td><strong>14. Ingressos financers</strong></td><td class="importe"><strong>${fmt(pyg.ingFin)}</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) De participacions en instruments de patrimoni", pyg.ingFin_a);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) De valors negociables i altres",              pyg.ingFin_b);

  // 15. Despeses financeres
  html += `<tr class="grup-total"><td><strong>15. Despeses financeres</strong></td><td class="importe"><strong>(${fmt(pyg.desFin)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Per deutes amb tercers",              pyg.desFin_a, true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Per actualització de provisions",     pyg.desFin_b, true);

  // 17. Diferències de canvi
  const dcPos = pyg.difCanvi >= 0;
  html += `<tr><td>17. Diferències de canvi</td><td class="importe">${dcPos ? fmt(pyg.difCanvi) : `(${fmt(-pyg.difCanvi)})`}</td></tr>`;

  // A.2 Resultat financer
  html += fcl("bai", "A.2) RESULTAT FINANCER", pyg.resultFin);   // reutilitzem estil bai per al resultat financer

  // A.3 BAI
  html += fcl("bai", "A.3) RESULTAT ABANS D'IMPOSTOS (A.1 + A.2)", pyg.BAI);

  // 20. Impost sobre beneficis
  html += `<tr><td>20. Impost sobre beneficis (25 %)</td><td class="importe">${pyg.impost > 0 ? `(${fmt(pyg.impost)})` : fmt(0)}</td></tr>`;

  // A.5 BN
  html += fcl("bn", "A.5) RESULTAT DE L'EXERCICI", pyg.BN);

  html += "</tbody>";
  el.innerHTML = html;
}

// ─── Alertes balanç ───────────────────────────────────────────────────────────
function mostrarAlertas(validacion) {
  const cont = document.getElementById("alertas");
  if (!cont) return;
  cont.innerHTML = validacion.ok
    ? '<div class="alert ok">Balanç vàlid: l\'equació patrimonial es compleix.</div>'
    : `<div class="alert error"><strong>Balanç NO vàlid:</strong><ul>${validacion.errores.map((e) => `<li>${e}</li>`).join("")}</ul></div>`;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────
function activarTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const n = tab.dataset.tab;
      document.getElementById("tab-activo").classList.toggle("hidden", n !== "activo");
      document.getElementById("tab-pn-pasivo").classList.toggle("hidden", n !== "pn-pasivo");
    });
  });
}

// ─── Blocs visibles ───────────────────────────────────────────────────────────
function ocultarTodosLosBloques() {
  ["bloc-historia", "bloc-balance", "bloc-pyg"].forEach((id) =>
    document.getElementById(id).classList.add("hidden")
  );
}
function netejarDOM(ids, prop) {
  ids.forEach((id) => { const el = document.getElementById(id); if (el) el[prop] = ""; });
}

// ─── Inicialització ───────────────────────────────────────────────────────────
function inicializar() {
  const tamanoSelect = document.getElementById("tamano");
  const semillaInput = document.getElementById("semilla");
  const resultado    = document.getElementById("resultado");

  const getSeed = () => semillaInput.value ? Number(semillaInput.value) : undefined;

  // ── Balanç ──
  document.getElementById("btn-generar").addEventListener("click", () => {
    const balance = generarBalance(tamanoSelect.value, getSeed());
    const valid   = validarBalance(balance);
    const ratios  = calcularRatios(balance);
    mostrarAlertas(valid);
    netejarDOM(["historia-empresa"], "innerHTML");
    netejarDOM(["pyg-resum", "tabla-pyg-completa"], "innerHTML");
    const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    set("tot-activo",          fmt(valid.activo));
    set("tot-pn",              fmt(valid.pn));
    set("tot-pasivo",          fmt(valid.pasivo));
    set("tot-pn-pasivo",       fmt(valid.pn + valid.pasivo));
    set("ratio-fm",            fmt(ratios.fm));
    set("ratio-liquidez",      fmt(ratios.liquidez));
    set("ratio-solvencia",     fmt(ratios.solvencia));
    set("ratio-endeudamiento", fmt(ratios.endeudamiento));
    renderTablaAgrupada("tabla-anc", balance.activo_no_corriente);
    renderTablaAgrupada("tabla-ac",  balance.activo_corriente);
    renderTablaAgrupada("tabla-pn",  balance.patrimonio_neto);
    renderTablaAgrupada("tabla-pnc", balance.pasivo_no_corriente);
    renderTablaAgrupada("tabla-pc",  balance.pasivo_corriente);
    ocultarTodosLosBloques();
    document.getElementById("bloc-balance").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  // ── PyG ──
  document.getElementById("btn-generar-pyg").addEventListener("click", () => {
    const pyg = generarPyG(getSeed());
    netejarDOM(["historia-empresa", "alertas"], "innerHTML");
    netejarDOM(["tot-activo","tot-pn","tot-pasivo","tot-pn-pasivo",
                "ratio-fm","ratio-liquidez","ratio-solvencia","ratio-endeudamiento"], "textContent");
    netejarDOM(["tabla-anc","tabla-ac","tabla-pn","tabla-pnc","tabla-pc"], "innerHTML");

    // Resum numèric
    const pygRes = document.getElementById("pyg-resum");
    if (pygRes) {
      pygRes.innerHTML =
        `<h3>Resum de resultats</h3><ul>` +
        `<li><strong>A.1 Resultat d'explotació (BAII):</strong> ${pyg.BAII >= 0 ? fmt(pyg.BAII) : `(${fmt(-pyg.BAII)})`} €<small class="pyg-desc">Ingressos d'explotació − Despeses d'explotació (sense interessos ni impostos)</small></li>` +
        `<li><strong>A.2 Resultat financer:</strong> ${pyg.resultFin >= 0 ? fmt(pyg.resultFin) : `(${fmt(-pyg.resultFin)})`} €<small class="pyg-desc">Ingressos financers − Despeses financeres ± Diferències de canvi</small></li>` +
        `<li><strong>A.3 Resultat abans d'impostos (BAI):</strong> ${pyg.BAI >= 0 ? fmt(pyg.BAI) : `(${fmt(-pyg.BAI)})`} €<small class="pyg-desc">BAII + Resultat financer</small></li>` +
        `<li><strong>20. Impost sobre beneficis (25 %):</strong> (${fmt(pyg.impost)}) €</li>` +
        `<li><strong>A.5 Resultat de l'exercici (BN):</strong> ${pyg.BN >= 0 ? fmt(pyg.BN) : `(${fmt(-pyg.BN)})`} €<small class="pyg-desc">BAI − Impost sobre beneficis</small></li>` +
        `</ul>`;
    }

    renderPyGComplet(pyg);
    ocultarTodosLosBloques();
    document.getElementById("bloc-pyg").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  // ── Història ──
  document.getElementById("btn-generar-historia").addEventListener("click", () => {
    const balance = generarBalance(tamanoSelect.value, getSeed());
    const pyg     = generarPyG(getSeed());
    netejarDOM(["alertas", "pyg-resum", "tabla-pyg-completa"], "innerHTML");
    netejarDOM(["tot-activo","tot-pn","tot-pasivo","tot-pn-pasivo",
                "ratio-fm","ratio-liquidez","ratio-solvencia","ratio-endeudamiento"], "textContent");
    netejarDOM(["tabla-anc","tabla-ac","tabla-pn","tabla-pnc","tabla-pc"], "innerHTML");
    const cont = document.getElementById("historia-empresa");
    cont.innerHTML = "";
    generarHistoriaEmpresa(tamanoSelect.value, balance, pyg).forEach((p) => {
      const el = document.createElement("p"); el.textContent = p; cont.appendChild(el);
    });
    ocultarTodosLosBloques();
    document.getElementById("bloc-historia").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  ocultarTodosLosBloques();
  activarTabs();
}

window.addEventListener("DOMContentLoaded", inicializar);
