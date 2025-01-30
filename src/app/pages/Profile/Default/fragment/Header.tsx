import { AvatarProfile } from "components"

import { createSmartData, USER_ATOM } from "engine/state"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [user] = createSmartData(USER_ATOM, {}, {})

  return (
    <AvatarProfile
      src={user().photo}
      id={user().id}
      first_name={user().first_name}
      last_name={user().last_name}
    />
  )
}

export default Content
