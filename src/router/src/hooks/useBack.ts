import { globalSignal } from "elum-state/solid"
import { HISTORY_ATOM, VIEW_ATOM } from "../atom"

export const useBack = () => {
  const [view] = globalSignal(VIEW_ATOM)
  const [value] = globalSignal(HISTORY_ATOM)

  return () => value().view?.[view()]?.array?.slice(-1)[0]?.is_back ?? false
}

export default useBack
