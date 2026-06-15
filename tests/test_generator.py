import pytest

from services.generator import BalanceGenerator
from services.validator import validar_balance


def generar_balance_valido(tamanio="pyme"):
    gen = BalanceGenerator(seed=42)
    bal = gen.generar_balance(tamanio=tamanio)
    ok, errores = validar_balance(bal)
    assert ok, f"Balance generado no válido: {errores}"
    return bal


def test_balance_cuadrado():
    bal = generar_balance_valido()
    assert abs(bal.total_activo() - bal.total_pn_y_pasivo()) < 0.5


def test_activo_positivo():
    bal = generar_balance_valido()
    assert bal.total_activo() > 0


def test_patrimonio_neto_no_negativo():
    bal = generar_balance_valido()
    assert bal.total_patrimonio_neto() >= 0


def test_ratios_calculados():
    bal = generar_balance_valido()
    assert isinstance(bal.fondo_de_maniobra(), float)
    assert isinstance(bal.ratio_liquidez(), float)
    assert isinstance(bal.ratio_solvencia(), float)
    assert isinstance(bal.ratio_endeudamiento(), float)


def test_generacion_micro_pyme_mediana_grande():
    for t in ["micro", "pyme", "mediana", "grande"]:
        bal = generar_balance_valido(tamanio=t)
        assert bal.total_activo() > 0


def test_validator_detecta_descuadre():
    gen = BalanceGenerator(seed=1)
    bal = gen.generar_balance()
    bal.activo_corriente[0].amount += 1000
    ok, errores = validar_balance(bal)
    assert not ok
    assert any("no está cuadrado" in e for e in errores)


def test_fondo_de_maniobra_tipo():
    bal = generar_balance_valido()
    fm = bal.fondo_de_maniobra()
    assert isinstance(fm, float)


def test_ratio_liquidez_tipo():
    bal = generar_balance_valido()
    rl = bal.ratio_liquidez()
    assert isinstance(rl, float)


def test_ratio_endeudamiento_tipo():
    bal = generar_balance_valido()
    re = bal.ratio_endeudamiento()
    assert isinstance(re, float)
