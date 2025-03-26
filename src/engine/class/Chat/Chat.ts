import { dialogs, REQUESTS } from "./createChats"
import { Message as ClassMessage } from "./Message/Message"

import {
  ObjectMessage,
  DefaultKeyboard,
  DefaultTarget,
  Dialog,
  DefaultUser,
  Requests,
  ClassMessageProps,
  DefaultAttach,
} from "./types"
import { getFullDate } from "./utils"
import { createStore, produce, SetStoreFunction, Store } from "solid-js/store"
export class Chat<
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
  private _dialogs = dialogs as unknown as Record<
    string,
    Chat<Target, User, Keyboard, Attach>
  >
  private initStore: [
    get: Store<
      Dialog<
        Target,
        User,
        Keyboard,
        Attach,
        ObjectMessage<Target, User, Keyboard, Attach>
      >
    >,
    set: SetStoreFunction<
      Dialog<
        Target,
        User,
        Keyboard,
        Attach,
        ObjectMessage<Target, User, Keyboard, Attach>
      >
    >,
  ]
  private store: (typeof this.initStore)[0]
  public setStore: (typeof this.initStore)[1]

  private loadChatById: (id: string) => Promise<boolean>

  private timerTyping: NodeJS.Timeout | undefined
  private chatId: string = ""

  private requests: Partial<
    Requests<Target, User, Keyboard, Attach, Message, _Dialog>
  > = {}

  constructor(params: {
    id: string
    user: User
    loadChatById: (id: string) => Promise<boolean>
  }) {
    this.loadChatById = params.loadChatById
    this.initStore = createStore<
      Dialog<
        Target,
        User,
        Keyboard,
        Attach,
        ObjectMessage<Target, User, Keyboard, Attach>
      >
    >({
      id: params.id,
      user: params.user,
      messages: {
        dialogs: [] as any,
        history: {},
        lastOffset: 0,
      },
      isFullLoad: false,
    })

    this.store = this.initStore[0]
    this.setStore = this.initStore[1]

    this.chatId = params.id
    this.requests = REQUESTS as Partial<
      Requests<Target, User, Keyboard, Attach, Message, _Dialog>
    >

    this.getHistory = this.getHistory.bind(this)
    this.uploadChatHistory = this.uploadChatHistory.bind(this)
    this.newMessage = this.newMessage.bind(this)
    this.initMessage = this.initMessage.bind(this)
    this.setter = this.setter.bind(this)
  }

  public setter<
    KEY extends keyof (typeof this.initStore)[0],
    VALUE extends (typeof this.initStore)[0][KEY],
  >(key: KEY, value: VALUE) {
    this.initStore[1](
      produce((store) => {
        if (key === "isTyping" && value) {
          clearTimeout(this.timerTyping)
          this.timerTyping = setTimeout(
            (() => {
              this.setter("isTyping", false)
            }).bind(this),
            5000,
          )
        }

        store[key] = value
        return store
      }),
    )
  }

  get id() {
    return this.store.id
  }
  get isFullLoad() {
    return this.store.isFullLoad
  }
  get isLoading() {
    return this.store.isLoading
  }
  get isTyping() {
    return this.store.isTyping
  }
  get lastMessageId() {
    return this.store.lastMessageId
  }
  get message() {
    return this.store.message
  }
  get messages() {
    return this.store.messages
  }
  get user() {
    return this.store.user
  }

  /* Установка сообщения которое хочет отправить пользователь */
  public setMessage<
    KEY extends keyof NonNullable<
      Dialog<
        Target,
        User,
        Keyboard,
        Attach,
        ObjectMessage<Target, User, Keyboard, Attach>
      >["message"]
    >,
    VALUE extends NonNullable<
      Dialog<
        Target,
        User,
        Keyboard,
        Attach,
        ObjectMessage<Target, User, Keyboard, Attach>
      >["message"]
    >[KEY],
  >(key: KEY, value: VALUE) {
    this.setStore(
      produce((store) => {
        if (!store.message) store.message = {}
        store.message[key] = value

        return store
      }),
    )
  }

  /* Добавление сообщения */
  private initMessage(
    _message: Omit<ClassMessageProps<Target, Keyboard, Attach>, "indexes">,
    typePush: "push" | "unshift" = "unshift",
  ) {
    const groupMessagesCount = 20

    const isMessage = this.getMessageById(_message.id)

    const message = isMessage
      ? isMessage
      : new ClassMessage<Target, User, Keyboard, Attach>({
          ..._message,
          ...{ chatId: this.chatId, indexes: [0, 0, 0] },
        })

    this.setStore(
      produce((store) => {
        if (!isMessage) {
          const fullTime = getFullDate(message.time)

          let dialogIndex = 0
          let groupMessagesIndex = 0
          let messageIndex = 0

          const countEmpty = 20 // Количество пустых ячеек

          // добавляем группу сообщения за сегодняшний день
          const fullTimeToday = getFullDate(new Date())
          dialogIndex = store.messages.dialogs.findIndex(
            (x) => x[0] === fullTimeToday,
          )
          if (dialogIndex === -1) {
            dialogIndex = store.messages.dialogs.length
            store.messages.dialogs.push([
              fullTimeToday,
              Array.from({ length: countEmpty }, () => []),
            ])
          }

          // Забиваем Array, для следующих сообщений, что бы Index`ы работали нормально
          dialogIndex = store.messages.dialogs.findIndex(
            (x) => x[0] === fullTime,
          )
          if (dialogIndex === -1) {
            dialogIndex = store.messages.dialogs.length
            store.messages.dialogs.push([
              fullTime,
              Array.from({ length: countEmpty }, () => []),
            ])
          }

          let groupMessages = store.messages.dialogs[dialogIndex][1]

          if (groupMessages.length === 0) {
            for (let i = 0; i < countEmpty; i++) {
              store.messages.dialogs[dialogIndex][1][i] = []
            }
          }

          if (dialogIndex !== -1) {
            if (typePush === "push") {
              groupMessagesIndex = groupMessages.findLastIndex(
                (group, index) =>
                  index >= countEmpty &&
                  group.filter(Boolean).length < groupMessagesCount,
              )

              if (groupMessagesIndex === -1) {
                groupMessagesIndex = groupMessages.length
                groupMessages[groupMessagesIndex] = []
              }

              messageIndex =
                groupMessagesCount -
                groupMessages[groupMessagesIndex].filter(Boolean).length -
                1
              groupMessages[groupMessagesIndex][messageIndex] = message
            } else {
              groupMessagesIndex = groupMessages.findLastIndex(
                (x, index) =>
                  index < countEmpty &&
                  x.filter(Boolean).length < groupMessagesCount,
              )

              if (groupMessagesIndex === -1) {
                groupMessagesIndex = 0
              }

              messageIndex =
                groupMessages[groupMessagesIndex].filter(Boolean).length

              if (!!groupMessages[groupMessagesIndex][messageIndex]) {
                messageIndex += 1
              }

              groupMessages[groupMessagesIndex][messageIndex] = message
            }
          }

          message.setter("indexes", [
            dialogIndex,
            groupMessagesIndex,
            messageIndex,
          ])
          console.log("ADD New Message")
          store.messages.history[message.id] = message
        } else {
          message.setter("attach", _message.attach)
          message.setter("isDeleted", _message.isDeleted)
          message.setter("isEdit", _message.isEdit)
          message.setter("isLoading", _message.isLoading)
          message.setter("isOnlyEmoji", _message.isOnlyEmoji)
          message.setter("isRead", _message.isRead)
          message.setter("keyboard", _message.keyboard)
          message.setter("reply", _message.reply)
          message.setter("target", _message.target)
          message.setter("text", _message.text)
          message.setter("time", _message.time)
        }
        if (
          message.isRead &&
          message.id > (store.messages.lastReadMessageId || 0)
        ) {
          store.messages.lastReadMessageId = message.id
        }

        if ((store.lastMessageId || 0) < message.id) {
          store.lastMessageId = message.id
        }
        return store
      }),
    )

    // setDialogs(
    //   this.store.id,
    //   produce((chat) => {
    //     Object.assign(chat, this.store)
    //     return chat
    //   }),
    // )

    return message
  }

  /* Получение статуса прочитанного сообщения */
  public checkRead(messageId: number) {
    return messageId <= (this.messages.lastReadMessageId || 0)
  }

  /* Добавляет новое сообщение */
  public newMessage(
    message: Omit<ClassMessageProps<Target, Keyboard, Attach>, "indexes">,
  ) {
    return this.initMessage(message, "unshift")
  }

  public getHistory() {
    return this.messages.dialogs
  }

  /* Поиск сообщения */
  public getMessageById(message_id?: number) {
    if (!message_id) return undefined

    return this.messages.history[message_id]
  }

  /* Загрузка чата по идентификатору */
  // public async uploadChatById(id: string) {
  //   const request = this.requests["chat.getById"]
  //   if (!request) {
  //     console.error('Нет функции для вызова "chat.getById"')
  //     return false
  //   }
  //   const { response, error } = await request({ id })

  //   if (response) {
  //     this.setDIALOG(response)
  //     return true
  //   }

  //   return false
  // }

  /* Загрузка истории чата */
  public async uploadChatHistory() {
    if (!this._dialogs[this.chatId]) {
      await this.loadChatById(this.id)
    }

    if (this.isLoading) {
      console.error("this.isLoading")
      return false
    }

    const request = this.requests["message.getHistory"]
    if (!request) {
      console.error('Нет функции для вызова "message.getHistory"')
      return false
    }
    this.setStore("messages", "isLoading", true)
    try {
      const offset = this.messages.lastOffset || 0
      const { response, error } = await request({
        id: this.chatId,
        offset: offset,
        count: 200,
      })

      if (!error && (response.length === 0 || !response)) {
        this.setStore("isFullLoad", true)
      }

      if (response) {
        this.setStore("messages", "lastOffset", offset + 200)
        for (const message of response.reverse()) {
          this.initMessage(message, "push")
        }
        return true
      }
    } finally {
      this.setStore("messages", "isLoading", false)
    }
    return false
  }
}
