import style from "./Before.module.css"
import { CellStore } from "../../context"

import { type TypeFlex } from "@ui/index"
import Align from "@ui/default/Templates/Align/Align"
import Flex from "@ui/default/Blocks/Flex/Flex"
import GapContext from "@ui/default/Templates/Gap/context"
import generateGap from "@ui/default/utils/generateGap"

import {
  type JSX,
  type Component,
  mergeProps,
  splitProps,
  useContext,
  ValidComponent,
} from "solid-js"

interface Before<T extends ValidComponent = "span"> extends TypeFlex<T> {}

const Before: Component<Before> = (props) => {
  const context = useContext(CellStore)

  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, ["class", "classList", "children"])

  return (
    <Align.Before when={!!local.children}>
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        component={"span"}
        class={context.getStyle().before}
        classList={{
          [`${local.class}`]: !!local.class,
          ...local.classList,
        }}
        {...others}
      >
        <GapContext.Provider
          value={generateGap(
            {
              count: {
                iOS: "8px",
                android: "16px",
                macOS: "8px",
                windows: "12px",
                others: "10px",
              },
            },
            context.getPlatform,
          )}
        >
          {local.children}
        </GapContext.Provider>
      </Flex>
    </Align.Before>
  )
}

export default Before
