import { Message as ClassMessage } from "../Message/Message"

export type ClassMessageProps<
  Target extends DefaultTarget,
  Keyboard extends DefaultKeyboard,
> = {
  id: number
  text?: string
  target: Target
  attach?: {
    type: "photo" | "audio"
    items: Array<{
      name: string
      data: string
    }>
  }
  reply?: {
    id: number
    message: string
    attachType?: "photo" | "audio"
  }
  time: Date

  keyboard?: Keyboard[][]

  isOnlyEmoji?: boolean

  isLoading?: boolean
  isEdit?: boolean
  isRead?: boolean
  isDeleted?: boolean

  indexes: [number, number, number]
}

export type DefaultTarget = "my" | "system" | "you"
export type DefaultKeyboard = unknown

export type DefaultUser = {
  first_name: string
  last_name: string
}

export type ObjectMessage<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
> = ClassMessage<Target, User, Keyboard>

export type Dialog<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Message extends ObjectMessage<Target, User, Keyboard> = ObjectMessage<
    Target,
    User,
    Keyboard
  >,
> = {
  id: string

  lastMessageId?: number

  lastMessage?: {
    id: number
    text?: string
    target: Target
    attachType?: "photo" | "audio"
    time: Date
    isRead: boolean
  }

  user: User

  messages: {
    dialogs: [string, Message[][]][]
    history: Record<number, Message>
    lastReadMessageId?: number
    lastOffset: number
    /* Указывает загружается ли история */
    isLoading?: boolean
  }

  message?: {
    text?: string
    /* ID сообщения на которое пользователь хочет ответить */
    replyId?: number
    /* ID редактируемого сообщения */
    editId?: number

    /* Указывает что пользователь печатает */
    isTyping?: boolean
    /* Указывает что пользователь прикрепляет, что -то к сообщению  */
    isAddAttach?: boolean
  }

  /* CUSTOM */
  isTyping?: boolean
  isLoading?: boolean
  isFullLoad?: boolean
}

type Result<T> =
  | {
      response: T
      error: undefined
    }
  | {
      response: undefined
      error: true
    }

export type Requests<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Message extends ObjectMessage<Target, User, Keyboard> = ObjectMessage<
    Target,
    User,
    Keyboard
  >,
  _Dialog extends Dialog<Target, User, Keyboard, Message> = Dialog<
    Target,
    User,
    Keyboard,
    Message
  >,
> = {
  "chat.getById": ({
    id,
  }: {
    id: string
  }) => Promise<Result<Omit<_Dialog, "messages">>>
  "chat.getList": ({
    count,
    offset,
  }: {
    count: number
    offset: number
  }) => Promise<Result<Omit<_Dialog, "messages">[]>>
  "message.delete": ({
    chatId,
    messageId,
  }: {
    chatId: string
    messageId: number
  }) => Promise<Result<boolean>>
  "message.read": ({
    chatId,
    messageId,
  }: {
    chatId: string
    messageId: number
  }) => Promise<Result<boolean>>
  "message.getHistory": ({
    id,
    count,
    offset,
  }: {
    id: string
    count: number
    offset: number
  }) => Promise<Result<Omit<ClassMessageProps<Target, Keyboard>, "indexes">[]>>
}
