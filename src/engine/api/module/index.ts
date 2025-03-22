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
import {
  pages,
  panels,
  popouts,
  pushPage,
  pushPopout,
  replacePage,
  useParams,
  useRouter,
  useRouterPanel,
  views,
} from "router"
import { createEffect, createSignal, on } from "solid-js"
import { createStore, produce } from "solid-js/store"
import { chatInfo } from ".."

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

type Target = "my" | "you" | "system"

export type Socket = {
  "user.nameSet": {
    request: {
      first_name: string
      last_name: string
    }
    response: {
      result: boolean
    }
  }
  "user.emojiSet": {
    request: {
      emoji: number
    }
    response: {
      result: boolean
    }
  }
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
      target: Target
      attach?: {
        type: "photo" | "audio"
        items: Array<{
          name: string
          data: string
        }>
      }
      keyboard?: {
        key: "chat_invite_accept" | "chat_invite_reject"
        text: "accept" | "reject"
        event: "chat.inviteAccept" | "chat.inviteReject"
      }[][]
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
      is_emoji?: boolean
    }>
  }
  "message.edit": {
    request: {
      dialog: string
      message: {
        id: number
        message?: string
        attach?: {
          type: "photo" | "audio"
          items: Array<{
            name: string
            data: string
          }>
        }
      }
    }
    response: {
      result: boolean
    }
    event: {
      dialog: string
      message: {
        id: number
        message?: string
        attach?: {
          type: "photo" | "audio"
          items: Array<{
            name: string
            data: string
          }>
        }
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
        target: Target
        keyboard?: {
          key: "chat_invite_accept" | "chat_invite_reject"
          text: "accept" | "reject"
          event: "chat.inviteAccept" | "chat.inviteReject"
        }[][]
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
  "product.get": {
    request: { currency: "XTR" | "TON"; lang: string; group: "premium" }
    response: Record<
      string,
      {
        code: string
        title: string
        description: string
        position: number
        product?: {
          currency: string
          item_id: string
          group: string
          size: "full" | "short"
          link?: string
          items: {
            id: "ticket" | "energy"
            title: string
            description: string
            count: number
            type?: "numeric" | "time" | "input"
            grade?: "common" | "special" | "rare" | "epic" | "legendary"
          }[]
          discount: number
          price: number
          title: string
          description: string
          user_lock?: Date
          global_lock?: Date
        }[]
      }
    >
  }
  "chat.list": {
    request: {}
    response: {
      uuid: string

      message?: {
        id: number
        message?: string
        target: Target
        attack_type?: "photo" | "audio"
        time: Date
        readed: boolean
      }

      user: {
        first_name: string
        last_name: string
        image: string
        emoji?: number
      }

      /* CUSTOM */
      typing?: boolean
      loading?: boolean
    }[]
  }
  "chat.inviteMake": {
    request: {
      dialog: string
    }
    response: {
      result: boolean
    }
    event: undefined
  }
  "chat.inviteAccept": {
    request: {
      dialog: string
    }
    response: {
      result: boolean
    }
    event: undefined
  }
  "chat.inviteReject": {
    request: {
      dialog: string
    }
    response: {
      result: boolean
    }
    event: undefined
  }
  "chat.info": {
    request: {
      dialog: string
    }
    response: {
      uuid: string

      message?: {
        id: number
        message?: string
        target: Target
        attack_type?: "photo" | "audio"
        time: Date
        readed: boolean
      }

      user: {
        first_name: string
        last_name: string
        image: string
        emoji?: number
      }

      /* CUSTOM */
      typing?: boolean
      loading?: boolean
    }
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

      interests: SearchInteresting[]
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
  duplicated: false,
  status: Status.CLOSE,
})

export const socket = store.socket
export const socketStore = store

export const updateSocketToken = (token: string = getter(AUTH_TOKEN_ATOM)) => {
  socket.disconnect()
  socket.terminate()
  setStore("duplicated", false)
  setStore(
    "socket",
    init<Socket, SocketError>({
      //url: "wss://dev.elum.app?66a8cb192ea93182aaa11d6d50d83be39fe6ef9617c823f66e41edc5ea63890a7ddf9ae226c9893c48078d2fd7ab720b22fdd747e6",
      url: `wss://${HOST}?${token}`,
      autoConnect: true,
      autoReconnect: true,
    }),
  )

  socket.onEvents(async ({ data, event }) => {
    console.log("server socket", data, event)

    if (event === "connection.duplicated") {
      setStore("duplicated", true)
      replacePage({ pageId: pages.DUPLICATED, is_back: false })
    }

    if (event === "message.send") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const view = useRouter("view")

        let notification = false

        if (view() === views.CHATS) {
          const panel = useRouterPanel(view)
          if (panel() === panels.CHAT) {
            const params = useParams<{ dialog: string }>({ pageId: pages.CHAT })
            if (params().dialog !== dialog) {
              notification = true
            }
          } else notification = true
        } else notification = true

        if (notification) {
          pushPopout({
            popoutId: popouts.NEW_MESSAGE,
            params: {
              dialog: dialog,
              message: data.response.message,
            },
          })
        }

        const message = data.response.message
        // const messageInfo = getterSmart(MESSAGE_INFO_ATOM, data.response.dialog)
        // if (messageInfo.history.size !== 0) {
        setter(
          [MESSAGE_INFO_ATOM, data.response.dialog],
          produce((messages) => {
            addMessage(messages, message)
            return messages
          }),
        )

        const chatList = getterSmart(CHAT_LIST_ATOM)
        if (!!chatList.history[dialog]) {
          setter(
            CHAT_LIST_ATOM,
            produce((chats) => {
              const chat = chats.history[dialog]
              if (chat) {
                chat.message = message
                chat.typing = false
              }
              return chats
            }),
          )
        }
      }
    }

    if (event === "message.edit") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const messageInfo = getterSmart(MESSAGE_INFO_ATOM, data.response.dialog)
        if (messageInfo.history.size !== 0) {
          setter(
            [MESSAGE_INFO_ATOM, data.response.dialog],
            produce((messages) => {
              let message = unlink(
                messages.history.get(data.response.message.id),
              )
              if (message) {
                message.message = data.response.message.message
                message.attach = data.response.message.attach
                messages.history.set(data.response.message.id, message)

                message = messages.history.get(data.response.message.id)
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

        const chatList = getterSmart(CHAT_LIST_ATOM)
        if (!!chatList.history[dialog]) {
          setter(
            CHAT_LIST_ATOM,
            produce((chats) => {
              const chat = chats.history[dialog]
              if (chat && chat.message?.id === data.response.message.id) {
                if (chat.message) {
                  chat.message.message = data.response.message.message
                  chat.message.attack_type = data.response.message.attach?.type
                }
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
                if (chat && chat.message?.id === message.id) {
                  for (let i = message.id; i > 0; i--) {
                    const _message = messageInfo.history.get(i)
                    if (_message) {
                      chat.message = _message
                      break
                    }
                    if (i === 0) {
                      chat.message = undefined
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
              if (chat && chat.message?.id === data.response.message_id) {
                if (chat.message) chat.message.readed = true
              }
              return chats
            }),
          )
        }
      }
    }

    if (event === "chat.search") {
      if (data.response?.dialog) {
        await chatInfo({ dialog: data.response.dialog })
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
      setStore("status", status)
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
  console.log({ data })
  if ([0, 1001].includes(data?.error?.code ?? -1)) {
    await sleep(1_000)
    return await socketSend(key, options)
  }
  return data
}
