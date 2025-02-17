import init, { Status } from "@elum/ews"
import { Mutex } from "@minsize/mutex"
import { getter } from "elum-state/solid"
import { AUTH_TOKEN_ATOM } from "engine/state"
import { HOST } from "root/configs"
import { pages, pushPage } from "router"
import { createEffect, createSignal, on } from "solid-js"
import { createStore } from "solid-js/store"

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
    response: {}
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
      premium: boolean
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
      pushPage({ pageId: pages.DUPLICATED, is_back: false })
    }
  })
}

// socket.onEvents(({data,event}) => {

// })
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

  const data = await socket.send(key, options)

  if (data?.error?.code === 0) {
    return await socketSend(key, options)
  }
  return data
}
