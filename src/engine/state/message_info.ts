import { atom, getter, setter } from "engine/modules/smart-data"
import { Socket } from "engine/api/module"
import { produce } from "solid-js/store"
import { CHAT_LIST_ATOM } from "./chat_list"
import { messageList } from "engine/api"
import {
  groupMessagesCount,
  messageListCount,
  messageListCountStart,
} from "root/configs"
import { getFullDate } from "engine"
import { clamp, unlink } from "@minsize/utils"

export type Message = {
  /**
   * index one = dialog index
   * index two = group messages index
   * index three = message index
   */
  indexes: [number, number, number]
} & NonNullable<Socket["message.list"]["response"]>[0]

type MESSAGE_INFO_ATOM_RESPONSE = {
  dialogs: [string, Message[][]][]
  history: Map<number, Message>
  last_read_message_id?: number
  last_offset: number
  last_message_id?: number
  message: {
    message: string
    reply_id?: number
    edit_id?: number
    typing?: boolean
  }
}

export const addMessage = (
  messages: MESSAGE_INFO_ATOM_RESPONSE,
  _message: Omit<Message, "indexes"> & {
    indexes?: Message["indexes"]
  },
  typePush: "push" | "unshift" = "unshift",
): [MESSAGE_INFO_ATOM_RESPONSE, Message["indexes"]] => {
  const message = _message as Message
  const fullTime = getFullDate(message.time)

  let dialogIndex = 0
  let groupMessagesIndex = 0
  let messageIndex = 0

  const countEmpty = 20 // Количество пустых ячеек

  // добавляем группу сообщения за сегодняшний день
  const fullTimeToday = getFullDate(new Date())
  dialogIndex = messages.dialogs.findIndex((x) => x[0] === fullTimeToday)
  if (dialogIndex === -1) {
    dialogIndex = messages.dialogs.length
    messages.dialogs.push([fullTimeToday, []])
  }

  // Забиваем Array, для следующих сообщений, что бы Index`ы работали нормально
  dialogIndex = messages.dialogs.findIndex((x) => x[0] === fullTime)
  if (dialogIndex === -1) {
    dialogIndex = messages.dialogs.length
    messages.dialogs.push([
      fullTime,
      Array.from({ length: countEmpty }, () => []),
    ])
  }

  let groupMessages = messages.dialogs[dialogIndex][1]

  if (groupMessages.length === 0) {
    for (let i = 0; i < countEmpty; i++) {
      messages.dialogs[dialogIndex][1][i] = []
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
          index < countEmpty && x.filter(Boolean).length < groupMessagesCount,
      )

      if (groupMessagesIndex === -1) {
        groupMessagesIndex = 0
      }

      messageIndex = groupMessages[groupMessagesIndex].filter(Boolean).length

      if (!!groupMessages[groupMessagesIndex][messageIndex]) {
        messageIndex += 1
      }

      groupMessages[groupMessagesIndex][messageIndex] = message
    }
  }

  message.indexes = [dialogIndex, groupMessagesIndex, messageIndex]

  messages.history.set(message.id, message)

  if ((messages.last_message_id || 0) < message.id) {
    messages.last_message_id = message.id
  }

  if (message.readed && message.id > (messages.last_read_message_id || 0)) {
    messages.last_read_message_id = message.id
  }

  return [messages, message.indexes]
}

export const MESSAGE_INFO_ATOM = atom<
  MESSAGE_INFO_ATOM_RESPONSE,
  Omit<Omit<Socket["message.list"]["request"], "offset">, "count">,
  string
>({
  onKey: (options) => {
    return options.dialog
  },
  default: {
    dialogs: [],
    history: new Map(),
    last_offset: 0,
    message: {
      message: "",
      typing: false,
    },
  },
  // onUpdate: ({ prev, next }, key) => {
  //   console.log("onUpdate", key, { prev, next })
  // },
  onRequested: (options, key) => {
    messageList({
      dialog: options.dialog,
      offset: 0,
      count: messageListCountStart,
    })
  },
  updateIntervalMs: 600_000,
})

let timer: Record<string, NodeJS.Timeout> = {}

export const setTyping = (dialog: string) => {
  const messageInfo = getter(MESSAGE_INFO_ATOM, dialog)
  if (messageInfo.history.size !== 0) {
    setter(
      [MESSAGE_INFO_ATOM, dialog],
      "message",
      produce((message) => {
        message.typing = true

        return message
      }),
    )
  }

  const chatList = getter(CHAT_LIST_ATOM)
  if (!!chatList.history[dialog]) {
    setter(CHAT_LIST_ATOM, "history", dialog, "typing", true)
  }

  clearTimeout(timer[dialog])

  timer[dialog] = setTimeout(() => {
    setter(
      [MESSAGE_INFO_ATOM, dialog],
      "message",
      produce((message) => {
        message.typing = false

        return message
      }),
    )

    setter(CHAT_LIST_ATOM, "history", dialog, "typing", false)
  }, 5000)
}
