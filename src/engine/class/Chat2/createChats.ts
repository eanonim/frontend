import { createStore, produce, SetStoreFunction } from "solid-js/store"
import { Chat } from "./Chat"
import {
  Chats,
  ClassChatProps,
  ClassMessageProps,
  DefaultChatContent,
  DefaultContent,
  DefaultMetadata,
  DefaultUser,
  RequestChat,
  Requests,
} from "./types"
import { ReactiveMap } from "@solid-primitives/map"

export var REQUESTS: Partial<
  Requests<
    DefaultChatContent,
    DefaultUser,
    DefaultContent,
    DefaultMetadata<DefaultUser>
  >
> = {}

export const [_chats, _setChats] = createStore<
  Record<
    string,
    Chat<
      DefaultChatContent,
      DefaultUser,
      DefaultContent,
      DefaultMetadata<DefaultUser>
    >
  >
>({})

export class createChats<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
> {
  private requests: Partial<Requests<ChatContent, User, Content, Metadata>> = {}
  private chats = _chats as unknown as Chats<
    ChatContent,
    User,
    Content,
    Metadata
  >
  private setChats = _setChats as SetStoreFunction<
    Chats<ChatContent, User, Content, Metadata>
  >

  constructor({
    requests,
  }: {
    requests: Requests<ChatContent, User, Content, Metadata>
  }) {
    ;(REQUESTS as any) = requests
    this.requests = requests

    this.setDIALOG = this.setDIALOG.bind(this)
    this.loadChatById = this.loadChatById.bind(this)
    this.loadChats = this.loadChats.bind(this)
    this.get = this.get.bind(this)
    this.getById = this.getById.bind(this)
    this.getClass = this.getClass.bind(this)
  }

  private setDIALOG(
    item: RequestChat<
      ChatContent,
      User,
      Content,
      Metadata,
      ClassChatProps<ChatContent, User, Content, Metadata>
    >,
  ) {
    const chat = this.chats[item.chat_id]
    if (chat) {
      chat.setContent(item.content)
      if (item.lastMessage) {
        chat.initMessage(item.lastMessage, undefined, true)
      }
    } else {
      const chat = new Chat<ChatContent, User, Content, Metadata>({
        chat_id: item.chat_id,
        content: item.content,
        dialogs: [],
        history: new ReactiveMap(),
        typing: [],
        participants: [],
        loadChatById: this.loadChatById,
      })
      if (item.lastMessage) {
        chat.initMessage(item.lastMessage, undefined, true)
      }

      this.setChats(
        produce((store) => {
          store[item.chat_id] = chat
          return store
        }),
      )
    }
  }

  /* Загрузка чата */
  public async loadChatById(id: string) {
    if (Object.values(this.chats).length === 0) {
      return this.loadChats()
    }

    const request = this.requests["chat.getById"]
    if (!request) {
      console.error('Нет функции для вызова "chat.getById"')
      return false
    }
    const { response, error } = await request({ id })

    if (response) {
      this.setDIALOG(response)
      return true
    }
    return false
  }

  /* Загрузка чатов */
  public async loadChats() {
    const request = this.requests["chat.getList"]
    if (!request) {
      console.error('Нет функции для вызова "chat.getList"')
      return false
    }
    const { response, error } = await request({ offset: 0, count: 0 })

    if (response) {
      for (const item of response) {
        this.setDIALOG(item)
      }
      return true
    }
    return false
  }

  /* Получение историю диалогов */
  public get() {
    return this.chats
  }

  /* Получение диалога по ID */
  public getById(
    id: string,
  ): Chat<ChatContent, User, Content, Metadata> | undefined {
    if (!this.chats[id]) {
      this.setDIALOG({
        chat_id: id,
        content: {} as any,
        lastMessage: {} as any,
      })
      this.loadChatById(id)
    }
    return this.chats[id]
  }

  public getClass() {
    return Chat<ChatContent, User, Content, Metadata>
  }
}
