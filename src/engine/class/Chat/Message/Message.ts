import {
  DefaultKeyboard,
  DefaultTarget,
  DefaultUser,
  Dialog,
  ObjectMessage,
  Requests,
  ClassMessageProps,
  DefaultAttach,
} from "../types"
import { createStore, produce, SetStoreFunction, Store } from "solid-js/store"
import { dialogs, REQUESTS } from "../createChats"

export class Message<
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
  private chatId: string

  private initStore: [
    get: Store<ClassMessageProps<Target, Keyboard, Attach>>,
    set: SetStoreFunction<ClassMessageProps<Target, Keyboard, Attach>>,
  ]

  private requests: Partial<
    Requests<Target, User, Keyboard, Attach, Message, _Dialog>
  > = {}

  constructor(
    params: ClassMessageProps<Target, Keyboard, Attach> & { chatId: string },
  ) {
    this.chatId = params.chatId
    this.requests = REQUESTS as Requests<
      Target,
      User,
      Keyboard,
      Attach,
      Message,
      _Dialog
    >
    this.initStore =
      createStore<ClassMessageProps<Target, Keyboard, Attach>>(params)

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

        // if (key === "isDeleted") {
        //   const chat = dialogs[this.chatId]
        //   if (chat && chat.lastMessageId === this.id) {
        //     for (let i = this.id - 1; i > 0; i--) {
        //       const _message = chat.messages.history[i]
        //       if (_message && !_message.isDeleted) {
        //         chat.setter("lastMessageId", _message.id)
        //         break
        //       }
        //       if (i === 0) {
        //         chat.setter("lastMessageId", 0)
        //       }
        //     }
        //   }
        // }

        if (key === "id") {
          const newId = Number(value)
          const chat = dialogs[this.chatId]
          if (chat) {
            const message = chat.messages.history[this.id]
            if (message) {
              this.initStore[1]("id", newId)

              chat.setStore(
                produce((store) => {
                  store.messages.history[newId] = message

                  if ((store.lastMessageId || 0) <= newId) {
                    store.lastMessageId = newId
                  }

                  return store
                }),
              )
            }
          }
        }

        if (key === "isRead" && !store[key] && this.target !== "my") {
          this.requestRead()
        }

        if (key === "isRead") {
          const chat = dialogs[this.chatId]
          if (chat) {
            if (value && (chat.messages.lastReadMessageId || 0) <= this.id) {
              chat.setStore(
                "messages",
                produce((store) => {
                  store.lastReadMessageId = this.id
                  return store
                }),
              )
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
  get type() {
    return this.initStore[0].type
  }
  get isShow() {
    return this.initStore[0].isShow
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
  get replyId() {
    return this.initStore[0].replyId
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
