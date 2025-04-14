import style from "./AvatarProfile.module.css"

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
import { IconCoins } from "source"
import { formatNumber } from "@minsize/utils"

interface AvatarProfile extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "id"> {
  src?: string
  first_name: string
  last_name: string
  emoji?: number
  coin: number
}

const AvatarProfile: Component<AvatarProfile> = (props) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "src",
    "first_name",
    "last_name",
    "emoji",
    "coin",
  ])

  return (
    <div
      class={style.AvatarProfile}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <Ratio width={1} height={1}>
        <Image src={local.src} />
        <span class={style.AvatarProfile__name}>
          <Flex
            alignItems={"start"}
            justifyContent={"start"}
            direction={"column"}
          >
            <UserName
              class={style.AvatarProfile__name_title}
              first_name={local.first_name}
              last_name={local.last_name}
              emoji={local.emoji}
            />
          </Flex>

          <Badge>
            <Badge.Container>
              <Title>
                <Gap
                  count={"4px"}
                  justifyContent={"start"}
                  alignItems={"center"}
                >
                  {formatNumber(local.coin || 0)}
                  <IconCoins height={14} width={14} />
                </Gap>
              </Title>
            </Badge.Container>
          </Badge>
        </span>
      </Ratio>
    </div>
  )
}

export default AvatarProfile
