import { Background, Flex, Gap, Group, Link, SubTitle } from "components"

import { chunks } from "@minsize/utils"

import { type JSX, type Component, For, Show } from "solid-js"
import { pages, useParams } from "router"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const params = useParams<{ backgroundId?: number; color?: string }>({
    pageId: pages.BACKGROUND_EDIT,
  })

  return (
    <Flex height={"100%"}>
      <Background
        fixed
        type={params().backgroundId || 0}
        color={params().color}
      />
    </Flex>
  )
}

export default Content
