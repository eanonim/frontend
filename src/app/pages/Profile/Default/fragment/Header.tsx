import { AvatarProfile } from "components"
import { SmartData, useAtom } from "engine/modules/smart-data"

import { USER_ATOM } from "engine/state"

import { type JSX, type Component, createEffect } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [user] = useAtom(USER_ATOM)

  return (
    <SmartData signal={USER_ATOM}>
      <SmartData.Content>
        <AvatarProfile
          src={user.image}
          id={user.id}
          first_name={user.first_name}
          last_name={user.last_name}
        />
      </SmartData.Content>
      <SmartData.Skeleton>ASFASF</SmartData.Skeleton>
    </SmartData>
  )
}

export default Content
