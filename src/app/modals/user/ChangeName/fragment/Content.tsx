import { Button, Field, Input, TextProps, Title } from "components"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { USER_ATOM } from "engine/state"
import { emojis } from "root/configs"

import { type JSX, type Component, For, createSignal } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [user] = useAtom(USER_ATOM, {}, { key: "edit" })

  const onFirst = (value: string) => {
    setter([USER_ATOM, "edit"], "first_name", value)
  }
  const onLast = (value: string) => {
    setter([USER_ATOM, "edit"], "last_name", value)
  }

  return (
    <>
      <Button.Group>
        <Field>
          <Input
            safe={false}
            placeholder={"First Name"}
            onInput={(e) => onFirst(e.target.value)}
            value={user.first_name}
          />
        </Field>
        <Field>
          <Input
            safe={false}
            placeholder={"Last Name"}
            onInput={(e) => onLast(e.target.value)}
            value={user.last_name}
          />
        </Field>
      </Button.Group>
    </>
  )
}

export default Content
