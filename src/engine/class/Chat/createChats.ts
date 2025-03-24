import { Chat } from "../Chat/Chat"
import {
  DefaultKeyboard,
  DefaultTarget,
  DefaultUser,
  Dialog,
  ObjectMessage,
  Requests,
} from "./types"

export var REQUESTS: Partial<
  Requests<DefaultTarget, DefaultUser, DefaultKeyboard>
> = {}

export const DIALOGS = new Map<
  string,
  Dialog<
    DefaultTarget,
    DefaultUser,
    DefaultKeyboard,
    ObjectMessage<DefaultTarget, DefaultUser, DefaultKeyboard>
  >
>()

export function setREQUESTS(
  params: Partial<Requests<DefaultTarget, DefaultUser, DefaultKeyboard>>,
) {
  REQUESTS = params
}

export class createChats<
  Target extends DefaultTarget,
  User extends DefaultUser,
  Keyboard extends DefaultKeyboard,
  Message extends ObjectMessage<Target, User, Keyboard> = ObjectMessage<
    Target,
    User,
    Keyboard
  >,
  _Dialog extends Dialog<Target, User, Keyboard, Message> = Dialog<
    Target,
    User,
    Keyboard,
    Message
  >,
> {
  constructor({
    requests,
  }: {
    requests: Requests<Target, User, Keyboard, Message, _Dialog>
  }) {
    REQUESTS = requests
  }

  /* Загрузка чатов */
  public async loadChats() {
    const chat = new Chat({ dialog: "" })
    chat.uploadChats()
  }

  public getClass() {
    return Chat<Target, User, Keyboard, Message, _Dialog>
  }
}
