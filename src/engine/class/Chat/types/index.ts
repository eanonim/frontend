import { Message as ClassMessage } from "../Message/Message"

export type ClassMessageProps<
  Target extends DefaultTarget,
  Keyboard extends DefaultKeyboard,
  Attach extends DefaultAttach,
> = {
  id: number
  text?: string
  target: Target
  attach?: Attach
  type: "default" | "invite"
  reply?: {
    id: number
    message: string
    attachType?: unknown
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
export type DefaultAttach = unknown

export type DefaultUser = {
  first_name: string
  last_name: string
}

export type ObjectMessage<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Attach extends DefaultAttach,
> = ClassMessage<Target, User, Keyboard, Attach>

export type Dialog<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Attach extends DefaultAttach,
  Message extends ObjectMessage<Target, User, Keyboard, Attach> = ObjectMessage<
    Target,
    User,
    Keyboard,
    Attach
  >,
> = {
  id: string

  lastMessageId?: number

  lastMessage?: {
    id: number
    text?: string
    target: Target
    attach?: Attach
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

    /* Указывает что пользователь прикрепляет, что -то к сообщению  */
    isAddAttach?: boolean
    attach?: Attach
  }

  /* Указывает что пользователь печатает */
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
  Attach extends DefaultAttach,
  Message extends ObjectMessage<Target, User, Keyboard, Attach> = ObjectMessage<
    Target,
    User,
    Keyboard,
    Attach
  >,
  _Dialog extends Dialog<Target, User, Keyboard, Attach, Message> = Dialog<
    Target,
    User,
    Keyboard,
    Attach,
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
  }) => Promise<
    Result<Omit<ClassMessageProps<Target, Keyboard, Attach>, "indexes">[]>
  >
}
