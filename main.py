from services.generator import BalanceGenerator, balance_a_dict
from services.validator import validar_balance


def main() -> None:
    gen = BalanceGenerator()
    bal = gen.generar_balance(tamanio="pyme")
    ok, errores = validar_balance(bal)
    data = balance_a_dict(bal)

    print("=== BALANCE GENERADO ===")
    print(f"Total activo: {data['totales']['activo']:.2f} €")
    print(f"PN + Pasivo: {data['totales']['patrimonio_neto'] + data['totales']['pasivo']:.2f} €")
    print("Balance válido" if ok else "Balance NO válido")
    if errores:
        print("Errores:")
        for e in errores:
            print(" -", e)


if __name__ == "__main__":
    main()
