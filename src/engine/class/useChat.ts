import {
  chatInfo,
  chatList,
  messageDelete,
  messageList,
  messageRead,
} from "engine/api"
import { Socket } from "engine/api/module"
import { ClassMessageProps, Dialog, ObjectMessage } from "./Chat/types"
import { createChats } from "./Chat/createChats"

type Target = NonNullable<Socket["message.list"]["response"]>[0]["target"]
type User = NonNullable<Socket["chat.list"]["response"]>[0]["user"]
type Keyboard = NonNullable<
  NonNullable<Socket["message.list"]["response"]>[0]["keyboard"]
>[0][0]
type Message = ObjectMessage<Target, User, Keyboard>

const useChat = new createChats<Target, User, Keyboard, Message>({
  requests: {
    "message.delete": async ({ chatId, messageId }) => {
      const { response, error } = await messageDelete({
        dialog: chatId,
        message_id: messageId,
      })

      if (error || !response) return { response: undefined, error: true }

      return { response: response?.result, error: undefined }
    },
    "message.read": async ({ chatId, messageId }) => {
      const { response, error } = await messageRead({
        dialog: chatId,
        message_id: messageId,
      })

      if (error || !response) return { response: undefined, error: true }

      return { response: response?.result, error: undefined }
    },
    "chat.getById": async ({ id }) => {
      const { response, error } = await chatInfo({ dialog: id })
      if (error) return { response: undefined, error: true }

      return {
        response: { ...response, ...{ id: response.uuid } },
        error: undefined,
      }
    },
    "chat.getList": async ({ count, offset }) => {
      const { response, error } = await chatList({})
      if (error) return { response: undefined, error: true }
      const data: Omit<Dialog<Target, User, Keyboard>, "messages">[] = []

      for (const chat of response) {
        data.push({
          id: chat.uuid,
          user: chat.user,
          lastMessage: chat.message
            ? {
                id: chat.message.id,

                text: chat.message.message,
                target: chat.message.target,
                attachType: chat.message.attack_type,
                time: chat.message.time,
                isRead: chat.message.readed,
              }
            : undefined,
        })
      }
      return { response: data, error: undefined }
    },
    "message.getHistory": async ({ id, count, offset }) => {
      const { response, error } = await messageList({
        dialog: id,
        count,
        offset,
      })
      if (error) return { response: undefined, error: true }
      const data: ClassMessageProps<Target, Keyboard>[] = []

      for (const message of response || []) {
        // Тут добавить если есть lastMessageId то добавлять в addMessage
        data.push({
          id: message.id,
          text: message.message,
          target: message.target,
          attach: message.attach,
          reply: message.reply,
          time: message.time,
          isRead: message.readed,
          isDeleted: message.deleted,
          keyboard: message.keyboard,
          indexes: [0, 0, 0],
        })
      }
      return { response: data, error: undefined }
    },
  },
})

export const Chat = useChat.getClass()
