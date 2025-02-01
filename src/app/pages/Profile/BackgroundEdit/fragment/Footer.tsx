import { Button, FixedLayout, Separator, Title } from "components"
import loc from "engine/languages"

import { globalSignal } from "elum-state/solid"
import { setBackground, SETTINGS_ATOM } from "engine/state"
import { backPage, pages, replaceParams, useParams } from "router"
import { type JSX, type Component, For } from "solid-js"
import { createStore } from "solid-js/store"

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
  color: string
}

function applyAlphaToHex(hexColor: string, alpha: number) {
  if (alpha < 0 || alpha > 1) {
    return hexColor
  }

  hexColor = hexColor.replace("#", "")
  if (!/^[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(hexColor)) {
    return "#" + hexColor
  }

  try {
    if (hexColor.length === 3) {
      hexColor =
        hexColor[0] +
        hexColor[0] +
        hexColor[1] +
        hexColor[1] +
        hexColor[2] +
        hexColor[2]
    }

    const r = parseInt(hexColor.substring(0, 2), 16)
    const g = parseInt(hexColor.substring(2, 4), 16)
    const b = parseInt(hexColor.substring(4, 6), 16)

    const alphaHex = Math.round(alpha * 255).toString(16)
    const alphaHexPadded = alphaHex.length === 1 ? "0" + alphaHex : alphaHex
    return `#${hexColor}${alphaHexPadded}`
  } catch (e) {
    return "#" + hexColor
  }
}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()
  const [settings] = globalSignal(SETTINGS_ATOM)

  const params = useParams<{ backgroundId?: number; color?: string }>({
    pageId: pages.BACKGROUND_EDIT,
  })

  const [store, setStore] = createStore<Store>({
    color: settings().backgroundColor || "#222222",
  })

  const handlerSave = () => {
    backPage(2)
    setBackground(params().backgroundId, store.color)
  }

  const onColor = (color: string) => {
    replaceParams({
      color: applyAlphaToHex(color, 0.3),
      backgroundId: params().backgroundId,
    })

    setStore("color", color)
  }

  return (
    <FixedLayout safe position={"bottom"} background={"section_bg_color"}>
      <Button.Group>
        <For each={colors}>
          {(colors, index) => (
            <Button.Group.Container data-index={index()}>
              <For each={colors}>
                {(color, index) => (
                  <Button
                    data-index={index()}
                    size={"small"}
                    type={"icon"}
                    onClick={() => onColor(color.color)}
                    appearance={"primary"}
                    mode={"transparent"}
                    style={{
                      background: color.color,
                      border:
                        store.color === color.color
                          ? "2px solid white"
                          : `2px solid ${color.color}`,
                    }}
                  >
                    <Button.Container>
                      <span
                        style={{
                          width: "28px",
                          height: "28px",
                          display: "block",
                        }}
                      />
                    </Button.Container>
                  </Button>
                )}
              </For>
            </Button.Group.Container>
          )}
        </For>
      </Button.Group>

      <Separator size={"indent"} />

      <Button.Group>
        <Button.Group.Container>
          <Button stretched size={"large"} onClick={handlerSave}>
            <Button.Container>
              <Title>{lang("apply_in_all_chats")}</Title>
            </Button.Container>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}

export default Footer
