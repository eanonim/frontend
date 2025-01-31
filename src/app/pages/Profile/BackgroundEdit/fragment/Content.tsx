import { Background, Flex } from "components"

import { type JSX, type Component } from "solid-js"
import { pages, useParams } from "router"
import { globalSignal } from "elum-state/solid"
import { SETTINGS_ATOM } from "engine/state"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [settings] = globalSignal(SETTINGS_ATOM)

  const params = useParams<{ backgroundId?: number; color?: string }>({
    pageId: pages.BACKGROUND_EDIT,
  })

  return (
    <Flex height={"100%"}>
      <Background
        fixed
        type={params().backgroundId || 0}
        color={params().color || settings().backgroundColor}
      />
    </Flex>
  )
}

export default Content
