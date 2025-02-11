import style from "./Error.module.css"

import { type JSX, type Component, onMount, onCleanup } from "solid-js"

import { Button, Cell, Snackbar } from "components"

import { backPage, useParams } from "router"

interface Error extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Error: Component<Error> = (props) => {
  const params = useParams<{ error_code: number; label: string }>({
    popoutId: props.nav,
  })
  const handleClose = () => {
    backPage(1)
  }

  onMount(() => {
    const closePopup = (params().label || "").length * (125 * 1.4)

    if (closePopup) {
      const timer = setTimeout(handleClose, closePopup)

      onCleanup(() => {
        clearTimeout(timer)
      })
    }
  })

  return (
    <Snackbar onClose={handleClose}>
      <Cell>
        <Cell.Container>
          <Cell.Content>{params().label}</Cell.Content>
          <Cell.After>
            <Button size={"small"} mode={"transparent"} onClick={handleClose}>
              Close
            </Button>
          </Cell.After>
        </Cell.Container>
      </Cell>
    </Snackbar>
  )
}

export default Error
