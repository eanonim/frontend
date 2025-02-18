import {
  Button,
  Field,
  FixedLayout,
  Hue,
  Input,
  Picker,
  Separator,
  Title,
} from "components"
import loc from "engine/languages"

import { setBackground, SETTINGS_ATOM } from "engine/state"
import { backPage, pages, replaceParams, useParams } from "router"
import { type JSX, type Component, createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { useAtom } from "engine/modules/smart-data"
import { HEXtoRGB, RGBtoHEX, RGBtoHSV } from "@minsize/utils"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

type Store = {
  color: [number, number, number]
  accent: [number, number]
}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const [settings] = useAtom(SETTINGS_ATOM)

  const params = useParams<{ backgroundId?: number; color?: string }>({
    pageId: pages.BACKGROUND_EDIT,
  })

  const generateStore = (hex = settings.backgroundColor) => {
    const rgb = HEXtoRGB(hex)
    const hsv = RGBtoHSV(...rgb)
    return {
      color: rgb,
      accent: [hsv[0], 1 - hsv[1]] as [number, number],
    }
  }

  const [store, setStore] = createStore<Store>(generateStore())

  createEffect(() => {
    setStore(generateStore())
  })

  const handlerSave = () => {
    backPage(2)
    setBackground(params().backgroundId, RGBtoHEX(...store.color))
  }

  const onColor = (color: [number, number, number]) => {
    const [r, g, b] = color
    replaceParams({
      color: RGBtoHEX(r, g, b),
      backgroundId: params().backgroundId,
    })
    setStore("color", color)
  }

  const handlerInput: JSX.ChangeEventHandlerUnion<HTMLInputElement, Event> = (
    event,
  ) => {
    const hex = event.target.value

    const store = generateStore(hex)
    replaceParams({
      color: RGBtoHEX(...store.color),
      backgroundId: params().backgroundId,
    })
    setStore(store)
  }

  return (
    <FixedLayout safe position={"bottom"} background={"white"}>
      <Separator />
      <Button.Group
        style={{
          background: "var(--section_bg_color)",
        }}
      >
        <Field>
          <Input
            value={RGBtoHEX(...store.color)}
            style={{ "text-transform": "uppercase" }}
            onChange={handlerInput}
          />
        </Field>
      </Button.Group>
      <Hue
        mode={"telegram"}
        accent={store.accent}
        onChange={(accent) => {
          setStore("accent", accent)
        }}
      >
        <Picker accent={store.accent} color={store.color} onChange={onColor} />

        <Button.Group>
          <Button.Group.Container>
            <Button stretched size={"large"} onClick={handlerSave}>
              <Button.Container>
                <Title>{lang("apply_in_all_chats")}</Title>
              </Button.Container>
            </Button>
          </Button.Group.Container>
        </Button.Group>
      </Hue>

      {/* <Separator size={"indent"} /> */}
    </FixedLayout>
  )
}

export default Footer
