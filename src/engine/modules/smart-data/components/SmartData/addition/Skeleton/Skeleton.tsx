import style from "./Skeleton.module.css"
import { type Skeleton, SkeletonProps } from "./Skeleton.props"

import { context } from "../../SmartData"

import { Show, useContext } from "solid-js"

const Skeleton: Skeleton = (props) => {
  const [local, others] = SkeletonProps(props)
  const values = useContext(context)

  return <Show when={values.skeleton}>{local.children}</Show>
}

export default Skeleton
