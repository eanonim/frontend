import { bridgeSetHeaderColor } from "@apiteam/twa-bridge/solid"

let last: {
  type?: "secondary" | "bg_color" | "section_bg_color" | "red_color"
  color?: string
  isFixed: boolean
}[] = []

const setHeaderColor = ({
  type,
  color,
  isLast = false,
  isFixed = false,
}: {
  type?: "secondary" | "bg_color" | "section_bg_color" | "red_color"
  color?: string
  isLast?: boolean
  isFixed?: boolean
}) => {
  if (isLast) {
    if (!last[last.length - 2]) return
    color = last[last.length - 2].color
    type = last[last.length - 2].type
  } else {
    if (last[last.length - 1]?.isFixed) return
  }

  if (type) {
    const bodyStyles = window.getComputedStyle(document.body)
    const _color = bodyStyles.getPropertyValue("--" + type)

    color = _color
  }

  if (color) {
    bridgeSetHeaderColor({
      color: color,
    })
  }

  if (!isLast) {
    last.push({ color, type, isFixed })
  } else {
    if (last[last.length - 1]) {
      last[last.length - 1].isFixed = isFixed
    }
  }
}

export default setHeaderColor
