import { Button, type TypeFlex } from "@ui/index"
import {
  type ValidComponent,
  type Component,
  mergeProps,
  splitProps,
  Show,
  For,
  JSX,
} from "solid-js"

interface Keyboard<K extends unknown[][], T extends ValidComponent = "span">
  extends Omit<TypeFlex<T>, "children"> {
  each?: K
  children: (button: K[0][0]) => JSX.Element
}

const Keyboard = <T extends unknown[][]>(props: Keyboard<T>) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "each",
    "children",
  ])

  return (
    <Show keyed when={local.each}>
      {(keyboards) => (
        <Button.Group>
          <For each={keyboards}>
            {(keyboard) => (
              <Button.Group.Container>
                <For each={keyboard}>
                  {(button) => local.children(button as T)}
                </For>
              </Button.Group.Container>
            )}
          </For>
        </Button.Group>
      )}
    </Show>
  )
}

export default Keyboard
