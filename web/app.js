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

// ─── Dades fictícies per a la narració ────────────────────────────────────────
const EMPRESES_FICTÍCIES = [
  { nom: "Ferrotex, S.A.",    sector: "peces metàl·liques estandarditzades per a la indústria de l'automoció",   producte: "peces metàl·liques",      ubicacio: "Cornellà de Llobregat" },
  { nom: "Plastibages, S.L.", sector: "envasos i embalatges de plàstic per al sector alimentari",                 producte: "envasos de plàstic",       ubicacio: "Barberà del Vallès" },
  { nom: "Tèxtil Garriga, S.A.", sector: "teixits tècnics per a l'equipament esportiu",                          producte: "teixits tècnics",          ubicacio: "Mataró" },
  { nom: "Quimicat, S.L.",    sector: "productes químics per a la neteja industrial",                             producte: "productes de neteja",      ubicacio: "Tarragona" },
  { nom: "Mobel·les Nou, S.A.",sector: "mobiliari d'oficina i contracte per al mercat ibèric",                   producte: "mobiliari d'oficina",      ubicacio: "Vic" },
];

const MERCATS_EXPORTACIÓ = [
  ["Alemanya", "França", "el Regne Unit"],
  ["Itàlia", "Portugal", "els Països Baixos"],
  ["Alemanya", "Polònia", "els Estats Units"],
  ["França", "el Marroc", "el Regne Unit"],
  ["Bèlgica", "Suècia", "Mèxic"],
];

// Estratègies Ansoff: descriu el quadrant sense anomenar-lo
// Cada objecte: { quadrant, paragraf(nom, producte, pyg) }
const ANSOFF_ESTRATEGIES = [
  {
    quadrant: "penetració de mercat",
    paragraf: (nom, producte, inxn) =>
      `Davant la pressió competitiva del sector, la direcció de ${nom} va optar per intensificar les vendes del seu catàleg actual entre la base de clients ja existent i per captar nous compradors dins del mateix mercat, sense modificar ni el producte ni el segment al qual es dirigia. Per assolir-ho, va reforçar la xarxa comercial i va introduir condicions de pagament més avantatjoses per als clients amb comandes recurrents, aconseguint un increment de les unitats venudes sense necessitat de diversificar el catàleg.`,
  },
  {
    quadrant: "desenvolupament de producte",
    paragraf: (nom, producte, inxn) =>
      `En resposta a les noves exigències dels clients habituals, ${nom} va decidir ampliar la gamma de ${producte} incorporant versions amb acabats i prestacions superiors, dirigides al mateix segment de mercat que ja coneixia bé. El procés de disseny i prova va durar gairebé divuit mesos, i la nova gamma es va llançar sense obrir nous canals de distribució ni accedir a nous mercats.`,
  },
  {
    quadrant: "desenvolupament de mercat",
    paragraf: (nom, producte, inxn) =>
      `Per compensar la saturació del mercat domèstic, ${nom} va iniciar una estratègia d'expansió geogràfica cap a nous territoris on el producte era pràcticament desconegut, sense alterar les característiques tècniques de la seva oferta principal. Primer va consolidar la presència al mercat ibèric i, posteriorment, va obrir delegacions comercials a dos països del nord d'Europa.`,
  },
  {
    quadrant: "diversificació",
    paragraf: (nom, producte, inxn) =>
      `La direcció de ${nom} va identificar una oportunitat en un sector fins llavors aliè a la seva activitat principal i va decidir llançar una línia de serveis de manteniment preventiu adreçada a clients industrials d'un segment completament diferent del que havia treballat fins aleshores. Ni el producte ni el mercat eren els habituals per a l'empresa, cosa que va exigir contractar nous perfils professionals i adaptar completament les instal·lacions productives.`,
  },
];

