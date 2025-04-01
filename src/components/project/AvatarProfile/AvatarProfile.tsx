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

interface AvatarProfile extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "id"> {
  src?: string
  first_name: string
  last_name: string
  emoji?: number
  id: number
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
    "id",
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
            <UserName
              class={style.AvatarProfile__name_subtitle}
              first_name={`id${local.id || 0}`}
              last_name={""}
            />
          </Flex>

          <Badge>
            <Badge.Container>
              <Title>{formatNumberWithDotsRegex(local.coin || 0)}</Title>
            </Badge.Container>
          </Badge>
        </span>
      </Ratio>
    </div>
  )
}

export default AvatarProfile
