// Configuración de cuentas y rangos similar a cuentas.json de Python
const CUENTAS = {
  activo_no_corriente: [
    { grupo: "Inmovilizado intangible", nombre: "Aplicaciones informáticas", peso_min: 0.10, peso_max: 0.40 },
    { grupo: "Inmovilizado intangible", nombre: "Propiedad industrial", peso_min: 0.02, peso_max: 0.15 },

    { grupo: "Inmovilizado material", nombre: "Construcciones", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Inmovilizado material", nombre: "Elementos de transporte", peso_min: 0.02, peso_max: 0.15 },
    { grupo: "Inmovilizado material", nombre: "Mobiliario y enseres", peso_min: 0.02, peso_max: 0.15 },

    { grupo: "Inversiones financieras a largo plazo", nombre: "Participaciones en empresas del grupo y asociadas", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Inversiones financieras a largo plazo", nombre: "Otros valores representativos de deuda a largo plazo", peso_min: 0.0, peso_max: 0.08 },
  ],
  activo_corriente: [
    { grupo: "Existencias", nombre: "Existencias de mercaderías", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Existencias", nombre: "Existencias de productos terminados", peso_min: 0.0, peso_max: 0.10 },

    { grupo: "Deudores comerciales", nombre: "Clientes", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Deudores comerciales", nombre: "Deudores varios", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Deudores comerciales", nombre: "Hacienda Pública deudora", peso_min: 0.0, peso_max: 0.08 },

    { grupo: "Inversiones financieras a corto plazo", nombre: "Inversiones financieras a corto plazo", peso_min: 0.0, peso_max: 0.20 },

    { grupo: "Efectivo y otros activos líquidos equivalentes", nombre: "Tesorería (caja y bancos)", peso_min: 0.01, peso_max: 0.25 },
  ],
  patrimonio_neto: [
    { grupo: "Fondos propios", nombre: "Capital social", peso_min: 0.20, peso_max: 0.60 },
    { grupo: "Fondos propios", nombre: "Prima de emisión y aportaciones de socios", peso_min: 0.0, peso_max: 0.05 },
    { grupo: "Fondos propios", nombre: "Reservas", peso_min: 0.0, peso_max: 0.30 },
    { grupo: "Fondos propios", nombre: "Resultados de ejercicios anteriores", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Fondos propios", nombre: "Resultado del ejercicio", peso_min: 0.0, peso_max: 0.08 },
  ],
  pasivo_no_corriente: [
    { grupo: "Deudas a largo plazo", nombre: "Deudas con entidades de crédito a largo plazo", peso_min: 0.05, peso_max: 0.30 },
    { grupo: "Deudas a largo plazo", nombre: "Deudas con empresas del grupo y asociadas a largo plazo", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Deudas a largo plazo", nombre: "Otras deudas a largo plazo", peso_min: 0.0, peso_max: 0.15 },
    { grupo: "Provisiones a largo plazo", nombre: "Provisiones a largo plazo", peso_min: 0.0, peso_max: 0.10 },
  ],
  pasivo_corriente: [
    { grupo: "Acreedores comerciales", nombre: "Proveedores", peso_min: 0.05, peso_max: 0.25 },
    { grupo: "Acreedores comerciales", nombre: "Acreedores varios", peso_min: 0.0, peso_max: 0.15 },

    { grupo: "Administraciones Públicas", nombre: "Hacienda Pública acreedora", peso_min: 0.0, peso_max: 0.10 },
    { grupo: "Administraciones Públicas", nombre: "Organismos de la Seguridad Social acreedores", peso_min: 0.0, peso_max: 0.08 },

    { grupo: "Deudas financieras a corto plazo", nombre: "Deudas con entidades de crédito a corto plazo", peso_min: 0.02, peso_max: 0.25 },
    { grupo: "Otras deudas a corto plazo", nombre: "Otras deudas a corto plazo", peso_min: 0.0, peso_max: 0.15 },
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
  { grupo: "Explotación", nombre: "Importe neto de la cifra de negocios", peso_min: 0.60, peso_max: 0.85 },
  { grupo: "Explotación", nombre: "Otros ingresos de explotación", peso_min: 0.00, peso_max: 0.10 },
  { grupo: "Financieros", nombre: "Ingresos financieros", peso_min: 0.00, peso_max: 0.05 },
  { grupo: "Extraordinarios", nombre: "Ingresos extraordinarios", peso_min: 0.00, peso_max: 0.05 },
];

const PYG_GASTOS = [
  { grupo: "Consumos y personal", nombre: "Consumos de explotación", peso_min: 0.30, peso_max: 0.55 },
  { grupo: "Consumos y personal", nombre: "Gastos de personal", peso_min: 0.10, peso_max: 0.25 },
  { grupo: "Estructura", nombre: "Otros gastos de explotación", peso_min: 0.05, peso_max: 0.15 },
  { grupo: "Amortizaciones y provisiones", nombre: "Amortizaciones y provisiones", peso_min: 0.02, peso_max: 0.10 },
  { grupo: "Financieros", nombre: "Gastos financieros", peso_min: 0.00, peso_max: 0.06 },
  { grupo: "Extraordinarios", nombre: "Gastos e impuestos extraordinarios", peso_min: 0.00, peso_max: 0.04 },
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

  // Tomamos una escala de ventas netas razonable (p.ej. 70.000 - 2.000.000 €)
  const ventasNetas = rand() * (2000000 - 70000) + 70000;

  // Ingresos totales algo superiores o iguales a ventas netas
  const totalIngresos = ventasNetas * (1 + rand() * 0.2);
  const ingresos = distribuirPorPesos(totalIngresos, PYG_INGRESOS, rand);

  // Gastos totales en torno al 70-95% de los ingresos (resultado positivo o ajustado)
  const margen = 0.05 + rand() * 0.25; // resultado entre 5% y 30% de ventas aproximadamente
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
    errores.push(`El balance no está cuadrado: activo=${activo.toFixed(2)} vs PN+Pasivo=${(pn + pasivo).toFixed(2)}`);
  }
  if (activo <= 0) {
    errores.push("El activo total debe ser positivo.");
  }
  if (pn < 0) {
    errores.push("El patrimonio neto no puede ser negativo en el modo estándar.");
  }
  if (pasivo > 3 * activo) {
    errores.push("El pasivo total es desproporcionado respecto al activo (posible incoherencia económica).");
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
  return n.toLocaleString("es-ES", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function renderTablaAgrupada(elementId, cuentas) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // Agrupar por grupo (submasa)
  const grupos = {};
  cuentas.forEach((c) => {
    const g = c.grupo || "Otros";
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(c);
  });

  let html = "<thead><tr><th>Submasa / Cuenta</th><th class=\"importe\">Importe (€)</th></tr></thead><tbody>";
  Object.keys(grupos).forEach((grupo) => {
    const partidas = grupos[grupo];
    const subtotal = sumar(partidas);
    html += `<tr class="grupo"><td><strong>${grupo}</strong></td><td class="importe"><strong>${formatearNumero(subtotal)}</strong></td></tr>`;
    partidas.forEach((c) => {
      html += `<tr><td>&nbsp;&nbsp;&nbsp;${c.nombre}</td><td class="importe">${formatearNumero(c.amount)}</td></tr>`;
    });
  });

  const total = sumar(cuentas);
  html += `<tr><td><strong>Total sección</strong></td><td class="importe"><strong>${formatearNumero(total)}</strong></td></tr>`;
  html += "</tbody>";
  el.innerHTML = html;
}

function renderTablaSimplePyG(elementId, partidas) {
  const el = document.getElementById(elementId);
  if (!el) return;

  const grupos = {};
  partidas.forEach((p) => {
    const g = p.grupo || "Otros";
    if (!grupos[g]) grupos[g] = [];
    grupos[g].push(p);
  });

  let html = "<thead><tr><th>Grupo / Partida</th><th class=\"importe\">Importe (€)</th></tr></thead><tbody>";
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
    cont.innerHTML = '<div class="alert ok">Balance válido: la ecuación patrimonial se cumple (diferencias solo por redondeo).</div>';
  } else {
    let html = '<div class="alert error"><strong>Balance NO válido:</strong><ul>';
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

    document.getElementById("pyg-ventas").textContent = formatearNumero(pyg.ventasNetas);
    document.getElementById("pyg-gastos").textContent = formatearNumero(pyg.totalGastos);
    document.getElementById("pyg-resultado").textContent = formatearNumero(pyg.resultado);

    renderTablaSimplePyG("tabla-pyg-ing", pyg.ingresos);
    renderTablaSimplePyG("tabla-pyg-gas", pyg.gastos);

    resultado.classList.remove("hidden");
  });

  activarTabs();
}

window.addEventListener("DOMContentLoaded", inicializar);
