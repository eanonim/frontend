import Button from "@component/default/Blocks/Button/Button"
import style from "./Reconnection.module.css"

import Cell from "@component/default/Blocks/Cell/Cell"
import Flex from "@component/default/Blocks/Flex/Flex"
import Plug from "@component/default/Blocks/Plug/Plug"
import Title from "@component/default/Typography/Title/Title"
import { Status } from "@elum/ews"
import { setHeaderColor } from "engine"
import { socket } from "engine/api/module"
import { type JSX, type Component, onMount, createEffect, on } from "solid-js"
import { createStore } from "solid-js/store"

interface Reconnection extends JSX.HTMLAttributes<HTMLDivElement> {
  handlerReconnect: () => void
}

const Reconnection: Component<Reconnection> = (props) => {
  let ref: HTMLDivElement

  const [store, setStore] = createStore({
    isVisible: false,
    isAbort: false,
    height: 0,
  })

  let timer: NodeJS.Timeout

  createEffect(
    on(
      () => socket.status(),
      (status, prevStatus) => {
        let visible = false
        let abort = false
        if (
          prevStatus !== undefined &&
          [(Status.OPEN, Status.CLOSE, Status.CONNECTING)].includes(prevStatus)
        ) {
          if (status === Status.CLOSE || status === Status.CONNECTING) {
            visible = true
          }
        }
        if (status === Status.OPEN) {
          visible = false
        }
        if (status === Status.ABORT) {
          visible = true
          abort = true
        }

        setStore("isVisible", visible)
        setStore("isAbort", abort)

        clearTimeout(timer)

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

        timer = setTimeout(
          () => {
            setHeaderColor(
              visible ? { type: "red_color", isFixed: true } : { isLast: true },
            )
          },
          visible ? 0 : 300,
        )
      },
    ),
  )

  onMount(() => {
    if (ref!) {
      setStore("height", ref.clientHeight || 0)
    }
  })

  return (
    <>
      <div
        class={style.Reconnection}
        classList={{
          [style[`Reconnection--hidden`]]: !store.isAbort
            ? !store.isVisible
            : true,
        }}
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
      <div
        class={style.Reconnection__Plug}
        classList={{
          [style[`Reconnection__Plug--hidden`]]: !store.isAbort,
        }}
      >
        <Plug full>
          <Plug.Container>
            <Title>Server Error</Title>
          </Plug.Container>
          <Plug.Action style={{ width: "100%" }}>
            <Button
              stretched
              size={"large"}
              onClick={() => {
                setStore("isAbort", false)
                setStore("isVisible", false)
                props.handlerReconnect()
              }}
            >
              <Button.Container>
                <Title>Reconnecting</Title>
              </Button.Container>
            </Button>
          </Plug.Action>
        </Plug>
      </div>
    </>
  )
}

export default Reconnection
