import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

/* interface */
interface ISkeletonProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export type Skeleton = Component<ISkeletonProps>

/* mergeProps */
export const SkeletonProps = (props: ISkeletonProps) => {
  const merged = mergeProps({}, props)

  return splitProps(merged, ["class", "classList", "children"])
}
