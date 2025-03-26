import { Message as ClassMessage } from "../Message/Message"

// export type DefaultMetadata = {
//   read?: boolean
//   delete?: boolean
//   edit?: boolean
// }

// export type DefaultContent = {
//   type: string
//   text?: string
//   timestamp: Date
// }

// export type DefaultUser2 = {
//   id: string
// }

// export type ClassMessageProps2<
//   User extends DefaultUser,
//   Content extends DefaultContent,
//   Metadata extends DefaultMetadata,
// > = {
//   message_id: string
//   sender: User
//   recipient: User
//   content: Content
//   metadata: Metadata
// }

export type ClassMessageProps<
  Target extends DefaultTarget,
  Keyboard extends DefaultKeyboard,
  Attach extends DefaultAttach,
> = {
  id: number
  text?: string
  target?: Target
  attach?: Attach
  type: "default" | "invite"

  reply?: ClassMessageProps<Target, Keyboard, Attach>

  replyId?: number

  time: Date

  keyboard?: Keyboard[][]

  isOnlyEmoji?: boolean

  isLoading?: boolean
  isEdit?: boolean
  isRead?: boolean
  isDeleted?: boolean

  indexes?: [number, number, number]
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

  lastMessage?: ClassMessageProps<Target, Keyboard, Attach>

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
