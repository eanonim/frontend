import { unlink } from "@minsize/utils"
import {
  DefaultKeyboard,
  DefaultTarget,
  DefaultUser,
  Dialog,
  ObjectMessage,
  Requests,
} from "../types"
import { DIALOGS, SetDIALOGS, REQUESTS } from "../Chat"
import { produce } from "solid-js/store"

export class Message<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Message extends ObjectMessage<Target, Keyboard> = ObjectMessage<
    Target,
    Keyboard
  >,
  _Dialog extends Dialog<Target, User, Keyboard, Message> = Dialog<
    Target,
    User,
    Keyboard,
    Message
  >,
> {
  private chatId: string
  private messageId: number

  private requests: Partial<
    Requests<Target, User, Keyboard, Message, _Dialog>
  > = {}

  constructor(dialog: string, message_id: number) {
    this.chatId = dialog
    this.messageId = message_id
    this.requests = REQUESTS as Requests<
      Target,
      User,
      Keyboard,
      Message,
      _Dialog
    >

    this.requestDelete = this.requestDelete.bind(this)
    this.requestRead = this.requestRead.bind(this)

    this.setDeleteStatus = this.setDeleteStatus.bind(this)
    this.setRead = this.setRead.bind(this)
  }

  private async requestDelete() {
    const request = this.requests["message.delete"]
    if (!request) {
      console.error('Нет функции для вызова "message.delete"')
      return false
    }
    const { response, error } = await request({
      chatId: this.chatId,
      messageId: this.messageId,
    })

    return !!response
  }

  private async requestRead() {
    const request = this.requests["message.read"]
    if (!request) {
      console.error('Нет функции для вызова "message.read"')
      return false
    }
    const { response, error } = await request({
      chatId: this.chatId,
      messageId: this.messageId,
    })

    return !!response
  }

  /* Установка статуса удаления */
  public setDeleteStatus(status: boolean) {
    if (status) {
      this.requestDelete()
    }
    if (!DIALOGS[this.chatId]) return false

    SetDIALOGS(
      produce((store) => {
        const message = unlink(
          store[this.chatId].messages.history.get(this.messageId),
        )
        if (message) {
          const [dialogIndex, groupMessagesIndex, messageIndex] =
            message.indexes
          const msgDialog =
            store[this.chatId].messages.dialogs[dialogIndex][1][
              groupMessagesIndex
            ][messageIndex]
          if (msgDialog) {
            msgDialog.isDeleted = status
          }
        }
        return store
      }),
    )
    return true
  }

  /* Установка статуса прочтения */
  public setRead(status: boolean) {
    if (!DIALOGS[this.chatId]) return false

    if (
      (DIALOGS[this.chatId].messages.lastReadMessageId || 0) < this.messageId
    ) {
      DIALOGS[this.chatId].messages.lastReadMessageId = this.messageId
      this.requestRead()
    }

    SetDIALOGS(
      produce((store) => {
        const message = unlink(
          store[this.chatId].messages.history.get(this.messageId),
        )
        if (message) {
          const [dialogIndex, groupMessagesIndex, messageIndex] =
            message.indexes
          const msgDialog =
            store[this.chatId].messages.dialogs[dialogIndex][1][
              groupMessagesIndex
            ][messageIndex]
          if (msgDialog) {
            msgDialog.isRead = status
          }
        }
        return store
      }),
    )
    return false
  }
}
