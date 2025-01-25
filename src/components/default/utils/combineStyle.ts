import { type JSX } from "solid-js"

import cssStringToJson from "@ui/default/utils/cssStringToJson"

const combineStyle = (
  style: string | JSX.CSSProperties | undefined,
  others: string | JSX.CSSProperties | undefined,
) => {
  return { ...cssStringToJson(others), ...cssStringToJson(style) }
}

export default combineStyle

// console.log("1", combineStyle("width: 100%", { height: "100%" }))
// console.log("2", combineStyle("width: 100%", "height: 100%"))
// console.log("3", combineStyle({ width: "100%" }, { height: "100%" }))
// console.log("4", combineStyle({ width: "100%" }, undefined))
// console.log("5", combineStyle(undefined, { height: "100%" }))
// console.log("6", combineStyle(undefined, undefined))
