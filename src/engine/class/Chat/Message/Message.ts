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

  public id: number
  public text?: string
  public target: Target
  public attach?: {
    type: "photo" | "audio"
    items: Array<{
      name: string
      data: string
    }>
  }
  public reply?: {
    id: number
    message: string
    attachType?: "photo" | "audio"
  }
  public time: Date

  public keyboard?: Keyboard[][]

  public isOnlyEmoji?: boolean

  public isLoading?: boolean
  public isEdit?: boolean
  public isRead?: boolean
  public isDeleted?: boolean

  public indexes: [number, number, number]

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

    const [getter] = this.initStore

    this.id = getter.id
    this.text = getter.text
    this.target = getter.target
    this.attach = getter.attach
    this.time = getter.time
    this.keyboard = getter.keyboard
    this.isOnlyEmoji = getter.isOnlyEmoji
    this.isLoading = getter.isLoading
    this.isEdit = getter.isEdit
    this.isRead = getter.isRead
    this.isDeleted = getter.isDeleted
    this.indexes = getter.indexes

    this.requestDelete = this.requestDelete.bind(this)
    this.requestRead = this.requestRead.bind(this)

    this.setDeleteStatus = this.setDeleteStatus.bind(this)
    this.setRead = this.setRead.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.setId = this.setId.bind(this)
    this.setText = this.setText.bind(this)
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

  /* Возвращает реактивность */
  public getSignal() {
    return this.initStore[0]
  }

  /* Изменение сообщения */
  public setText(newText: string) {
    this.initStore[1](
      produce((store) => {
        store.text = newText
        return store
      }),
    )
  }

  /* Изменяет ID сообщения */
  public setId(newId: number) {
    const chat = dialogs[this.chatId]
    if (!chat) return false

    this.initStore[1](
      produce((store) => {
        const message = chat.messages.history.get(this.id)
        if (message) {
          chat.messages.history.delete(this.id)
          store.id = newId
          this.id = newId

          chat.messages.history.set(this.id, message)
        }

        return store
      }),
    )
  }

  /* Установка статуса загрузки */
  public setLoading(status: boolean) {
    this.initStore[1](
      produce((store) => {
        store.isLoading = status
        this.isLoading = status
        return store
      }),
    )
  }

  /* Установка статуса удаления */
  public setDeleteStatus(status: boolean) {
    if (status) {
      this.requestDelete()
    }

    this.initStore[1](
      produce((store) => {
        store.isDeleted = status
        return store
      }),
    )
    return true
  }

  /* Установка статуса прочтения */
  public setRead(status: boolean) {
    const chat = dialogs[this.chatId]
    if (!chat) return false

    if (status && (chat.messages.lastReadMessageId || 0) < this.id) {
      setDialogs(
        chat.id,
        produce((store) => {
          store.messages.lastReadMessageId = this.id
          return store
        }),
      )
      this.requestRead()
    }
    this.initStore[1](
      produce((store) => {
        store.isRead = status
        return store
      }),
    )
    return false
  }
}
