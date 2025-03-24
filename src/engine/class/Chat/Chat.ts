import { Message } from "./Message/Message"

import {
  ObjectMessage,
  DefaultKeyboard,
  DefaultTarget,
  Dialog,
  DefaultUser,
  Requests,
} from "./types"
import { getFullDate } from "./utils"
import { createStore, produce } from "solid-js/store"
import { unlink } from "@minsize/utils"
import { createSignal } from "solid-js"

export const [DIALOGS, SetDIALOGS] = createStore<
  Record<
    string,
    Dialog<
      DefaultTarget,
      DefaultUser,
      DefaultKeyboard,
      ObjectMessage<DefaultTarget, DefaultKeyboard>
    >
  >
>({})
const MESSAGES = new Map<
  { dialog: string; message_id: number },
  Message<
    DefaultTarget,
    DefaultUser,
    DefaultKeyboard,
    ObjectMessage<DefaultTarget, DefaultKeyboard>
  >
>()

export var REQUESTS: Partial<
  Requests<DefaultTarget, DefaultUser, DefaultKeyboard>
> = {}

export const initChatRequests = (
  requests: Requests<DefaultTarget, DefaultUser, DefaultKeyboard>,
) => {
  REQUESTS = requests
}

export class createChats<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Message extends ObjectMessage<Target, Keyboard> = ObjectMessage<
    Target,
    Keyboard
  >,
  _Dialog extends Dialog<Target, User, Keyboard, Message> = Dialog<
    Target,
    User,
    Keyboard,
    Message
  >,
> {
  public readonly requests: Partial<
    Requests<Target, User, Keyboard, Message, _Dialog>
  > = {}

  constructor({
    requests,
  }: {
    requests: Requests<Target, User, Keyboard, Message, _Dialog>
  }) {
    REQUESTS = requests
  }

  public getClass() {
    return Chat<Target, User, Keyboard, Message, _Dialog>
  }
}

// setInterval(() => {
//   console.log({ DIALOGS })
// }, 2000)

class Chat<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Message extends ObjectMessage<Target, Keyboard> = ObjectMessage<
    Target,
    Keyboard
  >,
  _Dialog extends Dialog<Target, User, Keyboard, Message> = Dialog<
    Target,
    User,
    Keyboard,
    Message
  >,
