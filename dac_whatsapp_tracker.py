"""
DAC -> WhatsApp: notifica a los clientes de Simba Kids por WhatsApp
cada vez que cambia el estado de su envio en DAC.

Como funciona (resumen):
1. Se loguea en la API de DAC (wsLogin).
2. Pide la lista de guias (envios) activas de los ultimos dias (wsObtieneGuiasCliente).
3. Compara el estado de cada guia contra lo guardado en state.json (la ultima vez que corrio).
4. Si el estado cambio, busca el detalle completo (wsRastreoGuia) para sacar el
   nombre del destinatario y, si esta disponible, el telefono.
5. Busca o crea el contacto en Optimify (GoHighLevel) por telefono, y le manda
   un WhatsApp con la novedad.
6. Guarda el nuevo estado en state.json para no mandar el mismo mensaje dos veces.

Este script esta pensado para correr solo, disparado por GitHub Actions
cada cierto tiempo (ver .github/workflows/track.yml).
"""

import json
import os
import sys
from datetime import datetime, timedelta

import requests

# ---------------------------------------------------------------------------
# Configuracion (todo esto sale de GitHub Secrets, nunca hardcodeado)
# ---------------------------------------------------------------------------

DAC_LOGIN = os.environ["DAC_LOGIN"]
DAC_PASSWORD = os.environ["DAC_PASSWORD"]
# "uat" para pruebas, "prod" para produccion real
DAC_ENV = os.environ.get("DAC_ENV", "prod")

OPTIMIFY_API_KEY = os.environ["OPTIMIFY_API_KEY"]
OPTIMIFY_LOCATION_ID = os.environ["OPTIMIFY_LOCATION_ID"]

# Si esta en modo prueba, no manda WhatsApp de verdad, solo muestra en el log lo que mandaria.
# Util para probar sin gastar mensajes reales mientras se aprueba la plantilla de WhatsApp.
DRY_RUN = os.environ.get("DRY_RUN", "0").strip().lower() in ("1", "true", "yes")

STATE_FILE = "state.json"

DAC_HOSTS = {
    "uat": "https://uat.sge.dac.com.uy",
    "prod": "https://www.sge.dac.com.uy",
}
DAC_BASE_URL = f"{DAC_HOSTS[DAC_ENV]}/JAgencia/JAgencia.asmx"

GHL_BASE_URL = "https://services.leadconnectorhq.com"
GHL_API_VERSION = "2021-07-28"

# Cuantos dias hacia atras revisar guias (para agarrar envios que siguen en camino)
DIAS_A_REVISAR = 5

# Traduccion de estados de DAC a un mensaje mas humano para el cliente.
# Si un estado no esta en este diccionario, se manda el nombre tal cual viene de DAC.
MENSAJES_POR_ESTADO = {
    "REGISTRADA": "Registramos tu pedido en DAC, pronto sale en camino.",
    "DESEMBARCADO": "Tu pedido llego a la sucursal de destino.",
    "PROXIMO A SALIR A REPARTO": "Tu pedido esta por salir a reparto.",
    "EN REPARTO": "Tu pedido salio a reparto, ya llega!",
    "EN RUTA": "Tu pedido esta en camino.",
    "ENTREGADA": "Tu pedido fue entregado. Gracias por tu compra!",
    "RECHAZADA POR OPERADOR": "Hubo un inconveniente con tu envio, nos estamos comunicando con DAC para resolverlo.",
}


def log(msg: str) -> None:
    print(f"[{datetime.now().isoformat(timespec='seconds')}] {msg}", flush=True)


# ---------------------------------------------------------------------------
# DAC
# ---------------------------------------------------------------------------

def dac_login() -> tuple[str, str]:
    """Devuelve (ID_Sesion, K_Cliente)."""
    r = requests.post(
        f"{DAC_BASE_URL}/wsLogin",
        json={"Login": DAC_LOGIN, "Contrasenia": DAC_PASSWORD},
        timeout=30,
    )
    r.raise_for_status()
    data = r.json()
    payload = data.get("data")
    if isinstance(payload, list):
        payload = payload[0]
    if not payload or not payload.get("ID_Session"):
        raise RuntimeError(f"No se pudo iniciar sesion en DAC: {data}")
    return payload["ID_Session"], str(payload["K_Cliente"])


