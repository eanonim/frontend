import { usePlatform } from "@component/index"
import setHeaderColor from "./setHeaderColor"
import { onMount } from "solid-js"

const useHeaderColor = (params: {
  iOS: "section_bg_color" | "bg_color"
  android: "section_bg_color" | "bg_color"
}) => {
  const platform = usePlatform()

  onMount(() => {
    setHeaderColor({ type: params[platform()] })
  })
}

export default useHeaderColor
