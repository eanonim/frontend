export { type Params } from "./type/params"

/* HOOKS */
export { default as useParams } from "./hooks/useParams"
export { useRouter, useRouterPanel } from "./hooks/useRouter"
export { default as useBack } from "./hooks/useBack"

/* ACTIONS */
export { backPage } from "./actions/backPage"
export { pushPage } from "./actions/pushPage"
export { pushModal } from "./actions/pushModal"
export { pushPopout } from "./actions/pushPopout"
export { replacePage } from "./actions/replacePage"
export { replaceParams } from "./actions/replaceParams"
export { swipeView } from "./actions/swipeView"
export { replaceModal } from "./actions/replaceModal"

export { setStruct } from "./actions/setStruct"

/* COMPONENTS */
export { default as Route } from "./components/Route"
