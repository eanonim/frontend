import init, { Status } from "@elum/ews"
import { Mutex } from "@minsize/mutex"
import { sleep, unlink } from "@minsize/utils"
import { getter } from "elum-state/solid"
import { setter, getter as getterSmart } from "engine/modules/smart-data"
import {
  addMessage,
  AUTH_TOKEN_ATOM,
  CHAT_LIST_ATOM,
  MESSAGE_INFO_ATOM,
  setTyping,
} from "engine/state"
import { HOST } from "root/configs"
import { pages, pushPage, replacePage } from "router"
import { createEffect, createSignal, on } from "solid-js"
import { createStore, produce } from "solid-js/store"

export type SocketError = {
  code: number
  message: string
  critical?: boolean
}

export type SearchInteresting =
  | "music"
  | "travel"
  | "sport"
  | "art"
  | "cooking"
  | "movies"
  | "games"
  | "reading"
  | "tech"
  | "animals"
  | "nature"
  | "photography"
  | "dance"
  | "space"
  | "science"
  | "history"
  | "fashion"
  | "yoga"
  | "psychology"
  | "volunteering"
  | "flirt"
  | "crypto"
  | "anime"
  | "lgbt"

export type Socket = {
  "message.typing": {
    request: {
      dialog: string
    }
    response: {
      result: boolean
    }
    event: {
      dialog: string
    }
  }
  "message.delete": {
    request: {
      dialog: string
      message_id: number
    }
    response: {
      result: boolean
      dialog: string
    }
    event: {
      dialog: string
      message_id: number
    }
  }
  "message.read": {
    request: {
      dialog: string
      message_id: number
    }
    response: {
      result: boolean
    }
    event: {
      dialog: string
      message_id: number
    }
  }
  "message.list": {
    request: {
      dialog: string
      offset: number
      count: number
    }
    response?: Array<{
      id: number
      message?: string
      target: "my" | "you"
      attach?: {
        type: "photo" | "audio"
        items: Array<{
          name: string
          data: string
        }>
      }
      reply?: {
        id: number
        message: string
        attach_type?: "photo" | "audio"
      }
      readed: boolean
      time: Date
      deleted: boolean

      edit?: boolean
      loading?: boolean
    }>
  }
  "message.edit": {
    request: {
      dialog: string
      message: {
        message?: string
        attach?: {
          type: string
          items: Array<{
            name: string
            data: string
          }>
        }
        reply_id?: number
      }
    }
    response: {
      result: boolean
      id: number
    }
    event: {
      dialog: string
      message: {
        id: number
        message?: string
        attach?: {
          type: string
          items: Array<{
            name: string
            data: string
          }>
        }
        reply?: {
          id: number
          message: string
        }
        readed: boolean
        time: Date
        deleted: boolean
      }
    }
  }
  "message.send": {
    request: {
      dialog: string
      message: {
        message?: string
        attach?: {
          type: "photo" | "audio"
          items: Array<{
            name: string
            data: string
          }>
        }
        reply_id?: number
      }
    }
    response: {
      result: boolean
      id: number
    }
    event: {
      dialog: string
      message: {
        id: number
        message?: string
        target: "my" | "you"
        attach?: {
          type: "photo" | "audio"
          items: Array<{
            name: string
            data: string
          }>
        }
        reply?: {
          id: number
          message: string
        }
        readed: boolean
        time: Date
        deleted: boolean
      }
    }
  }
  "chat.list": {
    request: {}
    response: {
      uuid: string

      message_target?: "my" | "you"

      message?: string
      message_id?: number
      message_time?: Date
      message_attack_type?: "photo" | "audio"
      readed?: boolean

      /* CUSTOM */
      typing?: boolean
      loading?: boolean
    }[]
  }
  "chat.search": {
    request: {
      language: string
      your_start: number
      your_end: number
      /**
       * 0 - мужское
       * 1 - женское
       */
      your_sex: number

      my_age: number
      /**
       * 0 - мужское
       * 1 - женское
       */
      my_sex: number
    } & {
      [key in SearchInteresting]?: boolean
    }
    response: {
      dialog: string
    }
    event: { dialog: string }
  }
  "store.delete": {
    request: {
      key: "interest"
      value: SearchInteresting
    }
    response: {
      result: boolean
    }
  }
  "store.options": {
    request: {
      key: "interest" | "themeColor" | "backgroundId"
    }
    response: {
      interest: {
        [key in SearchInteresting]: {
          key: "interest"
          value: SearchInteresting
          is_premium: boolean
        }
      }
      themeColor: {
        [key in "pink" | "standard"]: {
          key: "themeColor"
          value: "pink" | "standard"
          is_premium: boolean
        }
      }
      backgroundId: {
        [key in number]: {
          key: "backgroundId"
          value: number
          is_premium: boolean
        }
      }
    }
  }
  "store.set": {
    request:
      | {
          key: "backgroundColor"
          value: string
        }
      | {
          key: "backgroundId"
          value: number
        }
      | {
          key: "fontSize"
          value: number
        }
      | {
          key: "theme"
          value: "dark" | "light" | "system"
        }
      | {
          key: "themeColor"
          value: "pink" | "standard"
        }
      | {
          key: "interest"
          value: SearchInteresting
        }
      | {
          key: "filterMyAge"
          value: number
        }
      | {
          key: "filterMySex"
          value: "man" | "woman"
        }
      | {
          key: "filterYourAgeEnd"
          value: number
        }
      | {
          key: "filterYourAgeStart"
          value: number
        }
      | {
          key: "filterYourSex"
          value: "man" | "woman" | "any"
        }
    response: {
      result: boolean
    }
  }
  "store.get": {
    request: {
      key: string
    }
    response: Record<string, string | number | boolean>
  }
  "store.list": {
    request: {}
    response: {
      fontSize: number
      backgroundId: number
      backgroundColor: string
      theme: "dark" | "light" | "system"
      themeColor: "pink" | "standard"
      interest: SearchInteresting[]
      filterMyAge?: number
      filterMySex?: "man" | "woman"
      filterYourAgeStart?: number
      filterYourAgeEnd?: number
      filterYourSex?: "man" | "woman" | "any"
    }
  }
  "user.get": {
    request: {}
    response: {
      id: number
      image: string
      emoji: number
      first_name: string
      last_name: string
      premium: Date
    }
  }
}

