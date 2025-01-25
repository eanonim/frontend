import { setter } from "elum-state/solid"
import { STRUCT_ATOM } from "../atom"

/**
 *
 * @deprecated
 */
const setStruct = (
  struct: {
    viewId: string
    default: string
    panels: Record<string, string>
  }[],
) => {
  setter(STRUCT_ATOM, struct)
}

export { setStruct }
