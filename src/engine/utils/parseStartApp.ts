import { bridgeGetInitData } from "@apiteam/twa-bridge/solid"

type parseStartAppObject = {
  ref?: string
  clan?: string
  promo?: string
}

const params: Array<"ref" | "clan" | "promo"> = ["ref", "clan", "promo"]

const parseStartApp = () => {
  const getInitData = bridgeGetInitData()

  const start_params = getInitData?.start_param || ""
  var object: parseStartAppObject = {}

  for (const param of params) {
    if (start_params.slice(0, 8) === "refclan_") {
      const _param = [...start_params.matchAll(/(?:_[a-z0-9]+)/g)]
      if (!!_param[1]) object["ref"] = _param[0][0].slice(1)
      if (!!_param[0]) object["clan"] = _param[1][0].slice(1)
    }
    if (start_params.slice(0, param.length + 1) === param + "_") {
      object[param] = start_params.slice(param.length + 1)
    }
  }

  return object
}

export default parseStartApp