const [store, setStore] = createStore({
  socket: init<Socket, SocketError>({
    //url: "wss://dev.elum.app?66a8cb192ea93182aaa11d6d50d83be39fe6ef9617c823f66e41edc5ea63890a7ddf9ae226c9893c48078d2fd7ab720b22fdd747e6",
    url: `wss://${HOST}?${getter(AUTH_TOKEN_ATOM)}`,
    autoConnect: false,
    autoReconnect: false,
  }),
})

export const socket = store.socket

export const updateSocketToken = (token: string = getter(AUTH_TOKEN_ATOM)) => {
  socket.disconnect()
  socket.terminate()
  setStore(
    "socket",
    init<Socket, SocketError>({
      //url: "wss://dev.elum.app?66a8cb192ea93182aaa11d6d50d83be39fe6ef9617c823f66e41edc5ea63890a7ddf9ae226c9893c48078d2fd7ab720b22fdd747e6",
      url: `wss://${HOST}?${token}`,
      autoConnect: true,
      autoReconnect: true,
    }),
  )

  socket.onEvents(({ data, event }) => {
    console.log("server socket", data, event)

    if (event === "connection.duplicated") {
      replacePage({ pageId: pages.DUPLICATED, is_back: false })
    }

    if (event === "message.send") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const message = data.response.message
        const messageInfo = getterSmart(MESSAGE_INFO_ATOM, data.response.dialog)
        if (messageInfo.history.size !== 0) {
          setter(
            [MESSAGE_INFO_ATOM, data.response.dialog],
            produce((messages) => {
              addMessage(messages, message)
              return messages
            }),
          )
        }

        const chatList = getterSmart(CHAT_LIST_ATOM)
        if (!!chatList.history[dialog]) {
          setter(
            CHAT_LIST_ATOM,
            produce((chats) => {
              const chat = chats.history[dialog]
              if (chat) {
                chat.message = message.message
                chat.message_id = message.id
                chat.message_attack_type = message.attach?.type
                chat.message_time = message.time
                chat.message_target = message.target
                chat.readed = message.readed
                chat.typing = false
              }
              return chats
            }),
          )
        }
      }
    }

    if (event === "message.delete") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const messageInfo = getterSmart(MESSAGE_INFO_ATOM, data.response.dialog)
        if (messageInfo.history.size !== 0) {
          setter(
            [MESSAGE_INFO_ATOM, data.response.dialog],
            produce((messages) => {
              let message = unlink(
                messages.history.get(data.response.message_id),
              )
              if (message) {
                message.deleted = true
                messages.history.set(data.response.message_id, message)

                message = messages.history.get(data.response.message_id)
                if (message) {
                  const [dialogIndex, groupMessagesIndex, messageIndex] =
                    message.indexes
                  if (
                    messages.dialogs[dialogIndex][1][groupMessagesIndex][
                      messageIndex
                    ]
                  ) {
                    messages.dialogs[dialogIndex][1][groupMessagesIndex][
                      messageIndex
                    ] = message
                  }
                }
              }

              return messages
            }),
          )
        }

        const message = messageInfo.history.get(data.response.message_id)
        if (message) {
          const chatList = getterSmart(CHAT_LIST_ATOM)
          if (!!chatList.history[dialog]) {
            setter(
              CHAT_LIST_ATOM,
              produce((chats) => {
                const chat = chats.history[dialog]
                if (chat && chat.message_id === message.id) {
                  for (let i = message.id; i > 0; i--) {
                    const _message = messageInfo.history.get(i)
                    if (_message) {
                      chat.message = _message.message
                      chat.message_target = _message.target
                      chat.message_id = _message.id
                      chat.message_attack_type = _message.attach?.type
                      chat.message_time = _message.time
                      chat.readed = _message.readed
                      break
                    }
                    if (i === 0) {
                      chat.message = undefined
                      chat.message_id = undefined
                      chat.message_attack_type = undefined
                      chat.message_target = undefined
                      chat.message_time = undefined
                      chat.readed = undefined
                    }
                  }
                }
                return chats
              }),
            )
          }
        }
      }
    }

    if (event === "message.read") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const messageInfo = getterSmart(MESSAGE_INFO_ATOM, data.response.dialog)
        if (messageInfo.history.size !== 0) {
          setter(
            [MESSAGE_INFO_ATOM, data.response.dialog],
            "last_read_message_id",
            data.response.message_id,
          )
        }
        const chatList = getterSmart(CHAT_LIST_ATOM)
        if (!!chatList.history[dialog]) {
          setter(
            CHAT_LIST_ATOM,
            produce((chats) => {
              const chat = chats.history[dialog]
              console.log(
                "message.read",
                chat.message_id,
                data.response.message_id,
              )
              if (chat && chat.message_id === data.response.message_id) {
                chat.readed = true
              }
              return chats
            }),
          )
        }
      }
    }

    if (event === "chat.search") {
      if (data.response?.dialog) {
        pushPage({
          pageId: pages.CHAT,
          params: { dialog: data.response?.dialog },
        })
      }
    }

    if (event === "message.typing") {
      const dialog = data.response?.dialog
      if (dialog) {
        setTyping(dialog)
      }
    }
  })
}

