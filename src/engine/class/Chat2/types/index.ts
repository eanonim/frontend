import { ReactiveMap } from "@solid-primitives/map"
import { Chat } from "../Chat"
import { Message as ClassMessage } from "../Message/Message"

export type Users<T extends DefaultUser = DefaultUser> = Record<string, T>
export type Chats<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
  _Chat extends Chat<ChatContent, User, Content, Metadata> = Chat<
    ChatContent,
    User,
    Content,
    Metadata
  >,
> = Record<_Chat["chat_id"], _Chat>

export type DefaultChatContent = Record<string, unknown>

export type DefaultMetadata<User extends DefaultUser> = {
  read: User[]
  delete: boolean
  edit: boolean
}

export type DefaultContent = {
  type: string
  text?: string
  timestamp: Date
}

export type DefaultUser = {
  user_id: string
}

export type ClassMessageProps<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
> = {
  message_id: number
  sender: User
  // recipient: User
  content: Content
  metadata: Metadata

  reply?: ObjectMessage<ChatContent, User, Content, Metadata>
}

export type ObjectMessage<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
> = ClassMessage<ChatContent, User, Content, Metadata>

export type ClassChatProps<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
  Message extends ObjectMessage<
    ChatContent,
    User,
    Content,
    Metadata
  > = ObjectMessage<ChatContent, User, Content, Metadata>,
> = {
  chat_id: string

  participants: User[]

  /* Данные */
  content: ChatContent

  /* dialogs нужен для отображения  */
  dialogs: [string, ObjectMessage<ChatContent, User, Content, Metadata>[][]][]
  /* dialogs нужен для поиска сообщения по ID  */
  history: ReactiveMap<Message["message_id"], Message>

  new_message?: Message

  /* Ссылки на пользователей которые печатают */
  typing: User[]

  /* Указывает на полную загрузку всей истории */
  full_load?: boolean

  /* Указывает на загрузку истории */
  loading_history?: boolean

  /* Последнее чисто загруженной истории */
  last_offset?: number

  /* Последнее сообщение */
  last_message_id?: number
}

export type RequestChat<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
  Chat extends ClassChatProps<
    ChatContent,
    User,
    Content,
    Metadata
  > = ClassChatProps<ChatContent, User, Content, Metadata>,
> = {
  chat_id: Chat["chat_id"]
  content: Chat["content"]
  lastMessage?: Omit<
    ClassMessageProps<ChatContent, User, Content, Metadata>,
    "sender"
  > & {
    user_id: User["user_id"]
  }
}

export type RequestMessageList<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
> = (Omit<
  Omit<
    Omit<ClassMessageProps<ChatContent, User, Content, Metadata>, "reply">,
    "sender"
  >,
  "metadata"
> & {
  user_id: User["user_id"]
  metadata: Omit<Metadata, "read"> & {
    read: User["user_id"][]
  }
  reply?: Omit<
    Omit<
      Omit<ClassMessageProps<ChatContent, User, Content, Metadata>, "chat_id">,
      "sender"
    >,
    "metadata"
  > & {
    user_id: User["user_id"]
    metadata: Omit<Metadata, "read"> & {
      read: User["user_id"][]
    }
  }
})[]

type Result<T> = {
  response: T | undefined
  error: boolean
}

export type Requests<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
> = {
  "chat.getById": ({
    chat_id,
    chat,
  }: {
    chat_id: string
    chat: Chat<
      ChatContent,
      User,
      Content,
      Metadata,
      ObjectMessage<ChatContent, User, Content, Metadata>
    >
  }) => Promise<Result<RequestChat<ChatContent, User, Content, Metadata>>>
  "chat.getList": ({
    count,
    offset,
    chat,
  }: {
    count: number
    offset: number
    chat: Chat<
      ChatContent,
      User,
      Content,
      Metadata,
      ObjectMessage<ChatContent, User, Content, Metadata>
    >
  }) => Promise<Result<RequestChat<ChatContent, User, Content, Metadata>[]>>
  "message.delete": ({
    chat_id,
    message_id,
  }: {
    chat_id: string
    message_id: number
  }) => Promise<Result<boolean>>
  "message.read": ({
    chat_id,
    message_id,
    user_id,
  }: {
    chat_id: string
    message_id: number
    user_id: User["user_id"]
  }) => Promise<Result<boolean>>
  "message.getHistory": ({
    chat_id,
    count,
    offset,
    chat,
  }: {
    chat_id: string
    count: number
    offset: number
    chat: Chat<
      ChatContent,
      User,
      Content,
      Metadata,
      ObjectMessage<ChatContent, User, Content, Metadata>
    >
  }) => Promise<
    Result<RequestMessageList<ChatContent, User, Content, Metadata>>
  >
}
