import {
  Cell,
  Flex,
  Gap,
  Group,
  IconBackground,
  IconCheck,
  SegmentedControl,
  SubTitle,
  Title,
} from "components"

import {
  type JSX,
  type Component,
  For,
  Switch,
  Match,
  createSignal,
  Show,
  createEffect,
  on,
} from "solid-js"
import loc, { getLocale } from "engine/languages"
import {
  IconBrush,
  IconCoins,
  IconFilterUp,
  IconMessage2Search,
  IconPhotoFilled,
  IconTelegramStar,
  IconTON,
} from "source"
import { useAtom } from "engine/modules/smart-data"
import { PRODUCT_ATOM } from "engine/state"
import { replaceParams } from "router"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const backgrounds = [
  "linear-gradient(180deg, #E96C23 0%, #FF6619 100%)",
  "linear-gradient(180deg, #DA6031 0%, #EF583E 100%)",
  "linear-gradient(180deg, #E65127 0%, #E0412F 100%)",
  "linear-gradient(180deg, #EC4C35 0%, #EA4B3B 100%)",
  "linear-gradient(180deg, #E54D34 0%, #DE3E30 100%)",
  "linear-gradient(180deg, #DC3D45 0%, #E5443A 100%)",
]

const Content: Component<Content> = (props) => {
  const [lang] = loc()

  return (
    <>
      <Group>
        <Group.Container>
          <Cell.List>
            <Cell>
              <Cell.Before
                alignItems={"start"}
                style={{
                  "margin-top": "2px",
                }}
              >
                <IconBackground
                  padding={"4px"}
                  border-radius={"8px"}
                  color={"var(--accent_color)"}
                  style={{
                    background: backgrounds[2],
                  }}
                >
                  <IconCoins />
                </IconBackground>
              </Cell.Before>
              <Cell.Container>
                <Cell.Content>
                  <Title>{lang("invite_friend")}</Title>
                  <SubTitle>
                    <Gap
                      count={"4px"}
                      justifyContent={"start"}
                      alignItems={"center"}
                    >
                      100 <IconCoins height={14} width={14} />
                    </Gap>
                  </SubTitle>
                </Cell.Content>
              </Cell.Container>
            </Cell>
          </Cell.List>
        </Group.Container>
      </Group>
    </>
  )
}

export default Content
