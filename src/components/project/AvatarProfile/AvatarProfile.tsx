import style from "./AvatarProfile.module.css"

import Ratio from "@component/default/Templates/Ratio/Ratio"
import Image from "@component/default/Blocks/Image/Image"

import { type JSX, type Component, mergeProps, splitProps } from "solid-js"
import UserName from "@component/default/Blocks/UserName/UserName"

interface AvatarProfile extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "id"> {
  src?: string
  first_name: string
  last_name: string
  icon?: string
  id: number
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
    "icon",
    "id",
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
          <UserName
            class={style.AvatarProfile__name_title}
            first_name={local.first_name}
            last_name={local.last_name}
            icon={local.icon}
          />
          <span>
            <UserName
              class={style.AvatarProfile__name_subtitle}
              first_name={`id${local.id || 0}`}
              last_name={""}
            />
          </span>
        </span>
      </Ratio>
    </div>
  )
}

export default AvatarProfile
