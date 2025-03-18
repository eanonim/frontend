import { Path, PopoutRoot } from "components"
import { popouts, useRouter } from "router"
import { type Component, type JSX } from "solid-js"

import Error from "./Error/Error"
import NewMessage from "./NewMessage/NewMessage"

interface Popout extends JSX.HTMLAttributes<HTMLDivElement> {}

const Popout: Component<Popout> = () => {
  const activePopout = useRouter("popout")

  return (
    <PopoutRoot activePopout={activePopout()}>
      <Path nav={popouts.ERROR} component={Error} />
      <Path nav={popouts.NEW_MESSAGE} component={NewMessage} />
    </PopoutRoot>
  )
}

export default Popout
