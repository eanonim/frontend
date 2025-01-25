import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

/* interface */
interface IContentProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export type Content = Component<IContentProps>

/* mergeProps */
export const ContentProps = (props: IContentProps) => {
  const merged = mergeProps({}, props)

  return splitProps(merged, ["class", "classList", "children"])
}