def dac_guias_recientes(id_sesion: str, k_cliente: str) -> list[dict]:
    """Trae las guias (envios) de los ultimos DIAS_A_REVISAR dias."""
    hoy = datetime.now()
    desde = hoy - timedelta(days=DIAS_A_REVISAR)
    r = requests.post(
        f"{DAC_BASE_URL}/wsObtieneGuiasCliente",
        json={
            "K_Cliente": k_cliente,
            "Busqueda": "0",
            "FI": desde.strftime("%Y-%m-%d"),
            "FF": hoy.strftime("%Y-%m-%d"),
            "RUT": "",
            "ID_Sesion": id_sesion,
        },
        timeout=30,
    )
    r.raise_for_status()
    data = r.json()
    payload = data.get("data") or []
    if isinstance(payload, dict):
        payload = [payload]
    return payload


def dac_rastreo_guia(id_sesion: str, k_guia: str, k_oficina_origen: str = "") -> dict:
    """Trae el detalle completo de una guia puntual (para sacar telefono/destinatario).

    Si DAC devuelve un error (por ejemplo, falta la oficina de origen), 'data'
    puede venir como texto en vez de objeto. En ese caso devolvemos {} y logueamos
    el motivo, en vez de romper el script.
    """
    r = requests.post(
        f"{DAC_BASE_URL}/wsRastreoGuia",
        json={
            "K_Oficina_Origen": k_oficina_origen,
            "K_Guia": k_guia,
            "Referencia": "",
            "ID_Sesion": id_sesion,
        },
        timeout=30,
    )
    r.raise_for_status()
    data = r.json()
    payload = data.get("data") or {}
    if isinstance(payload, list):
        payload = payload[0] if payload else {}
    if not isinstance(payload, dict):
        log(f"  AVISO: wsRastreoGuia para guia {k_guia} no devolvio un detalle utilizable: {data}")
        return {}
    return payload


def buscar_telefono(detalle_guia: dict) -> str | None:
    """
    Busca el telefono del DESTINATARIO (cliente), no el del remitente (Simba Kids).

    wsObtieneGuiasCliente devuelve el campo 'Telefono_Destinatario' (a veces vacio,
    si no se cargo al hacer el envio). Priorizamos ese campo exacto; si no esta,
    buscamos cualquier otro campo que mencione telefono pero que NO sea del
    remitente/emisor.
    """
    valor_directo = detalle_guia.get("Telefono_Destinatario")
    if valor_directo:
        return str(valor_directo)

    for key, value in detalle_guia.items():
        key_lower = key.lower()
        if "remitente" in key_lower or "emisor" in key_lower:
            continue  # ese telefono es el nuestro (Simba Kids), no el del cliente
        if ("telefono" in key_lower or "phone" in key_lower or "celular" in key_lower) and value:
            return str(value)
    return None


# ---------------------------------------------------------------------------
# Optimify / GoHighLevel
# ---------------------------------------------------------------------------

def ghl_headers() -> dict:
    return {
        "Authorization": f"Bearer {OPTIMIFY_API_KEY}",
        "Version": GHL_API_VERSION,
        "Content-Type": "application/json",
    }


def normalizar_telefono_uy(telefono: str) -> str:
    """Convierte un telefono uruguayo a formato internacional +598XXXXXXXX.

    A veces DAC guarda mas de un numero separado por '/' o ','; usamos el primero.
    """
    primero = telefono.split("/")[0].split(",")[0].strip()
    limpio = "".join(ch for ch in primero if ch.isdigit() or ch == "+")
    if limpio.startswith("+598"):
        return limpio
    if limpio.startswith("598"):
        return "+" + limpio
    if limpio.startswith("0"):
        return "+598" + limpio[1:]
    return "+598" + limpio


def ghl_buscar_o_crear_contacto(nombre: str, telefono: str) -> str | None:
    """Busca un contacto por telefono; si no existe, lo crea. Devuelve el contactId."""
    telefono_norm = normalizar_telefono_uy(telefono)

    # 1) upsert: crea el contacto si no existe, o lo actualiza si ya existia
    #    (usa el telefono como identificador unico).
    r = requests.post(
        f"{GHL_BASE_URL}/contacts/upsert",
        headers=ghl_headers(),
        json={
            "locationId": OPTIMIFY_LOCATION_ID,
            "name": nombre,
            "phone": telefono_norm,
            "source": "DAC WhatsApp Tracking",
        },
        timeout=30,
    )
    if r.status_code >= 300:
        log(f"  ERROR creando/actualizando contacto en Optimify: {r.status_code} {r.text}")
        return None

    data = r.json()
    contacto = data.get("contact") or data
    return contacto.get("id")


