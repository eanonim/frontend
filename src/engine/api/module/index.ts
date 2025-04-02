import init, { Status } from "@elum/ews"
import { Mutex } from "@minsize/mutex"
import { sleep } from "@minsize/utils"
import { getter } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { HOST } from "root/configs"
import {
  modals,
  pages,
  panels,
  popouts,
  pushModal,
  pushPage,
  pushPopout,
  replacePage,
  useParams,
  useRouter,
  useRouterPanel,
  views,
} from "router"
import { createEffect, createSignal, on } from "solid-js"
import { createStore } from "solid-js/store"
import { chatInfo } from ".."
import { Chats } from "engine/class/useChat"
import { bridgeOpenPopup } from "@apiteam/twa-bridge/solid"

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
  "user.avatarSet": {
    request: {
      id: string
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
        type: "photo" | "invite"
        items: Array<{
          id: string
        }>
      }
      type: "default" | "invite"
      keyboard?: {
        key: "chat_invite_accept" | "chat_invite_reject"
        text: "accept" | "reject"
        event: "chat.inviteAccept" | "chat.inviteReject"
      }[][]
      reply?: {
        id: number
        message: string
        attach_type?: "photo" | "invite"
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
          type: "photo" | "invite"
          items: Array<{
            id: string
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
          type: "photo" | "invite"
          items: Array<{
            id: string
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
          type: "photo" | "invite"
          items: Array<{
            id: string
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
        type: "default" | "invite"
        attach?: {
          type: "photo" | "invite"
          items: Array<{
            id: string
          }>
        }
        reply?: {
          id: number
          message: string
          attach_type?: "photo" | "invite"
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
        attach_type?: "photo" | "invite"
        time: Date
        readed: boolean
      }

      user: {
        first_name: string
        last_name: string
        image: string
        emoji?: number
      }

      favorites?: boolean

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
  "chat.inviteStatus": {
    event: {
      dialog: string
      status: "accepted" | "rejected"
    }
  }
  "chat.close": {
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
        attach_type?: "photo" | "invite"
        time: Date
        readed: boolean
      }

      user: {
        first_name: string
        last_name: string
        image: string
        emoji?: number
      }

      favorites?: boolean
      /* CUSTOM */
      typing?: boolean
      loading?: boolean
    }
  }
  "chat.searchEnd": {
    request: {}
    response: {
      result: boolean
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
      coin: number
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
          } else if (panel() === panels.CHATS) {
            notification = false
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

        const chat = Chats.getById(dialog)

        const message = data.response.message

        chat?.newMessage({
          id: message.id,
          text: message.message,
          target: message.target,
          attach: message.attach,
          reply: message.reply
            ? {
                id: message.reply.id,
                attach: message.reply.attach_type
                  ? {
                      type: message.reply.attach_type,
                      items: [],
                    }
                  : undefined,
                time: new Date(),
                type: "default",
              }
            : undefined,
          time: message.time,
          type: message.type,

          keyboard: message.keyboard,
          isRead: message.readed,
          isDeleted: message.deleted,
        })
      }
    }

    if (event === "chat.inviteStatus") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const chat = Chats.getById(dialog)

        chat?.setter("isFavorites", data.response.status === "accepted")

        for (const msg of Object.values(chat?.messages.history || {})) {
          if (msg.type === "invite" && !msg.isDeleted) {
            msg.setter("isDeleted", true)
          }
        }
      }
    }

    if (event === "message.edit") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const chat = Chats.getById(dialog)

        const message = chat?.getMessageById(data.response.message.id)
        if (message) {
          message.setter("attach", data.response.message.attach)
          message.setter("text", data.response.message.message)
        }
      }
    }

    if (event === "message.delete") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const chat = Chats.getById(dialog)

        const message = chat?.getMessageById(data.response.message_id)
        if (message) {
          message.setter("isDeleted", true)
        }
      }
    }

    if (event === "message.read") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const chat = Chats.getById(dialog)

        const message = chat?.getMessageById(data.response.message_id)
        if (message) {
          message.setter("isRead", true)
        }
      }
    }

    if (event === "chat.search") {
      if (data.response?.dialog) {
        replacePage({
          is_back: true,
          pageId: pages.CHAT,
          params: { dialog: data.response?.dialog },
          handler: async () => {
            const chat = Chats.getById(data.response.dialog)

            if (chat?.isFavorites) {
              return true
            }

            pushModal({
              modalId: modals.MODAL_LEAVE,
              params: {
                dialog: data.response?.dialog,
              },
            })

            return false
          },
        })
      }
    }

    if (event === "chat.close") {
      const dialog = data.response?.dialog
      if (dialog && data.response) {
        const chat = Chats.getById(dialog)
        chat?.setter("isFavorites", false)
        chat?.setter("isDeleted", true)
      }
    }

    if (event === "message.typing") {
      const dialog = data.response?.dialog
      if (dialog) {
        const chat = Chats.getById(dialog)
        chat?.setter("isTyping", true)
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