> {
  private chatId: string = ""

  private requests: Partial<
    Requests<Target, User, Keyboard, Message, _Dialog>
  > = {}

  constructor(params: { dialog: string }) {
    this.chatId = params.dialog
    this.requests = REQUESTS as Partial<
      Requests<Target, User, Keyboard, Message, _Dialog>
    >
    const chat = DIALOGS[params.dialog]
    if (!chat) {
      SetDIALOGS(
        produce((store) => {
          store[this.chatId] = {
            id: this.chatId,
            user: {} as any,
            messages: {
              dialogs: [] as any,
              history: new Map(),
              lastOffset: 0,
            },
            isFullLoad: false,
          }

          return store
        }),
      )
      this.uploadChats()
    }

    this.getHistory = this.getHistory.bind(this)
    this.uploadChats = this.uploadChats.bind(this)
    this.uploadChatHistory = this.uploadChatHistory.bind(this)
    this.addMessage = this.addMessage.bind(this)
    this.createMessage = this.createMessage.bind(this)
    this.get = this.get.bind(this)
    this.uploadChatById = this.uploadChatById.bind(this)
    this.getFullLoad = this.getFullLoad
  }

  /* Загрузка чата в кеш */
  private setDIALOG(item: Omit<_Dialog, "messages">) {
    const chat = DIALOGS[item.id]
    if (chat) {
      SetDIALOGS(
        item.id,
        produce((store) => {
          Object.assign(store, item)
          // store = { ...chat, ...item }

          return store
        }),
      )
    } else {
      SetDIALOGS(
        produce((store) => {
          store[item.id] = {
            id: item.id,
            user: item.user,
            messages: {
              dialogs: [] as any,
              history: new Map(),
              lastOffset: 0,
            },
            isFullLoad: false,
          }

          return store
        }),
      )
    }
  }

  /* Добавление сообщения */
  private addMessage(
    _message: Message,
    typePush: "push" | "unshift" = "unshift",
  ) {
    const groupMessagesCount = 20

    if (!DIALOGS[this.chatId]) {
      this.uploadChats()
      console.error("Чата не существует")
      return undefined
    }

    SetDIALOGS(
      produce((store) => {
        const message = unlink(_message) as Message & {
          indexes: [number, number, number]
        }

        if (store[this.chatId].messages.history.has(message.id)) return store

        const fullTime = getFullDate(message.time)

        let dialogIndex = 0
        let groupMessagesIndex = 0
        let messageIndex = 0

        const countEmpty = 20 // Количество пустых ячеек

        // добавляем группу сообщения за сегодняшний день
        const fullTimeToday = getFullDate(new Date())
        dialogIndex = store[this.chatId].messages.dialogs.findIndex(
          (x) => x[0] === fullTimeToday,
        )
        if (dialogIndex === -1) {
          dialogIndex = store[this.chatId].messages.dialogs.length
          store[this.chatId].messages.dialogs.push([
            fullTimeToday,
            Array.from({ length: countEmpty }, () => []),
          ])
        }

        // Забиваем Array, для следующих сообщений, что бы Index`ы работали нормально
        dialogIndex = store[this.chatId].messages.dialogs.findIndex(
          (x) => x[0] === fullTime,
        )
        if (dialogIndex === -1) {
          dialogIndex = store[this.chatId].messages.dialogs.length
          store[this.chatId].messages.dialogs.push([
            fullTime,
            Array.from({ length: countEmpty }, () => []),
          ])
        }

        let groupMessages = store[this.chatId].messages.dialogs[dialogIndex][1]

        if (groupMessages.length === 0) {
          for (let i = 0; i < countEmpty; i++) {
            store[this.chatId].messages.dialogs[dialogIndex][1][i] = []
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

        store[this.chatId].messages.history.set(message.id, message)

        if (
          message.isRead &&
          message.id > (store[this.chatId].messages.lastReadMessageId || 0)
        ) {
          store[this.chatId].messages.lastReadMessageId = message.id
        }

        return store
      }),
    )

    return true
  }

  /* Получение статуса о полной загрузки истории сообщений */
  public getFullLoad() {
    return !!DIALOGS[this.chatId].isFullLoad
  }

  /* Получение статуса прочитанного сообщения */
  public checkRead(messageId: number) {
    return messageId < (DIALOGS[this.chatId].messages.lastReadMessageId || 0)
  }

  /* Получение данных чата */
  public get() {
    return DIALOGS[this.chatId]
  }

  /* Получить данные собеседника */
  public getUser() {
    return DIALOGS[this.chatId].user
  }

  /* Добавляет новое сообщение */
  public createMessage(message: Message) {
    return this.addMessage(message, "push")
  }

  public getHistory() {
    if (!DIALOGS[this.chatId].messages.dialogs.length) {
      this.uploadChatHistory()
    }
    return DIALOGS[this.chatId].messages.dialogs
  }

  /* Поиск сообщения */
  public getMessageById(message_id: number) {
    if (!DIALOGS[this.chatId]) {
      console.error("Чата не существует")
      return undefined
    }
    /* Проверка на существование сообщения */
    if (!DIALOGS[this.chatId].messages.history.has(message_id)) {
      console.error("Сообщения не существует")
      return undefined
    }

    const key = { dialog: this.chatId, message_id }

    let message = MESSAGES.get(key)
    if (!message) {
      let message = new Message(this.chatId, message_id)
      MESSAGES.set(key, message)
    }
    return message
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
    if (Object.keys(DIALOGS).length !== 0) {
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
      }
      return true
    }
    return false
  }

  /* Загрузка истории чата */
  public async uploadChatHistory() {
    if (DIALOGS[this.chatId].messages.isLoading) return false

    const request = this.requests["message.getHistory"]
    if (!request) {
      console.error('Нет функции для вызова "message.getHistory"')
      return false
    }
    SetDIALOGS(this.chatId, "messages", "isLoading", true)
    try {
      const offset = DIALOGS[this.chatId].messages.lastOffset || 0
      const { response, error } = await request({
        id: this.chatId,
        offset: offset,
        count: 200,
      })

      if (!error && (response.length === 0 || !response)) {
        SetDIALOGS(this.chatId, "isFullLoad", true)
      }

      if (response) {
        SetDIALOGS(this.chatId, "messages", "lastOffset", offset + 200)
        for (const message of response) {
          this.addMessage(message)
        }
        return true
      }
    } finally {
      SetDIALOGS(this.chatId, "messages", "isLoading", false)
    }
    return false
  }
}