def ghl_enviar_whatsapp(contact_id: str, mensaje: str) -> bool:
    if DRY_RUN:
        log(f"  [DRY RUN] Se mandaria WhatsApp a contactId={contact_id}: {mensaje!r}")
        return True

    r = requests.post(
        f"{GHL_BASE_URL}/conversations/messages",
        headers=ghl_headers(),
        json={
            "type": "WhatsApp",
            "contactId": contact_id,
            "message": mensaje,
        },
        timeout=30,
    )
    if r.status_code >= 300:
        log(f"  ERROR mandando WhatsApp: {r.status_code} {r.text}")
        return False
    return True


# ---------------------------------------------------------------------------
# Estado (para no mandar el mismo mensaje dos veces)
# ---------------------------------------------------------------------------

def cargar_estado() -> dict:
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def guardar_estado(estado: dict) -> None:
    with open(STATE_FILE, "w", encoding="utf-8") as f:
        json.dump(estado, f, ensure_ascii=False, indent=2, sort_keys=True)


# ---------------------------------------------------------------------------
# Logica principal
# ---------------------------------------------------------------------------

def mensaje_para_estado(estado_guia: str, codigo_rastreo: str) -> str:
    # Si tenemos una traduccion mas amigable para este estado exacto, la usamos.
    # Si no (DAC a veces manda frases completas y propias, como
    # "Tu paquete se encuentra en VICHADERO"), usamos esa misma frase tal cual.
    texto = MENSAJES_POR_ESTADO.get(estado_guia.upper(), estado_guia)
    if not texto.endswith((".", "!", "?")):
        texto += "."
    return f"Hola! Novedad de tu pedido Simba Kids: {texto} (seguimiento {codigo_rastreo})"


def main() -> int:
    log(f"Arrancando (entorno DAC={DAC_ENV}, dry_run={DRY_RUN})")

    estado_guardado = cargar_estado()
    contactos_sin_telefono = []

    try:
        id_sesion, k_cliente = dac_login()
    except Exception as exc:
        log(f"ERROR: no se pudo hacer login en DAC: {exc}")
        return 1
    log(f"Login OK en DAC (K_Cliente={k_cliente})")

    try:
        guias = dac_guias_recientes(id_sesion, k_cliente)
    except Exception as exc:
        log(f"ERROR: no se pudo obtener la lista de guias: {exc}")
        return 1
    log(f"Se encontraron {len(guias)} guias en los ultimos {DIAS_A_REVISAR} dias")

    cambios = 0

    for guia in guias:
        k_guia = str(guia.get("K_Guia") or "").strip()
        estado_actual = (guia.get("D_Estado_Guia") or "").strip()
        if not k_guia or not estado_actual:
            continue

        estado_anterior = estado_guardado.get(k_guia, {}).get("status")
        if estado_anterior == estado_actual:
            continue  # no cambio nada para esta guia

        log(f"Guia {k_guia}: '{estado_anterior}' -> '{estado_actual}'")
        log(f"  DEBUG datos crudos de la guia (wsObtieneGuiasCliente): {json.dumps(guia, ensure_ascii=False)}")
        cambios += 1

        # wsObtieneGuiasCliente ya trae todo lo que necesitamos (destinatario,
        # telefono y estado), asi que no hace falta llamar a wsRastreoGuia.
        # El K_Guia que devuelve esta lista es en realidad el codigo de rastreo.
        destinatario = guia.get("Destinatario") or "cliente"
        codigo_rastreo = k_guia
        telefono = buscar_telefono(guia)

        registro_previo = estado_guardado.get(k_guia, {})
        if not telefono:
            telefono = registro_previo.get("phone")

        if telefono:
            contact_id = ghl_buscar_o_crear_contacto(destinatario, telefono)
            if contact_id:
                mensaje = mensaje_para_estado(estado_actual, codigo_rastreo)
                ok = ghl_enviar_whatsapp(contact_id, mensaje)
                log(f"  WhatsApp {'enviado' if ok else 'FALLO'} a {destinatario} ({telefono})")
            else:
                log(f"  No se pudo resolver el contacto en Optimify para {destinatario}")
        else:
            log(f"  Sin telefono disponible para la guia {k_guia} ({destinatario}); no se manda WhatsApp.")
            contactos_sin_telefono.append({"guia": k_guia, "destinatario": destinatario, "estado": estado_actual})

        estado_guardado[k_guia] = {
            "status": estado_actual,
            "destinatario": destinatario,
            "phone": telefono,
            "updated_at": datetime.now().isoformat(timespec="seconds"),
        }

    guardar_estado(estado_guardado)
    log(f"Listo. {cambios} cambios de estado procesados.")

    if contactos_sin_telefono:
        log(f"AVISO: {len(contactos_sin_telefono)} guias sin telefono disponible: {contactos_sin_telefono}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