// Descripció Porter força C (poder negociació clients) sense dir el nom
// Cada objecte: { intensitat, text(producte) }
const PORTER_CLIENTS = [
  {
    intensitat: "alt",
    text: (producte) =>
      `Un dels reptes constants és que els ${producte} que fabrica l'empresa presenten una diferenciació escassa respecte als que ofereixen una dotzena de competidors directes: les especificacions tècniques, els materials emprats i els processos de fabricació són pràcticament homologables als de qualsevol altre proveïdor del sector. Aquesta similitud fa que els grans compradors, que adquireixen en volums molt elevats, exigeixin any rere any revisions a la baixa dels preus, amenaçant de canviar de proveïdor si les condicions econòmiques no els resulten suficientment favorables.`,
  },
  {
    intensitat: "moderat",
    text: (producte) =>
      `Tot i que existeixen alternatives en el mercat, ${producte} de l'empresa compten amb un nivell de certificació i traçabilitat que la majoria de competidors no ofereixen. Això permet mantenir una certa capacitat de fixació de preus, si bé els clients de major volum negocien habitualment descomptes que comprimen els marges de contribució.`,
  },
  {
    intensitat: "baix",
    text: (producte) =>
      `La fidelitat dels clients principals és molt elevada, en part gràcies als costos de substitució associats a la integració dels ${producte} en els sistemes productius dels compradors. Aquesta dependència tècnica redueix considerablement la pressió sobre els preus i permet a l'empresa mantenir marges estables malgrat la presència de competidors amb costos inferiors.`,
  },
];

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
function rndInt(rand, min, max) { return Math.floor(rnd(rand, min, max + 1)); }
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
function generarPyG(seed) {
  const rand = crearRandom(seed);

  const totalInxn   = rnd(rand, 70000, 2000000);
  const p1a_vendes  = totalInxn * rnd(rand, 0.70, 0.90);
  const p1b_serveis = totalInxn - p1a_vendes;

  const varExist = totalInxn * rnd(rand, -0.04, 0.06);

  const altresIng    = totalInxn * rnd(rand, 0.005, 0.02);
  const p5a_arrend   = altresIng * rnd(rand, 0.50, 0.80);
  const p5b_gestio   = altresIng - p5a_arrend;

  const totalIngExpl = totalInxn + varExist + altresIng;

  const totalAprov   = totalInxn * rnd(rand, 0.28, 0.52);
  const p4a_mercd    = totalAprov * rnd(rand, 0.75, 0.95);
  const p4b_treballs = totalAprov - p4a_mercd;

  const totalPersonal = totalInxn * rnd(rand, 0.10, 0.28);
  const p6a_sous      = totalPersonal * rnd(rand, 0.75, 0.85);
  const p6b_ss        = totalPersonal - p6a_sous;

  const altresDes   = totalInxn * rnd(rand, 0.04, 0.12);
  const p7a_serveis = altresDes * rnd(rand, 0.80, 0.95);
  const p7b_tributs = altresDes - p7a_serveis;

  const amortitzacio = totalInxn * rnd(rand, 0.02, 0.08);

  const totalDesExpl = totalAprov + totalPersonal + altresDes + amortitzacio;

  const BAII = totalIngExpl - totalDesExpl;

  const ingFin_a = totalInxn * rnd(rand, 0.00, 0.015);
  const ingFin_b = totalInxn * rnd(rand, 0.00, 0.010);
  const ingFin   = ingFin_a + ingFin_b;

  const desFin_a = totalInxn * rnd(rand, 0.005, 0.04);
  const desFin_b = totalInxn * rnd(rand, 0.00,  0.01);
  const desFin   = desFin_a + desFin_b;

  const difCanvi = totalInxn * rnd(rand, -0.005, 0.005);

  const resultFin = ingFin - desFin + difCanvi;
  const BAI = BAII + resultFin;
  const impost = BAI > 0 ? BAI * 0.25 : 0;
  const BN = BAI - impost;

  return {
    totalInxn, p1a_vendes, p1b_serveis,
    varExist,
    totalAprov, p4a_mercd, p4b_treballs,
    altresIng, p5a_arrend, p5b_gestio,
    totalPersonal, p6a_sous, p6b_ss,
    altresDes, p7a_serveis, p7b_tributs,
    amortitzacio,
    totalIngExpl, totalDesExpl,
    BAII, ingFin, ingFin_a, ingFin_b,
    desFin, desFin_a, desFin_b,
    difCanvi, resultFin,
    BAI, impost, BN,
  };
}

