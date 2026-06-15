from typing import Tuple, List

from models.balance import Balance


class BalanceValidationError(Exception):
    pass


def validar_balance(balance: Balance, tolerancia: float = 0.5) -> Tuple[bool, List[str]]:
    """Valida que el balance esté cuadrado y dentro de rangos razonables.

    tolerancia: diferencia máxima permitida entre activo y PN+Pasivo por redondeos.
    """

    errores: list[str] = []

    activo = balance.total_activo()
    pn_y_pasivo = balance.total_pn_y_pasivo()

    if abs(activo - pn_y_pasivo) > tolerancia:
        errores.append(
            f"El balance no está cuadrado: activo={activo:.2f} vs PN+Pasivo={pn_y_pasivo:.2f}"
        )

    if activo <= 0:
        errores.append("El activo total debe ser positivo.")

    if balance.total_patrimonio_neto() < 0:
        errores.append("El patrimonio neto no puede ser negativo en el modo estándar.")

    if balance.total_pasivo() > 3 * activo:
        errores.append(
            "El pasivo total es desproporcionado respecto al activo (posible incoherencia económica)."
        )

    return (len(errores) == 0, errores)
