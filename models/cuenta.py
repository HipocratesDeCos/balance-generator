from dataclasses import dataclass
from typing import Literal, Optional


SeccionTipo = Literal[
    "activo_no_corriente",
    "activo_corriente",
    "patrimonio_neto",
    "pasivo_no_corriente",
    "pasivo_corriente",
]


@dataclass
class Cuenta:
    """Representa una cuenta individual del balance.

    amount expresa el saldo en euros (>= 0).
    section indica el bloque principal del balance según PGC.
    grupo (opcional) permite agrupar cuentas en submasas (por ejemplo,
    "Inmovilizado intangible", "Inmovilizado material", etc.),
    manteniendo la suma de partidas = importe de la submasa.
    """

    nombre: str
    section: SeccionTipo
    amount: float
    grupo: Optional[str] = None
