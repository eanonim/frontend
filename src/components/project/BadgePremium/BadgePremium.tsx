import style from "./BadgePremium.module.css"
import Badge from "@component/default/Blocks/Badge/Badge"

import { type JSX, type Component } from "solid-js"
import SubTitle from "@component/default/Typography/SubTitle/SubTitle"

interface BadgePremium extends JSX.HTMLAttributes<HTMLSpanElement> {
  text?: string
}

const BadgePremium: Component<BadgePremium> = (props) => {
  return (
    <Badge size={"small"} appearance={"secondary"}>
      <Badge.Container>
        <SubTitle>{props.text || "Premium"}</SubTitle>
      </Badge.Container>
    </Badge>
  )
}

export default BadgePremium
