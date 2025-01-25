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
import { SmartDataAtom } from "../../handlers"
import {
  type GlobalAtom,
  type SmartData as ISmartData,
} from "../../types/index"
import { globalSignal } from "elum-state/solid"
import { createStore, produce } from "solid-js/store"

export const context = createContext({
  skeleton: true,
  error: false,
  content: false,
})

interface SmartDataProps extends JSX.HTMLAttributes<HTMLDivElement> {
  atom: GlobalAtom<any, any>
  key?: string | number
}

export type CSmartData = Component<SmartDataProps> & {
  Content: typeof Content
  Skeleton: typeof Skeleton
  Error: typeof Error
}

const SmartData: CSmartData = (props) => {
  const merged = mergeProps({ key: "default" }, props)
  const [local, others] = splitProps(merged, ["atom", "key"])

  const [state] = globalSignal(
    local.atom as unknown as GlobalAtom<
      SmartDataAtom<ISmartData<unknown>, any>,
      any
    >,
  )

  const [values, setValues] = createStore({
    skeleton: true,
    error: false,
    content: false,
  })

  createEffect(() => {
    const data = state().cache.get(String(local.key))
    if (data) {
      const skeleton = !data?.system?.isError && !!data?.system?.isLoad
      const error = !!data?.system?.isError
      const content = !data?.system?.isError && !data?.system?.isLoad
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
