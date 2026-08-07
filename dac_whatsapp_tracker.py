"""
DAC -> WhatsApp: notifica a los clientes de Simba Kids por WhatsApp
cada vez que cambia el estado de su envio en DAC.

Como funciona (resumen):
1. Se loguea en la API de DAC (wsLogin).
2. Pide la lista de guias (envios) activas de los ultimos dias (wsObtieneGuiasCliente).
3. Compara el estado de cada guia contra lo guardado en state.json (la ultima vez que corrio).
4. Si el estado cambio, busca o crea el contacto en Optimify (GoHighLevel) por
   telefono, y le actualiza los custom fields 'Estado envio DAC' y
   'Codigo seguimiento DAC'.
5. Ese cambio en 'Estado envio DAC' dispara automaticamente un Workflow en
   Optimify ("Notificar envio DAC por WhatsApp"), que es quien realmente manda
   el WhatsApp al cliente usando la plantilla aprobada por Meta
   (seguimiento_envio_simba). Este script NO llama directamente a la API de
   WhatsApp: eso evita el problema de la ventana de 24hs de Meta, porque el
   Workflow siempre manda via plantilla aprobada, sin importar cuando fue el
   ultimo mensaje del cliente.
6. Guarda el nuevo estado en state.json para no mandar el mismo mensaje dos veces.

Este script esta pensado para correr solo, disparado por GitHub Actions
cada cierto tiempo (ver .github/workflows/track.yml).
"""


import json
import os
import re
import sys
import uuid
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo


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


# IDs de los custom fields de contacto en Optimify (Settings > Custom Fields).
# Se usan para guardar el estado y el codigo de rastreo en el contacto; un
# Workflow en Optimify ("Notificar envio DAC por WhatsApp") esta configurado
# para dispararse solo cuando 'Estado envio DAC' cambia, y ese Workflow es el
# que efectivamente manda el WhatsApp usando la plantilla aprobada por Meta
# (seguimiento_envio_simba). Este script YA NO manda el WhatsApp directamente:
# eso evita el problema de la ventana de 24hs, porque el Workflow siempre manda
# via plantilla aprobada.
GHL_CUSTOM_FIELD_ESTADO = "tQLmOu1tbZO1flHDtxye"    # contact.estado_envio_dac
GHL_CUSTOM_FIELD_CODIGO = "gCQOWLDJlM0BoggDRvKi"    # contact.codigo_seguimiento_dac

# IMPORTANTE: el Workflow de Optimify dispara cuando 'Estado envio DAC' CAMBIA
# DE VALOR. El problema es que el primer estado de DAC ("El remitente hizo el
# despacho virtual...") es literalmente el mismo texto para TODOS los envios,
# asi que si un mismo contacto (mismo telefono) recibe dos guias distintas,
# la segunda vez ese campo puede quedar con el MISMO texto que ya tenia, y
# entonces GHL no detecta ningun cambio real y el Workflow no se dispara.
# Por eso ademas escribimos un valor unico (UUID) en este campo cada vez que
# de verdad hay una notificacion para mandar, y el Workflow esta configurado
# para disparar cuando ESTE campo cambia (que SIEMPRE cambia), en vez de
# 'Estado envio DAC'.
GHL_CUSTOM_FIELD_NOTIF_ID = "rYuEkyD1NQdhIkfDUr7u"    # contact.dac_notificacion_id

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


# Horario en el que esta permitido correr el script y mandar WhatsApp a los
# clientes (hora de Uruguay). Fuera de este horario el script no consulta DAC
# ni manda nada; simplemente no hace nada y termina. Esto evita que le lleguen
# mensajes a los clientes de noche o de madrugada.
TIMEZONE_UY = ZoneInfo("America/Montevideo")
HORA_INICIO = 8    # 08:00 hs
HORA_FIN = 21       # hasta las 21:00 hs (no inclusive)
DIAS_HABILES = {0, 1, 2, 3, 4, 5}    # lunes=0 ... sabado=5 (domingo=6 queda afuera)


def dentro_del_horario_permitido(ahora: datetime | None = None) -> bool:
    """True si 'ahora' (hora de Uruguay) cae de lunes a sabado, entre HORA_INICIO y HORA_FIN."""
    if ahora is None:
        ahora = datetime.now(TIMEZONE_UY)
    return ahora.weekday() in DIAS_HABILES and HORA_INICIO <= ahora.hour < HORA_FIN


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




RE_TELEFONO_EN_OBSERVACIONES = re.compile(r"TEL[:\s]*([\d\s\-\+]{7,15})", re.IGNORECASE)




