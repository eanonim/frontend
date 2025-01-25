import { getter, setter } from "elum-state/solid"
import { Params } from ".."
import { PARAMS_ATOM } from "../atom"
import { bridgeSessionStorageSet } from "@apiteam/twa-bridge/solid"

type Props<P extends Params> = {
  popoutId?: string
  modalId?: string
  pageId?: string
  params?: P
}

const setParams = <P>({ popoutId, modalId, pageId, params }: Props<P>) => {
  if (params) {
    setter(PARAMS_ATOM, (value) => {
      value["all"] = params
      if (pageId) value[`page=${pageId}`] = params
      if (modalId) value[`modal=${modalId}`] = params
      if (popoutId) value[`popout=${popoutId}`] = params
      return { ...value }
    })
    bridgeSessionStorageSet({
      key: "router_params",
      value: getter(PARAMS_ATOM),
    })
  }
}

export default setParams
