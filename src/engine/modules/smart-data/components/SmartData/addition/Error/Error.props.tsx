import { type JSX, type Component, mergeProps, splitProps } from "solid-js"

/* interface */
interface IErrorProps extends JSX.HTMLAttributes<HTMLDivElement> {}
export type Error = Component<IErrorProps>

/* mergeProps */
export const ErrorProps = (props: IErrorProps) => {
  const merged = mergeProps({}, props)

  return splitProps(merged, ["class", "classList", "children"])
}
