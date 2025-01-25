import { Image, Ratio } from "components"

import { createSmartData, USER_ATOM } from "engine/state"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [user] = createSmartData(USER_ATOM, {}, {})

  return (
    <Ratio width={1} height={1}>
      <Image src={user().photo} />
    </Ratio>
  )
}

export default Content
