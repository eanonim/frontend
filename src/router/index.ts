export { type Params } from "./src/type/params"

/* HOOKS */
export { default as useParams } from "./src/hooks/useParams"
export { useRouter, useRouterPanel } from "./src/hooks/useRouter"
export { default as useBack } from "./src/hooks/useBack"

/* ACTIONS */
export { backPage } from "./src/actions/backPage"
export { pushPage } from "./src/actions/pushPage"
export { pushModal } from "./src/actions/pushModal"
export { pushPopout } from "./src/actions/pushPopout"
export { replacePage } from "./src/actions/replacePage"
export { replaceParams } from "./src/actions/replaceParams"
export { swipeView } from "./src/actions/swipeView"

export { setStruct } from "./src/actions/setStruct"

/* COMPONENTS */
export { default as Route } from "./src/components/Route"

export {
  routerStruct,
  views,
  pages,
  panels,
  modals,
  popouts,
} from "./routerStruct"
