import { Message as ClassMessage } from "./Message/Message"

import { createStore, produce, SetStoreFunction, Store } from "solid-js/store"
import {
  Chats,
  ClassChatProps,
  ClassMessageProps,
  DefaultChatContent,
  DefaultContent,
  DefaultMetadata,
  DefaultUser,
  ObjectMessage,
  Requests,
  Users,
} from "./types"
import { getFullDate } from "./utils"
import { _chats, _setChats, REQUESTS } from "./createChats"

export const [_users, _setUsers] = createStore<Users<DefaultUser>>({})

export class Chat<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
  Message extends ObjectMessage<
    ChatContent,
    User,
    Content,
    Metadata
  > = ObjectMessage<ChatContent, User, Content, Metadata>,
> {
  private users = _users as Users<User>
  private setUsers = _setUsers as SetStoreFunction<Users<User>>

  private initStore: [
    get: Store<
      ClassChatProps<
        ChatContent,
        User,
        Content,
        Metadata,
        ObjectMessage<ChatContent, User, Content, Metadata>
      >
    >,
    set: SetStoreFunction<
      ClassChatProps<
        ChatContent,
        User,
        Content,
        Metadata,
        ObjectMessage<ChatContent, User, Content, Metadata>
      >
    >,
  ]

  private requests: Partial<Requests<ChatContent, User, Content, Metadata>> =
    REQUESTS as any
  private chats = _chats as unknown as Chats<
    ChatContent,
    User,
    Content,
    Metadata
  >
  private setChats = _setChats as SetStoreFunction<
    Chats<ChatContent, User, Content, Metadata>
  >
  private loadChatById: (id: string) => Promise<boolean>
  private timerTyping: Partial<
    Record<User["user_id"], NodeJS.Timeout | undefined>
  > = {}

  constructor(
    params: ClassChatProps<ChatContent, User, Content, Metadata, Message> & {
      loadChatById: (id: string) => Promise<boolean>
    },
  ) {
    this.loadChatById = params.loadChatById
    this.initStore =
      createStore<
        ClassChatProps<
          ChatContent,
          User,
          Content,
          Metadata,
          ObjectMessage<ChatContent, User, Content, Metadata>
        >
      >(params)
  }

  get content() {
    return this.initStore[0].content
  }
  public setContent(content: ChatContent) {
    this.initStore[1](
      produce((store) => {
        Object.assign(store.content, content)
        return store
      }),
    )
  }
  get last_message_id() {
    return this.initStore[0].last_message_id
  }
  /* Установка последнего прочитанного сообщения */
  public setLastMessageId(message_id: Message["message_id"]) {
    this.initStore[1](
      produce((store) => {
        store.last_message_id = message_id
        return store
      }),
    )
  }

  get full_load() {
    return this.initStore[0].full_load
  }
  get chat_id() {
    return this.initStore[0].chat_id
  }
  get dialogs() {
    if (!this.initStore[0].dialogs.length) {
      this.uploadChatHistory()
    }
    return this.initStore[0].dialogs
  }
  get history() {
    return this.initStore[0].history
  }
  get new_message() {
    return this.initStore[0].new_message
  }
  get participants() {
    return this.initStore[0].participants
  }
  get typing() {
    return this.initStore[0].typing
  }

  /* Поиск пользователя по ID */
  public getUserById(user_id: User["user_id"]) {
    return this.users[user_id]
  }

  /* Обновление информации о пользователе */
  public editParticipant(user: User) {
    this.setUsers(
      produce((store) => {
        const findUser = store[user.user_id]
        if (findUser) {
          Object.assign(findUser, user)
        }
        return store
      }),
    )
  }

  /* Добавление пользователя в диалог */
  public addParticipant(user: User) {
    this.initStore[1](
      produce((store) => {
        // Проверяем на существование пользователя, если его нет добавляем
        if (!store.participants.find((x) => x.user_id === user.user_id)) {
          // Проверяем на существование пользователя в обжей базе, если его нет добавляем
          const findUser = this.users[user.user_id]
          if (!findUser) {
            this.users[user.user_id] = user
          }

          store.participants.push(this.users[user.user_id])
        }
        return store
      }),
    )
  }

  /* Установка статуса печати */
  public setTyping(user_id: User["user_id"]) {
    const user = this.participants.find((x) => x.user_id === user_id)
    if (!user) return false

    clearTimeout(this.timerTyping[user_id])

    // Добавляем ссылку на пользователя
    this.initStore[1](
      produce((store) => {
        store.typing.push(user)
        return store
      }),
    )

    // Удаляем ссылку на пользователя через время
    this.timerTyping[user_id] = setTimeout(
      (() => {
        this.initStore[1](
          produce((store) => {
            const index = store.typing.findIndex((x) => x.user_id === user_id)
            if (index !== -1) {
              store.typing.splice(index, 0)
            }

            return store
          }),
        )
      }).bind(this),
      3000,
    )

    return true
  }

  /* Добавляет новое сообщение */
  public newMessage(
    message: ClassMessageProps<ChatContent, User, Content, Metadata>,
  ) {
    return this.initMessage(message, "unshift")
  }

  /* Поиск сообщения по ID */
  public getMessageById(message_id?: Message["message_id"]) {
    if (!message_id) return undefined

    return this.history.get(message_id)
  }

  /* Инициализация сообщения */
  public initMessage(
    _message: ClassMessageProps<ChatContent, User, Content, Metadata>,
    typePush: "push" | "unshift" = "unshift",
    onlyHistory = false,
  ) {
    const groupMessagesCount = 20

    const isMessage = this.getMessageById(_message.message_id)

    const message = isMessage
      ? isMessage
      : new ClassMessage<ChatContent, User, Content, Metadata>({
          ..._message,
          ...{ chat_id: this.chat_id, indexes: [0, 0, 0] },
        })

    this.initStore[1](
      produce((store) => {
        if (!isMessage || !message.indexes) {
          if (!onlyHistory || !message.indexes) {
            const fullTime = getFullDate(message.content.timestamp)

            let dialogIndex = 0
            let groupMessagesIndex = 0
            let messageIndex = 0

            const countEmpty = 20 // Количество пустых ячеек

            // добавляем группу сообщения за сегодняшний день
            const fullTimeToday = getFullDate(new Date())
            dialogIndex = store.dialogs.findIndex((x) => x[0] === fullTimeToday)
            if (dialogIndex === -1) {
              dialogIndex = store.dialogs.length
              store.dialogs.push([
                fullTimeToday,
                Array.from({ length: countEmpty }, () => []),
              ])
            }

            // Забиваем Array, для следующих сообщений, что бы Index`ы работали нормально
            dialogIndex = store.dialogs.findIndex((x) => x[0] === fullTime)
            if (dialogIndex === -1) {
              dialogIndex = store.dialogs.length
              store.dialogs.push([
                fullTime,
                Array.from({ length: countEmpty }, () => []),
              ])
            }

            let groupMessages = store.dialogs[dialogIndex][1]

            if (groupMessages.length === 0) {
              for (let i = 0; i < countEmpty; i++) {
                store.dialogs[dialogIndex][1][i] = []
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
            message.setIndexes([dialogIndex, groupMessagesIndex, messageIndex])
          }

          store.history.set(message.message_id, message)
        }

        this.addParticipant(_message.sender)
        // this.addParticipant(_message.recipient)

        // const recipientUser = this.getUserById(_message.recipient.user_id)
        // message.setRecipient(recipientUser)
        const senderUser = this.getUserById(_message.sender.user_id)
        message.setSender(senderUser)

        message.setContent(_message.content)
        message.setMessageId(_message.message_id)
        message.setMetadata(_message.metadata)

        if ((store.last_message_id || 0) < message.message_id) {
          store.last_message_id = message.message_id
        }

        return store
      }),
    )

    // setDialogs(
    //   this.store.id,
    //   produce((chat) => {
    //     Object.assign(chat, this.store)
    //     return chat
    //   }),
    // )

    // if (_message.reply) {
    //   this.initMessage(_message.reply, undefined, true)
    //   message.setter("replyId", _message.reply.id)
    // }

    return message
  }

  /* Загрузка истории чата */
  public async uploadChatHistory() {
    if (!this.chats[this.chat_id]) {
      await this.loadChatById(this.chat_id)
    }

    if (this.initStore[0].loading_history) {
      console.error("this.loading_history")
      return false
    }

    const request = this.requests["message.getHistory"]
    if (!request) {
      console.error('Нет функции для вызова "message.getHistory"')
      return false
    }
    this.initStore[1](
      produce((store) => {
        store.loading_history = true
        return store
      }),
    )
    try {
      const offset = this.initStore[0].last_offset || 0
      const { response, error } = await request({
        chat_id: this.chat_id,
        offset: offset,
        count: 200,
        chat: this.chats[this.chat_id],
      })

      if (!error && ((response || []).length === 0 || !response)) {
        this.initStore[1](
          produce((store) => {
            store.full_load = true
            return store
          }),
        )
      }

      if (response) {
        this.initStore[1](
          produce((store) => {
            store.last_offset = offset + 200
            return store
          }),
        )
        for (const message of response.reverse()) {
          this.initMessage(message, "push")
        }
        return true
      }
    } finally {
      this.initStore[1](
        produce((store) => {
          store.loading_history = false
          return store
        }),
      )
    }
    return false
  }
}
