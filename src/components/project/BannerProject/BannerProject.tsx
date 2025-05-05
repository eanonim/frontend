import style from "./BannerProject.module.css"

import Ratio from "@component/default/Templates/Ratio/Ratio"
import Image from "@component/default/Blocks/Image/Image"
import UserName from "@component/default/Blocks/UserName/UserName"
import Flex from "@component/default/Blocks/Flex/Flex"
import Badge from "@component/default/Blocks/Badge/Badge"
import Title from "@component/default/Typography/Title/Title"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"
import { emojis } from "root/configs"
import { formatNumberWithDotsRegex } from "engine"
import Gap from "@component/default/Templates/Gap/Gap"
import { IconClose, IconCoins, Logo } from "source"
import { formatNumber } from "@minsize/utils"
import Cell from "@component/default/Blocks/Cell/Cell"
import SubTitle from "@component/default/Typography/SubTitle/SubTitle"
import Group from "@component/default/Blocks/Group/Group"
import Button from "@component/default/Blocks/Button/Button"

interface BannerProject extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "id"> {
  title?: string
  subtitle?: string
  subtitle2?: string
  onClose?: () => void
}

const BannerProject: Component<BannerProject> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "title",
    "subtitle",
    "subtitle2",
    "onClose",
  ])

  return (
    <Group>
      <Group.Container class={style.BannerProject}>
        <Cell size={"small"}>
          <Cell.Before>
            <Logo class={style.BannerProject__logo} width={56} height={56} />
          </Cell.Before>
          <Cell.Container>
            <Cell.Content>
              <Title color={"primary"}>{local.title}</Title>
              <SubTitle color={"primary"}>{local.subtitle}</SubTitle>
            </Cell.Content>
            <Cell.After>
              <Button
                onClick={local.onClose}
                class={style.BannerProject__Close}
                size={"small"}
                type={"icon"}
                mode={"transparent"}
              >
                <Button.Container>
                  <IconClose width={24} height={25} />
                </Button.Container>
              </Button>
            </Cell.After>
          </Cell.Container>
        </Cell>
        <Cell size={"small"}>
          <Cell.Container>
            <Cell.Content>
              <SubTitle color={"primary"}>{local.subtitle2}</SubTitle>
            </Cell.Content>
          </Cell.Container>
        </Cell>
      </Group.Container>
    </Group>
  )
}

export default BannerProject
