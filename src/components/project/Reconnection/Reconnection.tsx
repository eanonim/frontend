import style from "./Reconnection.module.css"

import Cell from "@component/default/Blocks/Cell/Cell"
import Flex from "@component/default/Blocks/Flex/Flex"
import Title from "@component/default/Typography/Title/Title"
import { Status } from "@elum/ews"
import { setHeaderColor } from "engine"
import { socket } from "engine/api/module"
import { type JSX, type Component, onMount, createEffect, on } from "solid-js"
import { createStore } from "solid-js/store"

interface Reconnection extends JSX.HTMLAttributes<HTMLDivElement> {}

const Reconnection: Component<Reconnection> = (props) => {
  let ref: HTMLDivElement

  const [store, setStore] = createStore({
    isVisible: false,
    height: 0,
  })

  createEffect(
    on(socket.status, (status) => {
      const visible = status === Status.CLOSE || status === Status.CONNECTING
      setStore("isVisible", visible)

      setTimeout(
        () => {
          const bodyStyles = window.getComputedStyle(document.body)
          const safeContentTop = bodyStyles.getPropertyValue(
            "--content-safe-area-inset-top",
          )
          if (!safeContentTop || safeContentTop === "0px") {
            document.body.style.setProperty(
              "--reconnection_height",
              visible
                ? `calc(${store.height}px + var(--safe-area-inset-top, 0px))`
                : "0px",
            )
          }
          setHeaderColor(
            visible ? { type: "red_color", isFixed: true } : { isLast: true },
          )
        },
        visible ? 0 : 300,
      )
    }),
  )

  onMount(() => {
    if (ref!) {
      setStore("height", ref.clientHeight || 0)
    }
  })

  return (
    <div
      classList={{
        [style[`Reconnection--hidden`]]: !store.isVisible,
      }}
      class={style.Reconnection}
      ref={ref!}
    >
      <Cell>
        <Cell.Container>
          <Cell.Content>
            <Flex>
              <Title align={"center"}>Reconnection</Title>
              <span class={style.Reconnection__badge}></span>
              <span class={style.Reconnection__badge}></span>
              <span class={style.Reconnection__badge}></span>
            </Flex>
          </Cell.Content>
        </Cell.Container>
      </Cell>
    </div>
  )
}

export default Reconnection
