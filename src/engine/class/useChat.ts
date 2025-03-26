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
export type Attach = NonNullable<
  NonNullable<Socket["message.list"]["response"]>[0]["attach"]
>
export type Message = ObjectMessage<Target, User, Keyboard, Attach>

export const Chats = new createChats<Target, User, Keyboard, Attach, Message>({
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
        response: {
          id: response.uuid,
          user: response.user,
          lastMessage: response.message?.id
            ? {
                id: response.message.id,
                text: response.message.message,
                target: response.message.target,
                attach: response.message.attach_type
                  ? {
                      type: response.message.attach_type,
                      items: [],
                    }
                  : undefined,
                time: response.message.time,
                isRead: response.message.readed,
                type: "default",
              }
            : undefined,
        },
        error: undefined,
      }
    },
    "chat.getList": async ({ count, offset }) => {
      const { response, error } = await chatList({})
      if (error) return { response: undefined, error: true }
      const data: Omit<Dialog<Target, User, Keyboard, Attach>, "messages">[] =
        []

      for (const chat of response) {
        data.push({
          id: chat.uuid,
          user: chat.user,
          lastMessage: chat.message
            ? {
                id: chat.message.id,
                text: chat.message.message,
                target: chat.message.target,
                attach: chat.message.attach_type
                  ? {
                      type: chat.message.attach_type,
                      items: [],
                    }
                  : undefined,
                time: chat.message.time,
                isRead: chat.message.readed,
                type: "default",
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
      const data: ClassMessageProps<Target, Keyboard, Attach>[] = []

      for (const message of response || []) {
        // Тут добавить если есть lastMessageId то добавлять в addMessage
        data.push({
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
          isRead: message.readed,
          isDeleted: message.deleted,
          keyboard: message.keyboard,
          type: message.type,
          indexes: [0, 0, 0],
        })
      }
      return { response: data, error: undefined }
    },
  },
})

export const Chat = Chats.getClass()
