import json
import os
import random
from typing import Literal, Dict, Any

from models.balance import Balance
from models.cuenta import Cuenta


TamanioEmpresa = Literal["micro", "pyme", "mediana", "grande"]

# Rangos de activo total por tamaño
RANGOS_ACTIVO = {
    "micro": (10_000, 250_000),
    "pyme": (250_000, 5_000_000),
    "mediana": (5_000_000, 20_000_000),
    "grande": (20_000_000, 200_000_000),
}


class BalanceGenerator:
    def __init__(self, cuentas_path: str | None = None, seed: int | None = None) -> None:
        if seed is not None:
            random.seed(seed)
        if cuentas_path is None:
            base = os.path.dirname(os.path.dirname(__file__))
            cuentas_path = os.path.join(base, "data", "cuentas.json")
        with open(cuentas_path, "r", encoding="utf-8") as f:
            self.cuentas_cfg = json.load(f)

    def _random_total_activo(self, tamanio: TamanioEmpresa) -> float:
        minimo, maximo = RANGOS_ACTIVO[tamanio]
        return random.uniform(minimo, maximo)

    def _distribuir_por_pesos(self, total: float, seccion: str) -> list[Cuenta]:
        cuentas_conf = self.cuentas_cfg[seccion]
        pesos = []
        for cfg in cuentas_conf:
            peso = random.uniform(cfg["peso_min"], cfg["peso_max"])
            pesos.append(peso)
        suma_pesos = sum(pesos)
        if suma_pesos == 0:
            pesos = [1 / len(cuentas_conf)] * len(cuentas_conf)
            suma_pesos = 1
        cuentas: list[Cuenta] = []
        for cfg, peso in zip(cuentas_conf, pesos):
            amount = total * (peso / suma_pesos)
            cuentas.append(
                Cuenta(
                    nombre=cfg["nombre"],
                    section=seccion,
                    amount=round(amount, 2),
                    grupo=cfg.get("grupo"),
                )
            )
        return cuentas

    def generar_balance(self, tamanio: TamanioEmpresa = "pyme") -> Balance:
        """Genera un balance cuadrado y coherente a nivel básico.

        La jerarquía de importes se controla así:
        - Primero se genera el total de la masa (por ejemplo, activo no corriente).
        - Ese total se reparte entre las partidas de la sección mediante pesos.
        - Las submasas (grupo) se obtienen como suma de las partidas que las integran.

        De este modo, la suma de partidas = importe de la submasa y la suma de submasas =
        importe total de la masa, respetando la ecuación patrimonial global.
        """

        total_activo = self._random_total_activo(tamanio)

        if tamanio == "micro":
            propor_anc = random.uniform(0.10, 0.40)
        elif tamanio == "pyme":
            propor_anc = random.uniform(0.30, 0.60)
        else:
            propor_anc = random.uniform(0.40, 0.75)
        total_anc = total_activo * propor_anc
        total_ac = total_activo - total_anc

        anc_cuentas = self._distribuir_por_pesos(total_anc, "activo_no_corriente")
        ac_cuentas = self._distribuir_por_pesos(total_ac, "activo_corriente")

        if tamanio == "micro":
            ratio_deuda_pn = random.uniform(0.2, 1.5)
        elif tamanio == "pyme":
            ratio_deuda_pn = random.uniform(0.5, 2.0)
        else:
            ratio_deuda_pn = random.uniform(0.8, 2.5)

        pn = total_activo / (1 + ratio_deuda_pn)
        deuda_total = total_activo - pn

        pn_cuentas = self._distribuir_por_pesos(pn, "patrimonio_neto")

        if tamanio in ("micro", "pyme"):
            propor_pnc = random.uniform(0.3, 0.6)
        else:
            propor_pnc = random.uniform(0.5, 0.8)
        total_pnc = deuda_total * propor_pnc
        total_pc = deuda_total - total_pnc

        pnc_cuentas = self._distribuir_por_pesos(total_pnc, "pasivo_no_corriente")
        pc_cuentas = self._distribuir_por_pesos(total_pc, "pasivo_corriente")

        balance = Balance(
            activo_no_corriente=anc_cuentas,
            activo_corriente=ac_cuentas,
            patrimonio_neto=pn_cuentas,
            pasivo_no_corriente=pnc_cuentas,
            pasivo_corriente=pc_cuentas,
        )
        return balance


def balance_a_dict(balance: Balance) -> Dict[str, Any]:
    def cuentas_to_list(cuentas):
        return [
            {
                "nombre": c.nombre,
                "section": c.section,
                "amount": c.amount,
                "grupo": c.grupo,
            }
            for c in cuentas
        ]

    return {
        "activo_no_corriente": cuentas_to_list(balance.activo_no_corriente),
        "activo_corriente": cuentas_to_list(balance.activo_corriente),
        "patrimonio_neto": cuentas_to_list(balance.patrimonio_neto),
        "pasivo_no_corriente": cuentas_to_list(balance.pasivo_no_corriente),
        "pasivo_corriente": cuentas_to_list(balance.pasivo_corriente),
        "totales": {
            "activo": balance.total_activo(),
            "patrimonio_neto": balance.total_patrimonio_neto(),
            "pasivo": balance.total_pasivo(),
        },
    }
