import { createStore, produce, SetStoreFunction } from "solid-js/store"
import { Chat } from "../Chat/Chat"
import {
  DefaultKeyboard,
  DefaultTarget,
  DefaultUser,
  Dialog,
  ObjectMessage,
  Requests,
} from "./types"

export var REQUESTS: Partial<
  Requests<DefaultTarget, DefaultUser, DefaultKeyboard>
> = {}

export const [dialogs, setDialogs] = createStore<
  Record<string, Chat<DefaultTarget, DefaultUser, DefaultKeyboard>>
>({})

export function setREQUESTS(
  params: Partial<Requests<DefaultTarget, DefaultUser, DefaultKeyboard>>,
) {
  REQUESTS = params
}

export class createChats<
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
> {
  private requests: Partial<
    Requests<Target, User, Keyboard, Message, _Dialog>
  > = {}
  private _dialogs = dialogs as unknown as Record<
    string,
    Chat<Target, User, Keyboard>
  >
  private _setDialogs = setDialogs as SetStoreFunction<
    Record<string, Chat<Target, User, Keyboard>>
  >

  constructor({
    requests,
  }: {
    requests: Requests<Target, User, Keyboard, Message, _Dialog>
  }) {
    REQUESTS = requests
    this.requests = requests
  }

  private setDIALOG(item: Omit<_Dialog, "messages">) {
    const chat = this._dialogs[item.id]
    if (chat) {
      chat.setter("isFullLoad", item.isFullLoad)
      chat.setter("isLoading", item.isLoading)
      chat.setter("isTyping", item.isTyping)
      chat.setter("user", item.user)
      if (item.lastMessage) {
        const message = chat.newMessage(item.lastMessage)
        chat.setter("lastMessageId", message.id)
      }
    } else {
      const chat = new Chat<Target, User, Keyboard, Message, _Dialog>(item)
      if (item.lastMessage) {
        const message = chat.newMessage(item.lastMessage)
        chat.setter("lastMessageId", message.id)
      }
      this._setDialogs(
        produce((store) => {
          store[item.id] = chat
          return store
        }),
      )
    }
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
    return dialogs
  }

  /* Получение диалога по ID */
  public getById(id: string): Chat<Target, User, Keyboard> | undefined {
    return this._dialogs[id]
  }

  public getClass() {
    return Chat<Target, User, Keyboard, Message, _Dialog>
  }
}