// =============================================================================
// GENERACIÓ DE LA HISTÒRIA DE L'EMPRESA
// Cada paràgraf conté una pista latent del temari PAU (sense nominar el concepte):
//   P1 → Forma jurídica (societat anònima o limitada)
//   P2 → Dimensió (treballadors + facturació, sense dir mai "gran empresa" etc.)
//   P3 → Àmbit geogràfic (exportació a X països → internacional, sense dir-ho)
//   P4 → Estratègia de creixement intern - Matriu d'Ansoff (sense dir el quadrant)
//   P5 → Forces de Porter: poder de negociació dels clients (sense citar Porter)
//   P6 → RSC i ODS (balanç social + ODS 9 i 12, sense usar l'acrònim RSC)
//   P7 → Vinculació amb el balanç i el PyG (resultat, ratios, fons de maniobra)
// =============================================================================
function generarHistoriaEmpresa(tamano, balance, pyg) {
  // Usem la mateixa seed que el balanç (si n'hi ha) per triar empresa i estratègia
  const rand = crearRandom(undefined);  // rand addicional no determinista per a índexs
  const iEmp   = rndInt(rand, 0, EMPRESES_FICTÍCIES.length - 1);
  const iMerc  = rndInt(rand, 0, MERCATS_EXPORTACIÓ.length - 1);
  const iAns   = rndInt(rand, 0, ANSOFF_ESTRATEGIES.length - 1);
  const iPort  = rndInt(rand, 0, PORTER_CLIENTS.length - 1);

  const emp    = EMPRESES_FICTÍCIES[iEmp];
  const mercats = MERCATS_EXPORTACIÓ[iMerc];
  const ansoff = ANSOFF_ESTRATEGIES[iAns];
  const porter = PORTER_CLIENTS[iPort];

  const { activo, pn, pasivo } = calcularTotales(balance);
  const ratios = calcularRatios(balance);

  // ── Dimensió: treballadors i facturació derivats del tamano ──
  const [trebMin, trebMax, facMin, facMax] = {
    micro:   [1,   9,    50000,    500000],
    pyme:    [10,  49,   500000,   10000000],
    mediana: [50,  249,  10000000, 50000000],
    grande:  [250, 4999, 50000000, 500000000],
  }[tamano];
  const treballadors = rndInt(rand, trebMin, trebMax);
  const facturacio   = pyg.totalInxn;

  // ── Forma jurídica ──
  const formaJuridica = emp.nom.includes("S.A.") ? "societat anònima" : "societat de responsabilitat limitada";
  const capitalInici  = emp.nom.includes("S.A.") ? "60.000 €" : "12.000 €";

  // ── Paràgrafs ──
  const p = [];

  // P1 — Origen i forma jurídica (pista: SA vs SL, capital mínim)
  p.push(
    `L'any 2003, un grup de socis va constituir ${emp.nom} com a ${formaJuridica} amb un capital inicial de ${capitalInici}, amb l'objectiu de dedicar-se a la fabricació i comercialització de ${emp.sector}. La seu social es troba a ${emp.ubicacio}, on l'empresa disposa d'unes instal·lacions modernes que han estat ampliades en diverses ocasions al llarg de la seva trajectòria.`
  );

  // P2 — Dimensió (pista: treballadors + facturació, sense dir el nom de la dimensió)
  p.push(
    `Actualment, ${emp.nom} compta amb una plantilla de ${treballadors} persones contractades a jornada completa i la seva facturació anual se situa entorn de ${formatearNumero(facturacio)} €. L'actiu total del darrer exercici assoleix els ${formatearNumero(activo)} €, amb un patrimoni net de ${formatearNumero(pn)} €, fet que reflecteix una estructura financera ${ratios.endeudamiento > 2 ? "on el finançament extern té un pes notable" : "amb un pes rellevant dels recursos propis"}.`
  );

  // P3 — Àmbit geogràfic (pista: exportació a múltiples països → internacional)
  p.push(
    `Des dels primers exercicis, la companyia ha mantingut una vocació clara d'obertura exterior. Avui, gairebé el ${rndInt(rand, 45, 70)}% de la producció es destina a clients situats fora de les fronteres espanyoles: el principal mercat estranger és ${mercats[0]}, seguit de ${mercats[1]} i, des de fa dos anys, d'${mercats[2]}. Les negociacions comercials internacionals es gestionen directament des de la seu de ${emp.ubicacio} per un departament especialitzat de quatre persones.`
  );

  // P4 — Ansoff (pista: descriu el quadrant sense nomenar-lo)
  p.push(ansoff.paragraf(emp.nom, emp.producte, pyg.totalInxn));

  // P5 — Porter força C (pista: producte poc/molt diferenciat → poder de negociació)
  p.push(porter.text(emp.producte));

  // P6 — RSC i ODS (pista: balanç social + ODS 9 i 12, sense l'acrònim RSC)
  p.push(
    `Conscient del seu impacte en el territori on opera, ${emp.nom} publica cada any un document que recull de manera quantificada les seves actuacions socials i mediambientals: des de la reducció dels residus industrials i el consum d'energia fins a les polítiques d'igualtat i els plans de formació contínua de la plantilla. L'empresa ha alineat les seves pràctiques internes amb els objectius globals de construir infraestructures resilients i afavorir la industrialització sostenible, d'una banda, i amb els de garantir models de consum i producció responsables, de l'altra.`
  );

  // P7 — Vinculació balanç/PyG (fons de maniobra, resultat, solvència)
  const descFM = ratios.fm >= 0
    ? `un fons de maniobra positiu de ${formatearNumero(ratios.fm)} €, la qual cosa indica que l'actiu corrent supera el passiu corrent i que l'empresa pot atendre les seves obligacions a curt termini sense tensions de tresoreria`
    : `un fons de maniobra negatiu de ${formatearNumero(Math.abs(ratios.fm))} €, situació que requereix una atenció especial sobre la gestió del deute a curt termini`;
  const descBN = pyg.BN >= 0
    ? `un resultat net positiu de ${formatearNumero(pyg.BN)} €, senyal de rendibilitat en l'exercici`
    : `un resultat net negatiu de ${formatearNumero(Math.abs(pyg.BN))} €, que obliga la direcció a revisar l'estructura de costos`;
  p.push(
    `Quant a la situació econòmica i financera de l'empresa, el balanç de situació de l'exercici revela ${descFM}. El compte de pèrdues i guanys tanca amb ${descBN}. La ràtio de solvència se situa en ${formatearNumero(ratios.solvencia)}, mentre que la de liquiditat és de ${formatearNumero(ratios.liquidez)}, paràmetres que la direcció monitoritza trimestralment per anticipar-se a possibles desequilibris financers.`
  );

  return p;
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
function fmtNeg(n) { return n < 0 ? `(${fmt(-n)})` : fmt(n); }

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

// ─── Render de la història ────────────────────────────────────────────────────
function renderHistoria(paragrafos) {
  const cont = document.getElementById("historia-empresa");
  if (!cont) return;
  cont.innerHTML = "";

  // Etiquetes latents per al professor (ocultes per defecte, toggle per botó)
  const ETIQUETES = [
    "Forma jurídica (SA vs SL)",
    "Dimensió de l'empresa (treballadors + facturació)",
    "Àmbit geogràfic (local / nacional / internacional)",
    "Estratègia creixement intern — Matriu d'Ansoff",
    "Forces de Porter — Poder de negociació dels clients",
    "RSC i Objectius de Desenvolupament Sostenible",
    "Anàlisi financera (balanç + PyG)",
  ];

  const toggleBtn = document.createElement("button");
  toggleBtn.className = "btn-tag-toggle";
  toggleBtn.textContent = "Mostrar etiquetes pedagògiques";
  let tagsVisible = false;
  toggleBtn.addEventListener("click", () => {
    tagsVisible = !tagsVisible;
    cont.querySelectorAll(".etiqueta-clau").forEach((el) => {
      el.style.display = tagsVisible ? "inline-block" : "none";
    });
    toggleBtn.textContent = tagsVisible ? "Ocultar etiquetes pedagògiques" : "Mostrar etiquetes pedagògiques";
  });
  cont.appendChild(toggleBtn);

  paragrafos.forEach((text, i) => {
    const wrapper = document.createElement("div");
    wrapper.className = "historia-paragraf";

    const tag = document.createElement("span");
    tag.className = "etiqueta-clau";
    tag.textContent = ETIQUETES[i] || "";
    tag.style.display = "none";

    const p = document.createElement("p");
    p.textContent = text;

    wrapper.appendChild(tag);
    wrapper.appendChild(p);
    cont.appendChild(wrapper);
  });
}

// Renderitza el compte de pèrdues i guanys amb estructura AEAT
function renderPyGComplet(pyg) {
  const el = document.getElementById("tabla-pyg-completa");
  if (!el) return;

  const h = (cls, label, valor, esNegatiu) => {
    const v = esNegatiu ? `(${fmt(Math.abs(valor))})` : fmt(valor);
    return `<tr class="${cls}"><td>${label}</td><td class="importe">${v}</td></tr>`;
  };
  const sub   = (label)         => `<tr class="sep-bloc"><td colspan="2">${label}</td></tr>`;
  const fila  = (label, v, neg) => h("",            label, v, neg);
  const fsub  = (label, v, neg) => h("grup-total",   `<strong>${label}</strong>`, v, neg);
  const fcl   = (cls, label, v) => `<tr class="resultat-clau ${cls}"><td><strong>${label}</strong></td><td class="importe"><strong>${v >= 0 ? fmt(v) : `(${fmt(-v)})`}</strong></td></tr>`;

  let html = "<thead><tr><th>Partida</th><th class=\"importe\">Import (€)</th></tr></thead><tbody>";

  html += sub("A) OPERACIONS CONTINUADES");
  html += `<tr class="grup-total"><td><strong>1. Import net de la xifra de negocis</strong></td><td class="importe"><strong>${fmt(pyg.totalInxn)}</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Vendes",              pyg.p1a_vendes);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Prestacions de serveis", pyg.p1b_serveis);

  const varPos = pyg.varExist >= 0;
  html += `<tr><td>2. Variació d'existències de productes acabats i en curs</td><td class="importe">${varPos ? fmt(pyg.varExist) : `(${fmt(-pyg.varExist)})`}</td></tr>`;

  html += `<tr class="grup-total"><td><strong>4. Aprovisionaments</strong></td><td class="importe"><strong>(${fmt(pyg.totalAprov)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Consum de mercaderies",              pyg.p4a_mercd,    true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Treballs realitzats per altres empreses", pyg.p4b_treballs, true);

  html += `<tr class="grup-total"><td><strong>5. Altres ingressos d'explotació</strong></td><td class="importe"><strong>${fmt(pyg.altresIng)}</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Ingressos per arrendaments",  pyg.p5a_arrend);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Altres de gestió corrent",    pyg.p5b_gestio);

  html += `<tr class="grup-total"><td><strong>6. Despeses de personal</strong></td><td class="importe"><strong>(${fmt(pyg.totalPersonal)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Sous i salaris",                   pyg.p6a_sous, true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Seguretat Social a càrrec empresa", pyg.p6b_ss,   true);

  html += `<tr class="grup-total"><td><strong>7. Altres despeses d'explotació</strong></td><td class="importe"><strong>(${fmt(pyg.altresDes)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Serveis exteriors",  pyg.p7a_serveis, true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Tributs",            pyg.p7b_tributs, true);

  html += `<tr><td>8. Amortització de l'immobilitzat</td><td class="importe">(${fmt(pyg.amortitzacio)})</td></tr>`;

  html += fcl("baii", "A.1) RESULTAT D'EXPLOTACIÓ (BAII)", pyg.BAII);

  html += `<tr class="grup-total"><td><strong>14. Ingressos financers</strong></td><td class="importe"><strong>${fmt(pyg.ingFin)}</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) De participacions en instruments de patrimoni", pyg.ingFin_a);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) De valors negociables i altres",              pyg.ingFin_b);

  html += `<tr class="grup-total"><td><strong>15. Despeses financeres</strong></td><td class="importe"><strong>(${fmt(pyg.desFin)})</strong></td></tr>`;
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;a) Per deutes amb tercers",              pyg.desFin_a, true);
  html += fila("&nbsp;&nbsp;&nbsp;&nbsp;b) Per actualització de provisions",     pyg.desFin_b, true);

  const dcPos = pyg.difCanvi >= 0;
  html += `<tr><td>17. Diferències de canvi</td><td class="importe">${dcPos ? fmt(pyg.difCanvi) : `(${fmt(-pyg.difCanvi)})`}</td></tr>`;

  html += fcl("bai", "A.2) RESULTAT FINANCER", pyg.resultFin);
  html += fcl("bai", "A.3) RESULTAT ABANS D'IMPOSTOS (A.1 + A.2)", pyg.BAI);
  html += `<tr><td>20. Impost sobre beneficis (25 %)</td><td class="importe">${pyg.impost > 0 ? `(${fmt(pyg.impost)})` : fmt(0)}</td></tr>`;
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
    renderHistoria(generarHistoriaEmpresa(tamanoSelect.value, balance, pyg));
    ocultarTodosLosBloques();
    document.getElementById("bloc-historia").classList.remove("hidden");
    resultado.classList.remove("hidden");
  });

  ocultarTodosLosBloques();
  activarTabs();
}

window.addEventListener("DOMContentLoaded", inicializar);
