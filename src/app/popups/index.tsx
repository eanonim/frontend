import { Path, PopoutRoot } from "components"
import { popouts, useRouter } from "router"
import { type Component, type JSX } from "solid-js"

import Error from "./Error/Error"

interface Popout extends JSX.HTMLAttributes<HTMLDivElement> {}

const Popout: Component<Popout> = () => {
  const activePopout = useRouter("popout")

  return (
    <PopoutRoot activePopout={activePopout()}>
      <Path nav={popouts.ERROR} component={Error} />
    </PopoutRoot>
  )
}

export default Popout
