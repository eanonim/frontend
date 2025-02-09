import {
  Button,
  Field,
  FixedLayout,
  Hue,
  Input,
  Picker,
  Separator,
  Title,
  WriteBar,
} from "components"
import loc from "engine/languages"

import { globalSignal } from "elum-state/solid"
import { setBackground, SETTINGS_ATOM } from "engine/state"
import { backPage, pages, replaceParams, useParams } from "router"
import { type JSX, type Component, For, createEffect } from "solid-js"
import { createStore } from "solid-js/store"
import { useAtom } from "engine/modules/smart-data"
import { HEXtoRGB, RGBtoHEX, RGBtoHSV } from "@minsize/utils"

const colors: {
  color: string
}[][] = [
  [
    {
      color: "#FF4D4D",
    },
    {
      color: "#FFA500",
    },
    {
      color: "#FFFF66",
    },
    {
      color: "#66FF66",
    },
    {
      color: "#66B2FF",
    },
    {
      color: "#3366FF",
    },
    {
      color: "#CC66FF",
    },
  ],
  [
    {
      color: "#FF6666",
    },
    {
      color: "#FFB347",
    },
    {
      color: "#FFFF99",
    },
    {
      color: "#90EE90",
    },
    {
      color: "#ADD8E6",
    },
    {
      color: "#6699FF",
    },
    {
      color: "#DDA0DD",
    },
  ],
  [
    {
      color: "#CC3333",
    },
    {
      color: "#E67E22",
    },
    {
      color: "#E6D066",
    },
    {
      color: "#388E3C",
    },
    {
      color: "#4682B4",
    },
    {
      color: "#2A2ACE",
    },
    {
      color: "#6A5ACD",
    },
  ],
]

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

  const generateStore = () => {
    const rgb = HEXtoRGB(settings.backgroundColor)
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
