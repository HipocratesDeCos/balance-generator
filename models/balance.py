"""
models/balance.py
Defineix la classe Balance que representa un balanç de situació
seguint l'estructura del Pla General de Comptabilitat (PGC) espanyol.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import List
from models.cuenta import Cuenta


@dataclass
class Balance:
    """
    Representa un balanç de situació complet.

    Atributs
    --------
    activo_no_corriente : List[Cuenta]
        Partides de l'actiu no corrent (immobilitzat, inversions a llarg termini…).
    activo_corriente : List[Cuenta]
        Partides de l'actiu corrent (existències, deutors, tresoreria…).
    patrimonio_neto : List[Cuenta]
        Partides del patrimoni net (capital social, reserves, resultat…).
    pasivo_no_corriente : List[Cuenta]
        Partides del passiu no corrent (deutes a llarg termini, provisions…).
    pasivo_corriente : List[Cuenta]
        Partides del passiu corrent (proveïdors, creditors, deutes a curt termini…).
    """

    activo_no_corriente: List[Cuenta] = field(default_factory=list)
    activo_corriente: List[Cuenta] = field(default_factory=list)
    patrimonio_neto: List[Cuenta] = field(default_factory=list)
    pasivo_no_corriente: List[Cuenta] = field(default_factory=list)
    pasivo_corriente: List[Cuenta] = field(default_factory=list)

    # ------------------------------------------------------------------
    # Totals per secció
    # ------------------------------------------------------------------

    def total_activo_no_corriente(self) -> float:
        """Retorna la suma de totes les partides de l'actiu no corrent."""
        return sum(c.amount for c in self.activo_no_corriente)

    def total_activo_corriente(self) -> float:
        """Retorna la suma de totes les partides de l'actiu corrent."""
        return sum(c.amount for c in self.activo_corriente)

    def total_activo(self) -> float:
        """Retorna l'actiu total (ANC + AC)."""
        return self.total_activo_no_corriente() + self.total_activo_corriente()

    def total_patrimonio_neto(self) -> float:
        """Retorna la suma de totes les partides del patrimoni net."""
        return sum(c.amount for c in self.patrimonio_neto)

    def total_pasivo_no_corriente(self) -> float:
        """Retorna la suma de totes les partides del passiu no corrent."""
        return sum(c.amount for c in self.pasivo_no_corriente)

    def total_pasivo_corriente(self) -> float:
        """Retorna la suma de totes les partides del passiu corrent."""
        return sum(c.amount for c in self.pasivo_corriente)

    def total_pasivo(self) -> float:
        """Retorna el passiu total (PNC + PC)."""
        return self.total_pasivo_no_corriente() + self.total_pasivo_corriente()

    def total_pn_y_pasivo(self) -> float:
        """Retorna la suma del patrimoni net i el passiu total (ha d'igualar l'actiu total)."""
        return self.total_patrimonio_neto() + self.total_pasivo()

    # ------------------------------------------------------------------
    # Ràtios financeres
    # ------------------------------------------------------------------

    def fondo_de_maniobra(self) -> float:
        """
        Calcula el fons de maniobra (FM).

        FM = Actiu corrent − Passiu corrent

        Un valor positiu indica que l'empresa pot atendre els deutes a curt
        termini amb els seus actius corrents.
        """
        return self.total_activo_corriente() - self.total_pasivo_corriente()

    def ratio_liquidez(self) -> float:
        """
        Calcula el ràtio de liquiditat general.

        Liquiditat = Actiu corrent / Passiu corrent

        Valors recomanables: entre 1,5 i 2. Per sota d'1 pot indicar
        problemes de pagament a curt termini.
        """
        pc = self.total_pasivo_corriente()
        return self.total_activo_corriente() / pc if pc else float("inf")

    def ratio_solvencia(self) -> float:
        """
        Calcula el ràtio de solvència total.

        Solvència = Actiu total / Passiu total

        Indica la capacitat de l'empresa per fer front a la totalitat dels
        seus deutes amb tots els seus actius.
        """
        pasivo = self.total_pasivo()
        return self.total_activo() / pasivo if pasivo else float("inf")

    def ratio_endeudamiento(self) -> float:
        """
        Calcula el ràtio d'endeutament.

        Endeutament = Passiu total / Patrimoni net

        Mesura el grau de dependència de finançament aliè respecte als
        recursos propis. Valors per sobre de 2 solen considerar-se elevats.
        """
        pn = self.total_patrimonio_neto()
        return self.total_pasivo() / pn if pn else float("inf")

    # ------------------------------------------------------------------
    # Representació
    # ------------------------------------------------------------------

    def __repr__(self) -> str:
        return (
            f"Balance("
            f"actiu={self.total_activo():.2f} €, "
            f"PN={self.total_patrimonio_neto():.2f} €, "
            f"passiu={self.total_pasivo():.2f} €, "
            f"FM={self.fondo_de_maniobra():.2f} €)"
        )