const [status, setStatus] = createSignal(false)

const mutex = Mutex({ globalLimit: 1 })

createEffect(
  on(
    () => store.socket.status(),
    (status) => {
      console.log({ status })
      if (status === Status.OPEN) {
        mutex.release({ key: "lock1" })
        mutex.release({ key: "lock2" })
      }
      setStatus(status === Status.OPEN)
    },
  ),
)

type Result<E, R> =
  | {
      error?: undefined
      response: R
    }
  | {
      error: E
      response?: undefined
    }

export const socketSend = async <KEY extends keyof Socket>(
  key: KEY,
  options: Socket[KEY]["request"],
): Promise<Result<SocketError, Socket[KEY]["response"]>> => {
  await mutex.wait({ key: "lock1", limit: 1 })
  if (status()) {
    mutex.release({ key: "lock1" })
    mutex.release({ key: "lock2" })
  }
  await mutex.wait({ key: "lock2", limit: 1 })
  if (status()) {
    mutex.release({ key: "lock1" })
    mutex.release({ key: "lock2" })
  }

  console.log("socketSend", key, options)
  const data = await socket.send(key, options)
  if ([0, 1001].includes(data?.error?.code ?? -1)) {
    await sleep(1_000)
    return await socketSend(key, options)
  }
  return data
}
