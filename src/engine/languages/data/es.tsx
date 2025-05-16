import Link from "@component/default/Blocks/Link/Link"
import { modals, pushModal } from "router"

export default {
  not_supported: {
    subtitle:
      "Disponible solo en dispositivos móviles y a través de la aplicación oficial de Telegram.",
  },
  language: "Idioma",
  rating: "Calificación",
  tasks: "Tareas",
  chat_deleted: {
    subtitle: "Ya no puedes enviar mensajes a este chat.",
  },
  task: {
    title: "¡Dosis diaria de monedas!",
    subtitle:
      "¡Completa tareas simples de nuestros socios todos los días y obtén monedas! Las nuevas tareas aparecen todos los días, ¡así que vuelve a menudo!",
  },
  languages: {
    ru: "Ruso",
    en: "Inglés",
    fr: "Francés",
    ar: "Árabe",
    pt: "Portugués",
    de: "Alemán",
    es: "Español",
  },
  dialogs_stub: {
    title: "Historial de chat",
    subtitle: "Para que aparezcan, guarda las conversaciones que te interesen.",
  },
  premium: "Premium",
  premium_subtitle:
    "Más libertad y decenas de funciones exclusivas con una suscripción.",
  search_for_an_interlocutor: "Buscar un interlocutor",
  change_interests: "Cambiar intereses",
  change_language: "Cambiar idioma",
  chats: "Chats",
  search: "Buscar",
  cancel_search: "Cancelar búsqueda",
  settings: "Configuraciones",
  change_name: "Cambiar nombre",
  change_emoji_status: "Cambiar estado emoji",
  change_photo: "Cambiar foto",
  color_scheme: "Esquema de colores",
  conversation_background: "Fondo de la conversación",
  text_size: "Tamaño del texto",
  cooperation: "Cooperación",
  privacy_policy: "Política de privacidad",
  help: "Ayuda",
  apply: "Aplicar",
  cancel: "Cancelar",
  accept: "Aceptar",
  reject: "Rechazar",
  apply_in_all_chats: "Aplicar en todos los chats",
  font_size: {
    templates: {
      1: "¿Quiere que gire a la derecha? ¿O a la izquierda?",
      2: "Gire a la derecha y de forma expresiva.",
      3: "¿Eso es todo? Creo que dijo mucho más.",
    },
  },
  today: "Hoy",
  yesterday: "Ayer",
  theme: {
    system: "Sistema",
    dark: "Oscuro",
    light: "Claro",
  },
  themeColor: {
    standard: "Estándar",
    pink: "Rosa",
    mint: "Menta",
    earthen: "Terroso",
  },
  leave: {
    title: "Salir del chat",
    subtitle:
      "¿Estás seguro de que quieres salir del chat? Toda la correspondencia se eliminará sin posibilidad de recuperación.",
  },
  yes: "Sí",
  no: "No",
  coin: "Moneda",
  your_coin_balance: "Tu saldo de monedas",
  man: "Hombre",
  woman: "Mujer",
  any: "Cualquiera",
  interests: "Intereses",
  you: "Tú",
  companion: "Compañero",
  searchTitle: "Buscando un compañero de conversación…",
  searchSubtitle:
    "Cada segundo, alguien comienza un diálogo en ANChat. ¡Sé el próximo!",
  searchInterests: {
    music: "Música",
    travel: "Viajar",
    sport: "Deporte",
    art: "Arte",
    cooking: "Cocina",
    movies: "Películas",
    games: "Juegos",
    reading: "Lectura",
    tech: "Tecnología",
    animals: "Animales",
    nature: "Naturaleza",
    photography: "Fotografía",
    dance: "Baile",
    space: "Espacio",
    science: "Ciencia",
    history: "Historia",
    fashion: "Moda",
    yoga: "Yoga",
    psychology: "Psicología",
    volunteering: "Voluntariado",
    flirt: "Coquetear",
    crypto: "Cripto",
    anime: "Anime",
    lgbt: "LGBT",
  },
  deleted: "Eliminado",
  attach_type: {
    invite: "Solicitud para guardar la correspondencia",
    photo: "Foto",
    unknown: "Desconocido",
  },
  system: {
    invite: {
      sender: "Has enviado una solicitud para guardar la correspondencia",
      title: (first_name: string) =>
        `${first_name} quiere guardar la correspondencia contigo`,
      subtitle:
        "Si aceptas, te será más fácil encontrar y continuar la comunicación en el futuro.",
    },
  },
  in_response: "En respuesta",
  editing: "Editando",
  reconnect: "Reconectar",
  XTR: "Telegram Stars",
  TON: "TON",
  COIN: "Moneda",
  set_color: "Establecer color",
  pay: "Pagar",
  active_until: (time: string) => `Activo hasta: ${time}`,
  per_year: "al año",
  month: "mes",
  by_subscription_only: () => (
    <>
      Solo por{" "}
      <Link onClick={() => pushModal({ modalId: modals.MODAL_PREMIUM })}>
        suscripción
      </Link>{" "}
    </>
  ),
  prints: "imprimiendo",
  answer: "Responder",
  copy: "Copiar",
  edit: "Editar",
  delete: "Eliminar",
  complains: {
    1: "No me gusta.",
    2: "Abuso infantil.",
    3: "Violencia",
    4: "Mercancía ilegal",
    5: "Materiales pornográficos",
    6: "Datos personales",
    7: "Terrorismo",
    8: "Fraude o Spam",
    9: "Infracción o Spam",
    10: "Otro",
    11: "No viola la ley, pero debería eliminarse.",
  },
  complain: "Quejarse",
  benefits_of_subscription: "Beneficios de la Suscripción",
  premiums: {
    1: {
      icon_type: "IconFilterUp",
      title: "Filtros avanzados",
      subtitle:
        "Más oportunidades para encontrar el compañero de conversación perfecto.",
    },
    2: {
      icon_type: "IconMessage2Search",
      title: "Historial de chat",
      subtitle:
        "No te pierdas el hilo del chat: acceso completo al historial de chat.",
    },
    3: {
      icon_type: "IconCoins",
      title: "Más monedas",
      subtitle: "Gana más monedas por socializar y completar tareas.",
    },
    4: {
      icon_type: "IconPhotoFilled",
      title: "Envío de fotos",
      subtitle: "Comparte tus momentos: envía fotos a tus interlocutores.",
    },
    5: {
      icon_type: "IconBrush",
      title: "Temas exclusivos",
      subtitle: "Personaliza tu chat: elige temas de diseño exclusivos.",
    },
  },
  message: "Mensaje",
  premium_times: {
    12: "Año",
    6: "Seis meses",
    3: "Tres meses",
    1: "Mes",
  },
  unavailable: (time: string) => `No disponible hasta ${time}`,
  purchased: "Comprado",
  task_completed: "Tarea completada",
  task_type: {
    referral: {
      complete: "Invitar a un amigo",
      check: "Verificar tarea",
    },
    promo: {
      complete: "Activar promo",
      check: "Verificar tarea",
    },
    app: {
      complete: "Abrir la aplicación",
      check: "Verificar tarea",
    },
    integration: {
      complete: "Abrir la aplicación",
      check: "Verificar tarea",
    },
    link: {
      complete: "Suscribirse",
      check: "Verificar suscripción",
    },
    sub: {
      complete: "Suscribirse",
      check: "Verificar suscripción",
    },
    default: {
      complete: "Completar la tarea",
      check: "Verificar Tarea",
    },
    wallet: {
      complete: "Conectar cartera",
      check: "Verificar Tarea",
    },
    wallet_okx: {
      complete: "Conectar cartera OKX",
      check: "Verificar Tarea",
    },
    boost: {
      complete: "Impulsar Canal",
      check: "Verificar aumento",
    },
    transaction: {
      complete: "Completar la tarea",
      check: "Verificar Tarea",
    },
    reward: {
      complete: "Completar la tarea",
      check: "Verificar Tarea",
    },
    ads: {
      complete: "Completar la tarea",
      check: "Verificar Tarea",
    },
  },
  referral: {
    title: "Referido",
    subtitle: "¡Comparte tu enlace mágico y convierte a tus amigos en bonos!",
  },
  invite_friend: "Invitar a un amigo",
  name: "Nombre",
  errors: {
    9901: "Tarea no completada.",
    1000: "Error desconocido",
    1001: "Solicitud rechazada por tiempo de espera",
    1002: "Esta acción requiere acceso premium",
    1003: "Producto no encontrado",
    1004: "No hay suficientes monedas",
    1005: "Esto no se puede hacer en este momento. Inténtalo de nuevo más tarde.",
    1006: "Pedido fue rechazado",
    1007: "Pedido no definido",
    1008: "El pedido ya está cerrado",
    1009: "Tú o tu contacto tienen demasiadas conversaciones guardadas",
  },
}
