import { type ChildrenReturn, type Component } from "solid-js"

type ArrayJSX = {
  nav: string | string[]
  component: Component
  tabbar?: boolean
}[]

const toArray = (children: ChildrenReturn): ArrayJSX => {
  const child = children()
  if (Array.isArray(child)) {
    return child as unknown as ArrayJSX
  }
  return [child] as unknown as ArrayJSX
}

export default toArray
