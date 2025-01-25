import { styles } from "./styles"
import { Field, Icon } from "./addons"

import { type HTMLAttributes } from "@ui/Types"
import Flex from "@ui/default/Blocks/Flex/Flex"
import Separator from "@ui/default/Blocks/Separator/Separator"
import Show from "@ui/default/Templates/Show/Show"
import usePlatform from "@ui/default/utils/usePlatform"
import useStyle from "@ui/default/utils/useStyle"

import {
  type Component,
  createEffect,
  mergeProps,
  on,
  splitProps,
} from "solid-js"
import { type DynamicProps } from "solid-js/web"
import { createStore } from "solid-js/store"

interface WriteBar extends HTMLAttributes<DynamicProps<"div">> {
  separator?: "auto" | boolean
}

type ComponentWriteBar = Component<WriteBar> & {
  Field: typeof Field
  Icon: typeof Icon
}

type Store = {
  isSeparator: boolean
}

const WriteBar: ComponentWriteBar = (props) => {
  const platform = usePlatform(props.platform)
  const style = useStyle(styles, props.platform)
  const merged = mergeProps({ separator: "auto" }, props) as WriteBar
  const [local, others] = splitProps(merged, [
    "platform",
    "class",
    "classList",
    "children",
    "separator",
  ])

  const [store, setStore] = createStore<Store>({ isSeparator: false })

  createEffect(
    on(platform, (platform) => {
      setStore(
        "isSeparator",
        local.separator === "auto"
          ? ["iOS", "macOS"].indexOf(platform) !== -1
          : !!local.separator,
      )
    }),
  )

  return (
    <Flex
      component={"div"}
      alignItems={"end"}
      class={style.WriteBar}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <Show when={store.isSeparator} native>
        <Separator
          class={style.WriteBar__separator}
          color={"secondary"}
          size={"full"}
        />
      </Show>
      {local.children}
    </Flex>
  )
}

WriteBar.Field = Field
WriteBar.Icon = Icon

export default WriteBar
