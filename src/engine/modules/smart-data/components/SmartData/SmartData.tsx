// import style from "./SmartData.module.css"
import {
  type JSX,
  type Component,
  createContext,
  splitProps,
  mergeProps,
  createEffect,
  Suspense,
} from "solid-js"

import { Content, Skeleton, Error } from "./addition"
import { AtomReturn } from "../../types/index"
import { createStore, produce } from "solid-js/store"
import { useAtomSystem } from "../.."

export const context = createContext({
  skeleton: true,
  error: false,
  content: false,
})

interface SmartDataProps extends JSX.HTMLAttributes<HTMLDivElement> {
  signal: AtomReturn<any, any>
  key?: string | number
}

export type CSmartData = Component<SmartDataProps> & {
  Content: typeof Content
  Skeleton: typeof Skeleton
  Error: typeof Error
}

const SmartData: CSmartData = (props) => {
  const merged = mergeProps({ key: "default" }, props)
  const [local, others] = splitProps(merged, ["signal", "key"])

  const [state] = useAtomSystem(local.signal, { key: () => local.key })

  const [values, setValues] = createStore({
    skeleton: true,
    error: false,
    content: false,
  })

  createEffect(() => {
    if (state) {
      console.log({ ...state })
      const skeleton = !state?.error && !!state?.load
      const error = !!state?.error
      const content = !state?.error && !state?.load
      if (
        skeleton !== values.skeleton ||
        error !== values.error ||
        content !== values.content
      ) {
        setValues(
          produce((store) => {
            store.skeleton = skeleton
            store.error = error
            store.content = content

            return store
          }),
        )
      }
    }
  })

  return (
    <Suspense
      fallback={
        <context.Provider
          value={{
            skeleton: true,
            error: false,
            content: false,
          }}
        >
          {props.children}
        </context.Provider>
      }
    >
      <context.Provider value={values}>{props.children}</context.Provider>
    </Suspense>
  )
}

SmartData.Content = Content
SmartData.Skeleton = Skeleton
SmartData.Error = Error

export default SmartData
