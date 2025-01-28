import { bridgeSetHeaderColor } from "@apiteam/twa-bridge/solid"

const setHeaderColor = ({
  type,
  color,
}: {
  type?: "secondary" | "bg_color"
  color?: string
}) => {
  if (type) {
    const bodyStyles = window.getComputedStyle(document.body)
    const _color = bodyStyles.getPropertyValue("--" + type)

    color = _color
  }

  console.log({ color })
  if (color) {
    bridgeSetHeaderColor({
      color: color,
    })
  }
}

export default setHeaderColor
