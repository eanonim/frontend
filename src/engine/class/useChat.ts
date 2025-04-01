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
          isFavorites: response.favorites,
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

      for (const chat of response || []) {
        data.push({
          id: chat.uuid,
          user: chat.user,
          isFavorites: chat.favorites,
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

// import {
//   chatInfo,
//   chatList,
//   messageDelete,
//   messageList,
//   messageRead,
// } from "engine/api"
// import { Socket } from "engine/api/module"
// import { DefaultMetadata, RequestChat, RequestMessageList } from "./Chat2/types"
// import { createChats } from "./Chat2/createChats"

// type Attach = {
//   id: string
//   type: "photo" | "invite"
// }[]

// type User = NonNullable<Socket["chat.list"]["response"]>[0]["user"] & {
//   user_id: "my" | "you" | "system"
// }
// type ChatContent = {
//   user_id: "my" | "you" | "system"
// }
// type MessageContent = {
//   type: "default" | "invite"

//   text?: string
//   timestamp: Date

//   attach?: Attach
//   keyboard?: {
//     key: "chat_invite_accept" | "chat_invite_reject"
//     text: "accept" | "reject"
//     event: "chat.inviteAccept" | "chat.inviteReject"
//   }[][]
// }

// export const Chats = new createChats<
//   ChatContent,
//   User,
//   MessageContent,
//   DefaultMetadata<User>
// >({
//   requests: {
//     "message.delete": async ({ chat_id, message_id }) => {
//       const { response, error } = await messageDelete({
//         dialog: chat_id,
//         message_id: message_id,
//       })

//       return { response: !!response?.result, error: !!error }
//     },
//     "message.read": async ({ chat_id, message_id }) => {
//       const { response, error } = await messageRead({
//         dialog: chat_id,
//         message_id: message_id,
//       })

//       return { response: !!response?.result, error: !!error }
//     },
//     "chat.getById": async ({ chat_id }) => {
//       const { response, error } = await chatInfo({ dialog: chat_id })
//       return {
//         response: response
//           ? {
//               chat_id: response.uuid,
//               content: {
//                 user_id: "you",
//               },
//               lastMessage: response.message
//                 ? {
//                     message_id: response.message.id,
//                     user_id: response.message.target,
//                     content: {
//                       attach: response.message.attach_type
//                         ? [
//                             {
//                               type: response.message.attach_type,
//                               id: "",
//                             },
//                           ]
//                         : undefined,
//                       type: "default",
//                       timestamp: response.message.time,
//                       text: response.message.message,
//                     },
//                     metadata: {
//                       read: [],
//                       delete: false,
//                       edit: false,
//                     },
//                   }
//                 : undefined,
//             }
//           : undefined,
//         error: !!error,
//       }
//     },
//     "chat.getList": async ({ count, offset }) => {
//       const { response, error } = await chatList({})
//       const data: RequestChat<
//         ChatContent,
//         User,
//         MessageContent,
//         DefaultMetadata<User>
//       >[] = []

//       for (const chat of response || []) {
//         data.push({
//           chat_id: chat.uuid,
//           content: {
//             user_id: "you",
//           },
//           lastMessage: chat.message
//             ? {
//                 message_id: chat.message.id,
//                 user_id: chat.message.target,
//                 content: {
//                   attach: chat.message.attach_type
//                     ? [
//                         {
//                           type: chat.message.attach_type,
//                           id: "",
//                         },
//                       ]
//                     : undefined,
//                   type: "default",
//                   timestamp: chat.message.time,
//                   text: chat.message.message,
//                 },
//                 metadata: {
//                   read: [],
//                   delete: false,
//                   edit: false,
//                 },
//               }
//             : undefined,
//         })
//       }
//       return { response: data, error: !!error }
//     },
//     "message.getHistory": async ({ chat_id, count, offset, chat }) => {
//       const { response, error } = await messageList({
//         dialog: chat_id,
//         count,
//         offset,
//       })

//       const data: RequestMessageList<
//         ChatContent,
//         User,
//         MessageContent,
//         DefaultMetadata<User>
//       > = []

//       for (const message of response || []) {
//         const attach: NonNullable<(typeof data)[0]["content"]["attach"]> = []

//         if (message.attach) {
//           for (const item of message.attach?.items || []) {
//             attach.push({
//               type: message.attach?.type,
//               id: item.id,
//             })
//           }
//         }

//         data.push({
//           message_id: message.id,
//           user_id: message.target,
//           content: {
//             attach: attach,
//             text: message.message,
//             type: message.type,
//             timestamp: message.time,
//             keyboard: message.keyboard,
//           },
//           metadata: {
//             read: message.readed ? [message.target] : [],
//             delete: false,
//             edit: false,
//           },
//           reply: message.reply
//             ? {
//                 user_id: "you",
//                 message_id: message.reply.id,
//                 content: {
//                   type: "default",
//                   timestamp: new Date(),
//                   text: message.reply.message,
//                   attach: message.reply.attach_type
//                     ? [
//                         {
//                           type: message.reply.attach_type,
//                           id: "",
//                         },
//                       ]
//                     : undefined,
//                 },
//                 metadata: {
//                   read: [],
//                   delete: false,
//                   edit: false,
//                 },
//               }
//             : undefined,
//         })
//       }
//       return { response: data, error: !!error }
//     },
//   },
// })

// export const Chat = Chats.getClass()
