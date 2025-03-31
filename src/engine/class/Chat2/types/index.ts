import { ReactiveMap } from "@solid-primitives/map"
import { Chat } from "../Chat"
import { Message as ClassMessage } from "../Message/Message"

type Omits<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

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
  read: ReactiveMap<User["user_id"], User>
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

  /* Пользователи чата */
  participants: ReactiveMap<User["user_id"], User>

  /* Данные */
  content: ChatContent

  /* История сообщений  */
  history: ReactiveMap<Message["message_id"], Message>

  new_message?: ClassMessageProps<ChatContent, User, Content, Metadata>

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
  lastMessage?: RequestMessageList<ChatContent, User, Content, Metadata>[0]
}

/*

reply?: Omit<
    Omit<
      Omit<ClassMessageProps<ChatContent, User, Content, Metadata>, "chat_id">,
      "sender"
    >,
    "metadata"
  >

  Omit<
  Omit<
    Omit<ClassMessageProps<ChatContent, User, Content, Metadata>, "reply">,
    "sender"
  >,
  "metadata"
>
*/

export type RequestMessageList<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
> = (Omits<
  ClassMessageProps<ChatContent, User, Content, Metadata>,
  "reply" | "sender" | "metadata"
> & {
  user_id: User["user_id"]
  metadata: Omit<Metadata, "read"> & {
    read: User["user_id"][]
  }
  reply?: Omits<
    ClassMessageProps<ChatContent, User, Content, Metadata>,
    "sender" | "metadata"
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
  }: {
    chat_id: string
  }) => Promise<Result<RequestChat<ChatContent, User, Content, Metadata>>>
  "chat.getList": ({
    count,
    offset,
  }: {
    count: number
    offset: number
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
  }: {
    chat_id: string
    count: number
    offset: number
  }) => Promise<
    Result<RequestMessageList<ChatContent, User, Content, Metadata>>
  >
}
