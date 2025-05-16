import createBlob from "engine/utils/createBlob"
import { Socket, socketSend } from "../module"
import { Attach, Chats } from "engine/class/useChat"
import imageUpload from "../image/upload"
import { unlink } from "@minsize/utils"

const messageSend = async (
  options: Socket["message.send"]["request"] & {
    attachBlob?: { id: number; blob: Blob }[]
  },
) => {
  const messageId = Math.random()
  const chat = Chats.getById(options.dialog)

  const message = chat?.newMessage({
    id: messageId,
    isLoading: true,
    target: "my",
    text: options.message.message,
    replyId: options.message.reply_id,
    time: new Date(),
    attach: options.attachBlob
      ? {
          type: "photo",
          items: options.attachBlob?.map((x) => ({
            id: String(x.id),
            srcBlob: createBlob(x.blob),
            isLoading: true,
          })),
        }
      : undefined,
    type: "default",
  })

  for (const attach of options.attachBlob || []) {
    const form = new FormData()
    form.append("data", attach.blob)
    form.append("group", chat?.id || "")
    const { response, error } = await imageUpload(form)
    if (response) {
      const newAttach = unlink(message?.attach)

      const oldAttach = newAttach?.items.find((x) => x.id === String(attach.id))
      if (oldAttach) {
        oldAttach.isLoading = false
        oldAttach.id = response.id
      }
      message?.setter("attach", newAttach)
    }
  }

  if (message?.attach) {
    options.message.attach = unlink(message?.attach)
  }

  const { response, error } = await socketSend("message.send", {
    ...options,
    ...{ attachBlob: undefined },
  })

  if (error) {
    return { response, error }
  }

  if (response.result) {
    message?.setter("id", response.id)
    message?.setter("isLoading", false)
  }

  return { response, error }
}

export default messageSend
