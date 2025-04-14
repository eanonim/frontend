import Link from "@component/default/Blocks/Link/Link"
import { modals, pushModal } from "router"

export default {
  not_supported: {
    subtitle:
      "Disponível apenas em dispositivos móveis e através do aplicativo oficial do Telegram.",
  },
  language: "Idioma",
  rating: "Classificação",
  tasks: "Tarefas",
  chat_deleted: {
    subtitle: "Você não pode mais enviar mensagens para este chat.",
  },
  task: {
    title: "Dose Diária de Moedas!",
    subtitle:
      "Complete tarefas simples de nossos parceiros todos os dias e ganhe moedas! Novas tarefas aparecem todos os dias, então volte frequentemente!",
  },
  languages: {
    ru: "Russo",
    en: "Inglês",
    fr: "Francês",
    ar: "Árabe",
    pt: "Português",
    de: "Alemão",
    es: "Espanhol",
  },
  dialogs_stub: {
    title: "Histórico do chat",
    subtitle: "Para que eles apareçam, salve as conversas que te interessam.",
  },
  premium: "Premium",
  premium_subtitle:
    "Mais liberdade e dezenas de funcionalidades exclusivas com uma assinatura.",
  search_for_an_interlocutor: "Procurar por um interlocutor",
  change_interests: "Alterar interesses",
  chats: "Chats",
  search: "Procurar",
  cancel_search: "Cancelar busca",
  settings: "Configurações",
  change_name: "Mudar nome",
  change_emoji_status: "Mudar status emoji",
  change_photo: "Mudar foto",
  color_scheme: "Esquema de cores",
  conversation_background: "Fundo da conversa",
  text_size: "Tamanho do texto",
  cooperation: "Cooperação",
  privacy_policy: "Política de Privacidade",
  help: "Ajuda",
  apply: "Aplicar",
  cancel: "Cancelar",
  accept: "Aceitar",
  reject: "Rejeitar",
  apply_in_all_chats: "Aplicar em todos os chats",
  font_size: {
    templates: {
      1: "Ele quer que eu vire para a direita? Ou para a esquerda?",
      2: "Vire à direita e expressivamente.",
      3: "Isso é tudo? Acho que ele disse muito mais.",
    },
  },
  today: "Hoje",
  yesterday: "Ontem",
  theme: {
    system: "Sistema",
    dark: "Escuro",
    light: "Claro",
  },
  themeColor: {
    standard: "Padrão",
    pink: "Rosa",
    mint: "Menta",
    earthen: "Terroso",
  },
  leave: {
    title: "Sair do chat",
    subtitle:
      "Tem certeza de que deseja sair do chat? Toda a correspondência será excluída sem possibilidade de recuperação.",
  },
  yes: "Sim",
  no: "Não",
  coin: "Moeda",
  your_coin_balance: "Seu saldo de moedas",
  man: "Homem",
  woman: "Mulher",
  any: "Qualquer",
  interests: "Interesses",
  you: "Você",
  companion: "Companheiro",
  searchInterests: {
    music: "Música",
    travel: "Viagem",
    sport: "Esporte",
    art: "Arte",
    cooking: "Culinária",
    movies: "Filmes",
    games: "Jogos",
    reading: "Leitura",
    tech: "Tecnologia",
    animals: "Animais",
    nature: "Natureza",
    photography: "Fotografia",
    dance: "Dança",
    space: "Espaço",
    science: "Ciência",
    history: "História",
    fashion: "Moda",
    yoga: "Yoga",
    psychology: "Psicologia",
    volunteering: "Voluntariado",
    flirt: "Flerte",
    crypto: "Cripto",
    anime: "Anime",
    lgbt: "LGBT",
  },
  deleted: "Deletado",
  attach_type: {
    invite: "Pedido para salvar a correspondência",
    photo: "Foto",
    unknown: "Desconhecido",
  },
  system: {
    invite: {
      sender: "Você enviou um pedido para salvar a correspondência",
      title: (first_name: string) =>
        `${first_name} quer salvar a correspondência com você`,
      subtitle:
        "Se você concordar, será mais fácil encontrar e continuar a comunicação no futuro.",
    },
  },
  in_response: "Em resposta",
  editing: "Editando",
  reconnect: "Reconectar",
  XTR: "Telegram Stars",
  TON: "TON",
  COIN: "Moeda",
  set_color: "Definir cor",
  pay: "Pagar",
  active_until: (time: string) => `Ativo até: ${time}`,
  per_year: "por ano",
  month: "mês",
  by_subscription_only: () => (
    <>
      Apenas por{" "}
      <Link onClick={() => pushModal({ modalId: modals.MODAL_PREMIUM })}>
        assinatura
      </Link>{" "}
    </>
  ),
  prints: "está digitando",
  answer: "Responder",
  copy: "Copiar",
  edit: "Editar",
  delete: "Excluir",
  complains: {
    1: "Não gosto disso.",
    2: "Abuso infantil.",
    3: "Violência",
    4: "Mercadoria ilegal",
    5: "Materiais pornográficos",
    6: "Dados Pessoais",
    7: "Terrorismo",
    8: "Fraude ou Spam",
    9: "Violação ou Spam",
    10: "Outro",
    11: "Não infringe a lei, mas deve ser removido.",
  },
  complain: "Reclamar",
  benefits_of_subscription: "Benefícios da Assinatura",
  premiums: {
    1: {
      icon_type: "IconFilterUp",
      title: "Filtros avançados",
      subtitle:
        "Mais oportunidades para encontrar o parceiro de conversa perfeito.",
    },
    2: {
      icon_type: "IconMessage2Search",
      title: "Histórico de Chat",
      subtitle:
        "Não perca o fio da conversa: acesso total ao histórico de chat.",
    },
    3: {
      icon_type: "IconCoins",
      title: "Mais moedas",
      subtitle: "Ganhe mais moedas por socializar e completar tarefas.",
    },
    4: {
      icon_type: "IconPhotoFilled",
      title: "Envio de fotos",
      subtitle:
        "Compartilhe seus momentos: envie fotos para seus interlocutores.",
    },
    5: {
      icon_type: "IconBrush",
      title: "Temas exclusivos",
      subtitle: "Personalize seu chat: escolha temas de design exclusivos.",
    },
  },
  message: "Mensagem",
  premium_times: {
    12: "Ano",
    6: "Seis meses",
    3: "Três meses",
    1: "Mês",
  },
  task_completed: "Tarefa concluída",
  task_type: {
    referral: {
      complete: "Convidar Amigo",
      check: "Verificar tarefa",
    },
    promo: {
      complete: "Ativar Promo",
      check: "Verificar tarefa",
    },
    app: {
      complete: "Abrir App",
      check: "Verificar tarefa",
    },
    integration: {
      complete: "Abrir App",
      check: "Verificar tarefa",
    },
    link: {
      complete: "Inscrever-se",
      check: "Verificar inscrição",
    },
    sub: {
      complete: "Inscrever-se",
      check: "Verificar inscrição",
    },
    default: {
      complete: "Concluir a tarefa",
      check: "Verificar Tarefa",
    },
    wallet: {
      complete: "Conectar carteira",
      check: "Verificar Tarefa",
    },
    wallet_okx: {
      complete: "Conectar Carteira OKX",
      check: "Verificar Tarefa",
    },
    boost: {
      complete: "Impulsionar Canal",
      check: "Verificar Impulso",
    },
    transaction: {
      complete: "Concluir a tarefa",
      check: "Verificar Tarefa",
    },
    reward: {
      complete: "Concluir a tarefa",
      check: "Verificar Tarefa",
    },
    ads: {
      complete: "Concluir a tarefa",
      check: "Verificar Tarefa",
    },
  },
  referral: {
    title: "Referral",
    subtitle: "Compartilhe seu link mágico e transforme seus amigos em bônus!",
  },
  invite_friend: "Convidar um amigo",
  name: "Nome",
  errors: {
    9901: "Tarefa não concluída.",
    1000: "Erro desconhecido",
    1001: "Solicitação rejeitada devido ao tempo limite",
    1002: "Esta ação requer acesso premium",
    1003: "Produto não encontrado",
    1004: "Não há moedas suficientes",
    1005: "Não é possível fazer isso agora. Tente novamente mais tarde.",
    1006: "Pedido foi rejeitado",
    1007: "Pedido não definido",
    1008: "Pedido já foi fechado",
    1009: "Você ou seu contato têm muitas conversas salvas",
  },
}
