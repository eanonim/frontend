import { getter, globalSignal } from "elum-state/solid"
import { PARAMS_ATOM } from "../atom"
import { Accessor, createEffect, createSignal, untrack } from "solid-js"
import { getHistory } from "../utils"

/*
  Переписать на изменяемый
*/

const getType = (
  options?: {
    popoutId?: string
    modalId?: string
    pageId?: string
  },
  location?: {
    pageId: string | undefined
    modalId: string | undefined
    popoutId: string | undefined
  },
) => {
  if (options?.popoutId || location?.popoutId) {
    return `popout=${options?.popoutId || location?.popoutId}`
  } else if (options?.modalId || location?.modalId) {
    return `modal=${options?.modalId || location?.modalId}`
  } else if (options?.pageId || location?.pageId) {
    return `page=${options?.pageId || location?.pageId}`
  }
  return "all"
}

export const useParams = <A extends any>(options?: {
  popoutId?: string
  modalId?: string
  pageId?: string
}): Accessor<A> => {
  const [type, setType] = createSignal(getType(options))
  const location = getHistory()

  createEffect(() => {
    setType(getType(options, location))
  })

  const [storParams] = globalSignal(PARAMS_ATOM)

  const [params, setParams] = createSignal(storParams()[type()] || {})

  createEffect(() => {
    const _params = untrack(params)
    const newParams = storParams()[type()]

    if (
      JSON.stringify(_params) !== JSON.stringify(newParams) &&
      newParams !== undefined
    ) {
      setParams(newParams || {})
    }
  })

  return params
}

export default useParams
