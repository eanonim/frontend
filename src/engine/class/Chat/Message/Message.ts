import {
  DefaultKeyboard,
  DefaultTarget,
  DefaultUser,
  Dialog,
  ObjectMessage,
  Requests,
  ClassMessageProps,
} from "../types"
import { createStore, produce, SetStoreFunction, Store } from "solid-js/store"
import { dialogs, setDialogs, REQUESTS } from "../createChats"

export class Message<
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
  private chatId: string

  private initStore: [
    get: Store<ClassMessageProps<Target, Keyboard>>,
    set: SetStoreFunction<ClassMessageProps<Target, Keyboard>>,
  ]

  private requests: Partial<
    Requests<Target, User, Keyboard, Message, _Dialog>
  > = {}

  constructor(
    params: ClassMessageProps<Target, Keyboard> & { chatId: string },
  ) {
    this.chatId = params.chatId
    this.requests = REQUESTS as Requests<
      Target,
      User,
      Keyboard,
      Message,
      _Dialog
    >
    this.initStore = createStore<ClassMessageProps<Target, Keyboard>>(params)

    this.requestDelete = this.requestDelete.bind(this)
    this.requestRead = this.requestRead.bind(this)
  }

  public setter<
    KEY extends keyof (typeof this.initStore)[0],
    VALUE extends (typeof this.initStore)[0][KEY],
  >(key: KEY, value: VALUE) {
    this.initStore[1](
      produce((store) => {
        if (
          key === "isDeleted" &&
          value &&
          !store[key] &&
          this.target === "my"
        ) {
          this.requestDelete()
        }

        if (key === "isDeleted") {
          const chat = dialogs[this.chatId]
          if (chat && chat.lastMessageId === this.id) {
            for (let i = this.id - 1; i > 0; i--) {
              const _message = chat.messages.history[i]
              if (_message && !_message.isDeleted) {
                chat.setter("lastMessageId", _message.id)
                break
              }
              if (i === 0) {
                chat.setter("lastMessageId", 0)
              }
            }
          }
        }

        if (key === "id") {
          const newId = Number(value)
          const chat = dialogs[this.chatId]
          if (chat) {
            const message = chat.messages.history[this.id]
            if (message) {
              if ((chat.lastMessageId || 0) < newId) {
                chat.setter("lastMessageId", newId)
              }

              this.initStore[1]("id", newId)

              chat.setter("messages", chat.messages)
              chat.setStore(
                "messages",
                "history",
                produce((history) => {
                  history[newId] = message
                  return history
                }),
              )
            }
          }
        }

        if (key === "isRead") {
          const chat = dialogs[this.chatId]
          if (chat) {
            if (value && (chat.messages.lastReadMessageId || 0) < this.id) {
              setDialogs(
                chat.id,
                produce((store) => {
                  store.messages.lastReadMessageId = this.id
                  return store
                }),
              )
              this.requestRead()
            }
          }
        }

        store[key] = value
        return store
      }),
    )
  }

  get id() {
    return this.initStore[0].id
  }
  get text() {
    return this.initStore[0].text
  }
  get attach() {
    return this.initStore[0].attach
  }
  get indexes() {
    return this.initStore[0].indexes
  }
  get isDeleted() {
    return this.initStore[0].isDeleted
  }
  get isEdit() {
    return this.initStore[0].isEdit
  }
  get isLoading() {
    return this.initStore[0].isLoading
  }
  get isOnlyEmoji() {
    return this.initStore[0].isOnlyEmoji
  }
  get isRead() {
    return this.initStore[0].isRead
  }
  get keyboard() {
    return this.initStore[0].keyboard
  }
  get reply() {
    return this.initStore[0].reply
  }
  get target() {
    return this.initStore[0].target
  }
  get time() {
    return this.initStore[0].time
  }

  private async requestDelete() {
    const request = this.requests["message.delete"]
    if (!request) {
      console.error('Нет функции для вызова "message.delete"')
      return false
    }
    const { response, error } = await request({
      chatId: this.chatId,
      messageId: this.id,
    })

    return !!response
  }

  private async requestRead() {
    const request = this.requests["message.read"]
    if (!request) {
      console.error('Нет функции для вызова "message.read"')
      return false
    }
    const { response, error } = await request({
      chatId: this.chatId,
      messageId: this.id,
    })

    return !!response
  }
}
