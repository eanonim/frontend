import { createStore, produce, SetStoreFunction } from "solid-js/store"
import { Chat } from "../Chat/Chat"
import {
  DefaultAttach,
  DefaultKeyboard,
  DefaultTarget,
  DefaultUser,
  Dialog,
  ObjectMessage,
  Requests,
} from "./types"

export var REQUESTS: Partial<
  Requests<DefaultTarget, DefaultUser, DefaultKeyboard, DefaultAttach>
> = {}

export const [dialogs, setDialogs] = createStore<
  Record<
    string,
    Chat<DefaultTarget, DefaultUser, DefaultKeyboard, DefaultAttach>
  >
>({})

export function setREQUESTS(
  params: Partial<
    Requests<DefaultTarget, DefaultUser, DefaultKeyboard, DefaultAttach>
  >,
) {
  REQUESTS = params
}

export class createChats<
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
> {
  private requests: Partial<
    Requests<Target, User, Keyboard, Attach, Message, _Dialog>
  > = {}
  private _dialogs = dialogs as unknown as Record<
    string,
    Chat<Target, User, Keyboard, Attach>
  >
  private _setDialogs = setDialogs as SetStoreFunction<
    Record<string, Chat<Target, User, Keyboard, Attach>>
  >

  constructor({
    requests,
  }: {
    requests: Requests<Target, User, Keyboard, Attach, Message, _Dialog>
  }) {
    REQUESTS = requests
    this.requests = requests

    this.loadChatById = this.loadChatById.bind(this)
  }

  private setDIALOG(item: Omit<_Dialog, "messages">) {
    const chat = this._dialogs[item.id]
    if (chat) {
      chat.setter("isFullLoad", item.isFullLoad)
      chat.setter("isLoading", item.isLoading)
      chat.setter("isTyping", item.isTyping)
      chat.setter("user", item.user)
      if (item.lastMessage) {
        chat.newMessage(item.lastMessage)
      }
    } else {
      const chat = new Chat<Target, User, Keyboard, Attach, Message, _Dialog>({
        ...item,
        loadChatById: this.loadChatById,
      })
      if (item.lastMessage) {
        chat.newMessage(item.lastMessage)
      }

      this._setDialogs(
        produce((store) => {
          store[item.id] = chat
          return store
        }),
      )
    }
  }

  /* Загрузка чата */
  public async loadChatById(id: string) {
    if (Object.values(this._dialogs[id]).length === 0) {
      return this.loadChats()
    }

    const request = this.requests["chat.getById"]
    if (!request) {
      console.error('Нет функции для вызова "chat.getById"')
      return false
    }
    const { response, error } = await request({ id })

    console.log({ id })
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
    return this._dialogs
  }

  /* Получение диалога по ID */
  public getById(id: string): Chat<Target, User, Keyboard, Attach> | undefined {
    if (!this._dialogs[id]) {
      this.setDIALOG({ id, user: {} as any } as Omit<_Dialog, "messages">)
      this.loadChatById(id)
    }
    return this._dialogs[id]
  }

  public getClass() {
    return Chat<Target, User, Keyboard, Attach, Message, _Dialog>
  }
}
