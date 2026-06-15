from dataclasses import dataclass, field
from typing import List

from .cuenta import Cuenta


@dataclass
class Balance:
    """Modelo de balance de situación simplificado según PGC español."""

    activo_no_corriente: List[Cuenta] = field(default_factory=list)
    activo_corriente: List[Cuenta] = field(default_factory=list)

    patrimonio_neto: List[Cuenta] = field(default_factory=list)
    pasivo_no_corriente: List[Cuenta] = field(default_factory=list)
    pasivo_corriente: List[Cuenta] = field(default_factory=list)

    def total_activo(self) -> float:
        return sum(c.amount for c in self.activo_no_corriente + self.activo_corriente)

    def total_patrimonio_neto(self) -> float:
        return sum(c.amount for c in self.patrimonio_neto)

    def total_pasivo(self) -> float:
        return sum(c.amount for c in self.pasivo_no_corriente + self.pasivo_corriente)

    def total_pn_y_pasivo(self) -> float:
        return self.total_patrimonio_neto() + self.total_pasivo()

    # Ratios básicos
    def fondo_de_maniobra(self) -> float:
        return sum(c.amount for c in self.activo_corriente) - sum(
            c.amount for c in self.pasivo_corriente
        )

    def ratio_liquidez(self) -> float:
        pasivo_corr = sum(c.amount for c in self.pasivo_corriente)
        if pasivo_corr == 0:
            return float("inf")
        return sum(c.amount for c in self.activo_corriente) / pasivo_corr

    def ratio_solvencia(self) -> float:
        pasivo_total = self.total_pasivo()
        if pasivo_total == 0:
            return float("inf")
        return self.total_activo() / pasivo_total

    def ratio_endeudamiento(self) -> float:
        pn = self.total_patrimonio_neto()
        if pn == 0:
            return float("inf")
        return self.total_pasivo() / pn
