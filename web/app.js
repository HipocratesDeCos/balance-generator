// Configuración de cuentas y rangos similar a cuentas.json de Python
const CUENTAS = {
  activo_no_corriente: [
    { nombre: "Inmovilizado intangible (patentes, licencias, aplicaciones informáticas)", peso_min: 0.02, peso_max: 0.08 },
    { nombre: "Inmovilizado material (terrenos y construcciones)", peso_min: 0.05, peso_max: 0.20 },
    { nombre: "Inmovilizado material (instalaciones técnicas y maquinaria)", peso_min: 0.05, peso_max: 0.25 },
    { nombre: "Inmovilizado material (mobiliario y equipos informáticos)", peso_min: 0.02, peso_max: 0.10 },
    { nombre: "Inversiones financieras a largo plazo (participaciones)", peso_min: 0.0, peso_max: 0.08 },
    { nombre: "Inversiones financieras a largo plazo (valores representativos de deuda)", peso_min: 0.0, peso_max: 0.05 },
  ],
  activo_corriente: [
    { nombre: "Existencias de mercaderías", peso_min: 0.05, peso_max: 0.25 },
    { nombre: "Existencias de productos terminados", peso_min: 0.0, peso_max: 0.10 },
    { nombre: "Clientes", peso_min: 0.05, peso_max: 0.25 },
    { nombre: "Deudores varios", peso_min: 0.0, peso_max: 0.10 },
    { nombre: "Hacienda Pública deudora", peso_min: 0.0, peso_max: 0.08 },
    { nombre: "Inversiones financieras a corto plazo", peso_min: 0.0, peso_max: 0.20 },
    { nombre: "Tesorería (caja y bancos)", peso_min: 0.01, peso_max: 0.25 },
  ],
  patrimonio_neto: [
    { nombre: "Capital social", peso_min: 0.20, peso_max: 0.60 },
    { nombre: "Prima de emisión y aportaciones de socios", peso_min: 0.0, peso_max: 0.05 },
    { nombre: "Reservas", peso_min: 0.0, peso_max: 0.30 },
    { nombre: "Resultados de ejercicios anteriores", peso_min: 0.0, peso_max: 0.10 },
    { nombre: "Resultado del ejercicio", peso_min: 0.0, peso_max: 0.08 },
  ],
  pasivo_no_corriente: [
    { nombre: "Deudas con entidades de crédito a largo plazo", peso_min: 0.05, peso_max: 0.30 },
    { nombre: "Deudas con empresas del grupo y asociadas a largo plazo", peso_min: 0.0, peso_max: 0.10 },
    { nombre: "Otras deudas a largo plazo", peso_min: 0.0, peso_max: 0.15 },
    { nombre: "Provisiones a largo plazo", peso_min: 0.0, peso_max: 0.10 },
  ],
  pasivo_corriente: [
    { nombre: "Proveedores", peso_min: 0.05, peso_max: 0.25 },
    { nombre: "Acreedores varios", peso_min: 0.0, peso_max: 0.15 },
    { nombre: "Hacienda Pública acreedora", peso_min: 0.0, peso_max: 0.10 },
    { nombre: "Organismos de la Seguridad Social acreedores", peso_min: 0.0, peso_max: 0.08 },
    { nombre: "Deudas con entidades de crédito a corto plazo", peso_min: 0.02, peso_max: 0.25 },
    { nombre: "Otras deudas a corto plazo", peso_min: 0.0, peso_max: 0.15 },
  ],
};

const RANGOS_ACTIVO = {
  micro: [10000, 250000],
  pyme: [250000, 5000000],
  mediana: [5000000, 20000000],
  grande: [20000000, 200000000],
};

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
    return cuentasConf.map((cfg) => ({ nombre: cfg.nombre, amount: total * equit }));
  }
  return cuentasConf.map((cfg, i) => ({
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

function renderTabla(elementId, cuentas) {
  const el = document.getElementById(elementId);
  if (!el) return;
  const total = sumar(cuentas);
  let html = "<thead><tr><th>Cuenta</th><th class=\"importe\">Importe (€)</th></tr></thead><tbody>";
  cuentas.forEach((c) => {
    html += `<tr><td>${c.nombre}</td><td class="importe">${formatearNumero(c.amount)}</td></tr>`;
  });
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
  const btn = document.getElementById("btn-generar");
  const resultado = document.getElementById("resultado");
  const tamanoSelect = document.getElementById("tamano");
  const semillaInput = document.getElementById("semilla");

  btn.addEventListener("click", () => {
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

    renderTabla("tabla-anc", balance.activo_no_corriente);
    renderTabla("tabla-ac", balance.activo_corriente);
    renderTabla("tabla-pn", balance.patrimonio_neto);
    renderTabla("tabla-pnc", balance.pasivo_no_corriente);
    renderTabla("tabla-pc", balance.pasivo_corriente);

    resultado.classList.remove("hidden");
  });

  activarTabs();
}

window.addEventListener("DOMContentLoaded", inicializar);
