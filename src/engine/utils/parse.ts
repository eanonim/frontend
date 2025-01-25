import { type ChildrenReturn, type Component, type JSX } from "solid-js"

type ArrayJSX = { nav: string; component: Component }[]

export const toArray = (children: ChildrenReturn): ArrayJSX => {
  const child = children()
  if (Array.isArray(child)) {
    return child as unknown as ArrayJSX
  }
  return [child] as unknown as ArrayJSX
}

export const toChilds = (children: ChildrenReturn): Array<JSX.Element> => {
  const child = children()
  if (Array.isArray(child)) {
    return child
  }
  return [child]
}