def buscar_telefono(detalle_guia: dict) -> str | None:
    """
    Busca el telefono del DESTINATARIO (cliente), no el del remitente (Simba Kids).

    DAC confirmo que wsObtieneGuiasCliente NUNCA devuelve el telefono del
    destinatario (ni cargando la etiqueta a mano ni por API), asi que la
    fuente real es el campo 'Observaciones': ahi cargamos manualmente el
    telefono con el formato "TEL:099123456" al crear cada etiqueta en DAC.
    Se deja tambien el chequeo de 'Telefono_Destinatario' por si DAC lo llega
    a habilitar en el futuro.
    """
    valor_directo = detalle_guia.get("Telefono_Destinatario")
    if valor_directo:
        return str(valor_directo)


    observaciones = detalle_guia.get("Observaciones") or ""
    match = RE_TELEFONO_EN_OBSERVACIONES.search(observaciones)
    if match:
        return match.group(1).strip()


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
    """Convierte un telefono uruguayo a formato internacional +598..."""
    primero = telefono.split("/")[0].split(",")[0].strip()
    limpio = "".join(ch for ch in primero if ch.isdigit() or ch == "+")
    if limpio.startswith("+598"):
        return limpio
    if limpio.startswith("598"):
        return "+" + limpio
    if limpio.startswith("0"):
        return "+598" + limpio[1:]
    return "+598" + limpio




def ghl_buscar_o_crear_contacto(
    nombre: str, telefono: str, estado_texto: str, codigo_rastreo: str
) -> str | None:
    """Busca un contacto por telefono; si no existe, lo crea. Devuelve el contactId.

    De paso, actualiza los custom fields 'Estado envio DAC' y 'Codigo seguimiento
    DAC' del contacto. Cuando 'Estado envio DAC' cambia de valor, esto dispara
    automaticamente el Workflow "Notificar envio DAC por WhatsApp" en Optimify,
    que es quien realmente manda el WhatsApp (usando la plantilla aprobada por
    Meta). Asi evitamos mandar mensajes libres que Meta rechaza fuera de la
    ventana de 24hs.

    Tambien escribimos un UUID nuevo en 'DAC notificacion id' en cada llamada:
    el Workflow en realidad dispara sobre ESE campo (no sobre 'Estado envio
    DAC'), porque el texto del estado puede repetirse entre guias distintas
    del mismo contacto (por ejemplo, el primer estado de DAC es igual para
    todos los envios) y en ese caso GHL no detectaria ningun cambio real.
    """
    telefono_norm = normalizar_telefono_uy(telefono)
    notif_id = str(uuid.uuid4())


    r = requests.post(
        f"{GHL_BASE_URL}/contacts/upsert",
        headers=ghl_headers(),
        json={
            "locationId": OPTIMIFY_LOCATION_ID,
            "name": nombre,
            "phone": telefono_norm,
            "source": "DAC WhatsApp Tracking",
            "customFields": [
                {"id": GHL_CUSTOM_FIELD_ESTADO, "field_value": estado_texto},
                {"id": GHL_CUSTOM_FIELD_CODIGO, "field_value": codigo_rastreo},
                {"id": GHL_CUSTOM_FIELD_NOTIF_ID, "field_value": notif_id},
            ],
        },
        timeout=30,
    )
    if r.status_code >= 300:
        log(f"  ERROR creando/actualizando contacto en Optimify: {r.status_code} {r.text}")
        return None


    data = r.json()
    contacto = data.get("contact") or data
    return contacto.get("id")




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


def texto_amigable_para_estado(estado_guia: str) -> str:
    """Traduce el estado crudo de DAC a un texto mas humano para el cliente.

    Este texto es lo que se guarda en el custom field 'Estado envio DAC' del
    contacto (variable {{2}} de la plantilla de WhatsApp seguimiento_envio_simba).
    Si no tenemos traduccion para el estado exacto (DAC a veces manda frases
    propias, como "Tu paquete se encuentra en VICHADERO"), usamos esa misma
    frase tal cual viene.
    """
    texto = MENSAJES_POR_ESTADO.get(estado_guia.upper(), estado_guia)
    if not texto.endswith((".", "!", "?")):
        texto += "."
    return texto




def main() -> int:
    log(f"Arrancando (entorno DAC={DAC_ENV}, dry_run={DRY_RUN})")


    ahora_uy = datetime.now(TIMEZONE_UY)
    if not dentro_del_horario_permitido(ahora_uy):
        log(
            f"Fuera de horario permitido ({ahora_uy.strftime('%A %H:%M')} hora Uruguay; "
            f"solo se corre de lunes a sabado de {HORA_INICIO:02d}:00 a {HORA_FIN:02d}:00). "
            f"No se consulta DAC ni se manda nada."
        )
        return 0


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
            estado_texto = texto_amigable_para_estado(estado_actual)
            if DRY_RUN:
                log(
                    f"  [DRY RUN] Actualizaria contacto {destinatario} ({telefono}) "
                    f"con Estado envio DAC={estado_texto!r}, Codigo seguimiento DAC={codigo_rastreo!r} "
                    f"(esto dispararia el envio de WhatsApp via el Workflow de Optimify)"
                )
            else:
                contact_id = ghl_buscar_o_crear_contacto(
                    destinatario, telefono, estado_texto, codigo_rastreo
                )
                if contact_id:
                    # Actualizar 'Estado envio DAC' dispara automaticamente el
                    # Workflow "Notificar envio DAC por WhatsApp" en Optimify,
                    # que manda el WhatsApp usando la plantilla aprobada por Meta.
                    log(f"  Contacto actualizado en Optimify ({destinatario}, {telefono}); WhatsApp disparado via Workflow.")
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
