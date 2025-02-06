export {
  smartDataAtom,
  createSmartData,
  createSystemSmartData,
  setterSmartData,
  getterSmartData,
  managerSmartData,
  type SmartDataAtom,
} from "./handlers/index"

export { default as atom } from "./handlers/atom"
export { default as useAtom } from "./handlers/useAtom"
export { default as useAtomSystem } from "./handlers/useAtomSystem"
export { default as getter } from "./handlers/getter"
export { default as setter } from "./handlers/setter"
export { default as setterStatus } from "./handlers/setterStatus"

export { default as SmartData } from "./components/SmartData/SmartData"

/* utils */
export { default as getDefault } from "./utils/getDefault"
export { default as getValue } from "./utils/getValue"
