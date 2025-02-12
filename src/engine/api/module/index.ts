import init, { Status } from "@elum/ews"
import { Mutex } from "@minsize/mutex"
import { createEffect, createSignal, on } from "solid-js"

export type SocketError = {
  code: number
  message: string
  critical?: boolean
}

export type StoreOptionsAtom<
  T extends Socket["store.options"]["response"][0] = Socket["store.options"]["response"][0],
> = {
  [key in T["value"]]?: T
}

export enum StoreOptions {
  "backgroundId" = "backgroundId",
  "themeColor" = "themeColor",
}

export type Socket = {
  "store.options": {
    request: {
      key: StoreOptions
    }
    response:
      | Array<{
          key: StoreOptions.backgroundId
          value: number
          is_premium: boolean
        }>
      | Array<{
          key: StoreOptions.themeColor
          value: "pink" | "standard"
          is_premium: boolean
        }>
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

export const socket = init<Socket, SocketError>({
  //url: "wss://dev.elum.app?66a8cb192ea93182aaa11d6d50d83be39fe6ef9617c823f66e41edc5ea63890a7ddf9ae226c9893c48078d2fd7ab720b22fdd747e6",
  url: "wss://eanonim-backend-9a6d.twc1.net?66a8cb192ea93182aaa11d6d50d83be39fe6ef9617c823f66e41edc5ea63890a7ddf9ae226c9893c48078d2fd7ab720b22fdd747e6",
  autoConnect: true,
  autoReconnect: true,
})
// socket.onEvents(({data,event}) => {

// })

const [status, setStatus] = createSignal(false)

const mutex = Mutex({ globalLimit: 1 })

createEffect(
  on(socket.status, (status) => {
    console.log({ status })
    if (status === Status.OPEN) {
      mutex.release({ key: "lock1" })
      mutex.release({ key: "lock2" })
    }
    setStatus(status === Status.OPEN)
  }),
)

export const socketSend = async <KEY extends keyof Socket>(
  key: KEY,
  options: Socket[KEY]["request"],
) => {
  console.log({ key1: key, options })
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

  return await socket.send(key, options)
}
