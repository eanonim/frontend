import { dialogs, setDialogs, REQUESTS } from "./createChats"
import { Message as ClassMessage, Message } from "./Message/Message"

import {
  ObjectMessage,
  DefaultKeyboard,
  DefaultTarget,
  Dialog,
  DefaultUser,
  Requests,
  ClassMessageProps,
} from "./types"
import { getFullDate } from "./utils"
import { createStore, produce } from "solid-js/store"

export class Chat<
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
  private initStore = createStore<
    Dialog<Target, User, Keyboard, ObjectMessage<Target, User, Keyboard>>
  >({
    id: "",
    user: {} as any,
    messages: {
      dialogs: [] as any,
      history: new Map(),
      lastOffset: 0,
    },
    isFullLoad: false,
  } as _Dialog)
  private store = this.initStore[0]
  private setStore = this.initStore[1]

  private chatId: string = ""

  private requests: Partial<
    Requests<Target, User, Keyboard, Message, _Dialog>
  > = {}

  constructor(params: { dialog: string }) {
    this.chatId = params.dialog
    this.requests = REQUESTS as Partial<
      Requests<Target, User, Keyboard, Message, _Dialog>
    >

    const chat = dialogs[params.dialog] as _Dialog
    if (!chat) {
      this.setStore(
        produce((store) => {
          store.id = this.chatId
          return store
        }),
      )
      this.uploadChats()
    } else {
      this.setStore(
        produce((store) => {
          Object.assign(store, chat)
          return store
        }),
      )
    }

    this.getHistory = this.getHistory.bind(this)
    this.uploadChats = this.uploadChats.bind(this)
    this.uploadChatHistory = this.uploadChatHistory.bind(this)
    this.newMessage = this.newMessage.bind(this)
    this.initMessage = this.initMessage.bind(this)
    this.get = this.get.bind(this)
    this.uploadChatById = this.uploadChatById.bind(this)
    this.getFullLoad = this.getFullLoad
  }

  /* Загрузка чата в кеш */
  private setDIALOG(item: Omit<_Dialog, "messages">) {
    const chat = dialogs[item.id]
    if (chat) {
      setDialogs(
        chat.id,
        produce((store) => {
          Object.assign(store, item)
          return store
        }),
      )
    } else {
      const data = {
        id: item.id,
        user: item.user,
        messages: {
          dialogs: [] as any,
          history: new Map(),
          lastOffset: 0,
        },
        isFullLoad: false,
      }
      setDialogs(
        produce((store) => {
          store[item.id] = data
          return store
        }),
      )
    }
    const chat2 = dialogs[item.id] as _Dialog
    if (chat2) {
      if (this.chatId === item.id) {
        this.setStore(
          produce((store) => {
            Object.assign(store, chat2)
            return store
          }),
        )
      }
    }
  }

  /* Добавление сообщения */
  private initMessage(
    _message: Omit<ClassMessageProps<Target, Keyboard>, "indexes">,
    typePush: "push" | "unshift" = "unshift",
  ) {
    const groupMessagesCount = 20

    const chat = dialogs[this.chatId] as _Dialog

    if (!chat) {
      this.uploadChats()
      console.error("Чата не существует")
      return undefined
    }

    const isMessage = this.store.messages.history.has(_message.id)
    if (isMessage) {
      return this.getMessageById(_message.id)
    }

    const message = new ClassMessage<Target, User, Keyboard>({
      ..._message,
      ...{ chatId: this.chatId, indexes: [0, 0, 0] },
    })

    this.setStore(
      produce((store) => {
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
        dialogIndex = store.messages.dialogs.findIndex((x) => x[0] === fullTime)
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

        message.indexes = [dialogIndex, groupMessagesIndex, messageIndex]

        store.messages.history.set(message.id, message)

        if (
          message.isRead &&
          message.id > (store.messages.lastReadMessageId || 0)
        ) {
          store.messages.lastReadMessageId = message.id
        }

        if (store.lastMessageId) {
          if (store.lastMessageId < message.id) {
            store.lastMessageId = message.id
          }
        }

        setDialogs(
          store.id,
          produce((chat) => {
            Object.assign(chat, store)
            return chat
          }),
        )
        return store
      }),
    )
    return message
  }

  /* Получение статуса о полной загрузки истории сообщений */
  public getFullLoad() {
    return !!this.store.isFullLoad
  }

  /* Получение статуса прочитанного сообщения */
  public checkRead(messageId: number) {
    return messageId < (this.store.messages.lastReadMessageId || 0)
  }

  /* Получение данных чата */
  public get() {
    return this.store
  }

  /* Получить данные собеседника */
  public getUser() {
    return this.store.user
  }

  /* Добавляет новое сообщение */
  public newMessage(
    message: Omit<ClassMessageProps<Target, Keyboard>, "indexes">,
  ) {
    return this.initMessage(message, "unshift")
  }

  public getHistory() {
    if (!this.store.messages.dialogs.length) {
      this.uploadChatHistory()
    }
    return this.store.messages.dialogs
  }

  /* Поиск сообщения */
  public getMessageById(message_id: number) {
    if (!this.store) {
      console.error("Чата не существует")
      return undefined
    }
    /* Проверка на существование сообщения */
    if (!this.store.messages.history.has(message_id)) {
      console.error("Сообщения не существует")
      return undefined
    }

    return this.store.messages.history.get(message_id)
  }

  /* Загрузка чата по идентификатору */
  public async uploadChatById(id: string) {
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
  public async uploadChats() {
    if (Object.keys(dialogs).length !== 0) {
      return await this.uploadChatById(this.chatId)
    }

    const request = this.requests["chat.getList"]
    if (!request) {
      console.error('Нет функции для вызова "chat.getList"')
      return false
    }
    const { response, error } = await request({ offset: 0, count: 0 })

    if (response) {
      for (const item of response) {
        this.setDIALOG(item)
        if (item.lastMessage) {
          this.initMessage(item.lastMessage)
        }
      }
      return true
    }
    return false
  }

  /* Загрузка истории чата */
  public async uploadChatHistory() {
    if (this.store.messages.isLoading) return false

    const request = this.requests["message.getHistory"]
    if (!request) {
      console.error('Нет функции для вызова "message.getHistory"')
      return false
    }
    this.setStore("messages", "isLoading", true)
    try {
      const offset = this.store.messages.lastOffset || 0
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
        for (const message of response) {
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
