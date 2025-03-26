import { REQUESTS } from "../createChats"
import { _setUsers, _users } from "../Chat"
import { _chats } from "../createChats"
import {
  DefaultUser,
  DefaultContent,
  DefaultMetadata,
  ClassMessageProps,
  Users,
  Chats,
  DefaultChatContent,
  Requests,
} from "../types"
import { createStore, produce, SetStoreFunction, Store } from "solid-js/store"

export class Message<
  ChatContent extends DefaultChatContent,
  User extends DefaultUser,
  Content extends DefaultContent,
  Metadata extends DefaultMetadata<User>,
  PARAMS extends ClassMessageProps<User, Content, Metadata> & {
    chat_id: string
    indexes: [number, number, number]
  } = ClassMessageProps<User, Content, Metadata> & {
    chat_id: string
    indexes: [number, number, number]
  },
> {
  private chats = _chats as unknown as Chats<
    ChatContent,
    User,
    Content,
    Metadata
  >
  private requests: Partial<Requests<ChatContent, User, Content, Metadata>> =
    REQUESTS as any
  private users = _users as Users<User>
  private setUsers = _setUsers as SetStoreFunction<Users<User>>

  private chat_id: string

  private initStore: [get: Store<PARAMS>, set: SetStoreFunction<PARAMS>]

  constructor(params: PARAMS) {
    this.chat_id = params.chat_id
    this.initStore = createStore<PARAMS>(params)

    this.requestDelete = this.requestDelete.bind(this)
    this.requestRead = this.requestRead.bind(this)
  }

  get message_id() {
    return this.initStore[0].message_id
  }
  public setMessageId(message_id: PARAMS["message_id"]) {
    this.initStore[1](
      produce((store) => {
        const chat = this.chats[this.chat_id]
        if (chat) {
          const message = chat.history.get(this.message_id)
          if (message) {
            chat.history.set(message_id, message)

            if ((chat.last_message_id || 0) <= message_id) {
              chat.setLastMessageId(message_id)
            }
          }
        }

        store.message_id = message_id
        return store
      }),
    )
  }

  get content() {
    return this.initStore[0].content
  }
  public setContent(content: PARAMS["content"]) {
    this.initStore[1](
      produce((store) => {
        Object.assign(store.content, content)
        return store
      }),
    )
  }

  get metadata() {
    return this.initStore[0].metadata
  }
  public setMetadata(metadata: PARAMS["metadata"]) {
    this.initStore[1](
      produce((store) => {
        if (!store.metadata.delete && metadata.delete) {
          this.requestDelete()

          // Установка последнего сообщения для показа в истории чатов
          const chat = this.chats[this.chat_id]
          if (chat && chat.last_message_id === this.message_id) {
            for (let i = this.message_id - 1; i > 0; i--) {
              const message = chat.history.get(i)
              if (message && !message.metadata.delete) {
                chat.setLastMessageId(message.message_id)
                break
              }
              if (i === 0) {
                chat.setLastMessageId(0)
              }
            }
          }
        }

        Object.assign(store.metadata, metadata)
        return store
      }),
    )
  }

  get recipient() {
    return this.initStore[0].recipient
  }
  public setRecipient(recipient: PARAMS["recipient"]) {
    this.initStore[1](
      produce((store) => {
        Object.assign(store.recipient, recipient)
        return store
      }),
    )
  }

  get sender() {
    return this.initStore[0].sender
  }
  public setSender(sender: PARAMS["sender"]) {
    this.initStore[1](
      produce((store) => {
        Object.assign(store.sender, sender)
        return store
      }),
    )
  }

  get indexes() {
    return this.initStore[0].indexes
  }
  public setIndexes(indexes: PARAMS["indexes"]) {
    this.initStore[1](
      produce((store) => {
        store.indexes = indexes
        return store
      }),
    )
  }

  /* Проверка прочитал ли сообщение данные пользователь */
  public getReadByUserId(user_id: User["user_id"]) {
    return !!this.initStore[0].metadata.read.find((x) => x.user_id === user_id)
  }

  /* Добавление пользователя в прочитанные сообщения */
  public setRead(user_id: User["user_id"]) {
    this.initStore[1](
      produce((store) => {
        // Если read не существует, создаём
        if (!store.metadata.read) store.metadata.read = []

        if (!store.metadata.read.find((x) => x.user_id === user_id)) {
          // Проверяем на существование пользователя
          const findUser = this.users[user_id]
          if (findUser) {
            store.metadata.read.push(findUser)

            for (var i = this.message_id - 1; i > 0; i++) {
              const message = this.chats[this.chat_id].history.get(i)
              if (message) {
                // Проверяем если пользователь прочитал это сообщение то останавливаем цикл
                if (message.getReadByUserId(user_id)) {
                  break
                }
                message.setRead(user_id)
                break
              }
            }
          }
        }
        return store
      }),
    )
  }

  private async requestDelete() {
    const request = this.requests["message.delete"]
    if (!request) {
      console.error('Нет функции для вызова "message.delete"')
      return false
    }
    const { response, error } = await request({
      chat_id: this.chat_id,
      message_id: this.message_id,
    })

    return !!response
  }

  private async requestRead(user_id: User["user_id"]) {
    const request = this.requests["message.read"]
    if (!request) {
      console.error('Нет функции для вызова "message.read"')
      return false
    }
    const { response, error } = await request({
      chat_id: this.chat_id,
      message_id: this.message_id,
      user_id,
    })

    return !!response
  }
}
