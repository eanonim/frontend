import { AvatarProfile } from "components"
import { useAtom } from "engine/modules/smart-data"

import { USER_ATOM } from "engine/state"
import { HOST_CDN } from "root/configs"

import { type JSX, type Component } from "solid-js"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [user] = useAtom(USER_ATOM)

  return (
    <AvatarProfile
      src={`https://${HOST_CDN}/v1/image/user/${user.image}?size=1000`}
      emoji={user.emoji}
      first_name={user.first_name}
      last_name={user.last_name}
      coin={user.coin}
    />
  )
}

export default Content
