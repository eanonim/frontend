import { setter, setterStatus } from "engine/modules/smart-data"
import { Socket, socketSend } from "../module"
import { addMessage, MESSAGE_INFO_ATOM } from "engine/state"
import { unlink } from "@minsize/utils"
import { produce } from "solid-js/store"

const messageList = async (options: Socket["message.list"]["request"]) => {
  if (!options.dialog) return
  const { response, error } = await socketSend("message.list", options)
  if (error) {
    console.log({ error })
    return { response, error }
  }
  console.log({ response })
  if (!response) {
    setterStatus([MESSAGE_INFO_ATOM, options.dialog], { fullLoad: true })
  }

  setter(
    [MESSAGE_INFO_ATOM, options.dialog],
    produce((messages) => {
      if (options.offset === 0) {
        messages.dialogs = []
        messages.history = new Map()
      }

      if (response) {
        for (const message of response.reverse()) {
          if (response[0].id === message.id) {
            message.attach = {
              type: "photo",
              items: [
                {
                  name: "test",
                  data: "https://cdn.tripster.ru/thumbs2/96e82566-847f-11ef-b246-8e8f6606cbb1.1220x600.jpeg",
                },
                {
                  name: "test",
                  data: "https://previews.123rf.com/images/jackf/jackf1109/jackf110900862/10705018-%D0%B2%D0%B5%D1%80%D1%82%D0%B8%D0%BA%D0%B0%D0%BB%D1%8C%D0%BD%D1%8B%D0%B5-%D0%B3%D0%BE%D1%80%D1%8B-%D0%BF%D0%B5%D0%B9%D0%B7%D0%B0%D0%B6-%D1%81-%D0%BA%D0%B5%D0%B4%D1%80%D0%BE%D0%B2%D1%8B%D0%B9-%D0%BB%D0%B5%D1%81-%D0%B0%D0%BB%D1%82%D0%B0%D0%B9-suberia.jpg",
                },
                {
                  name: "test",
                  data: "https://zastavki.gas-kvas.com/uploads/posts/2024-09/zastavki-gas-kvas-com-mi46-p-zastavki-gori-na-telefon-vertikalnie-1.jpg",
                },
              ],
            }
            message.message = undefined
          }
          if (response[1].id === message.id) {
            message.attach = {
              type: "photo",
              items: [
                {
                  name: "test",
                  data: "https://cdn.tripster.ru/thumbs2/96e82566-847f-11ef-b246-8e8f6606cbb1.1220x600.jpeg",
                },
              ],
            }
          }
          addMessage(messages, message as any, "push")[0]
        }

        messages.last_offset =
          options.offset === 0 ? options.count : options.offset
      }

      return messages
    }),
  )
  return { response, error }
}

export default messageList
