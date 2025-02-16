import { Badge, Button, FixedLayout, Title } from "components"
import { SearchInteresting } from "engine/api/module"
import loc from "engine/languages"
import { setter, useAtom } from "engine/modules/smart-data"
import { SEARCH_OPTIONS_ATOM } from "engine/state"
import { maxInterest } from "root/configs"
import { backPage } from "router"

import { type JSX, type Component, createMemo } from "solid-js"
import { produce } from "solid-js/store"

interface Footer extends JSX.HTMLAttributes<HTMLDivElement> {}

const Footer: Component<Footer> = (props) => {
  const [lang] = loc()

  const [searchOptions, setSearchOptions] = useAtom(
    SEARCH_OPTIONS_ATOM,
    {},
    { key: "edit" },
  )

  const interestsCount = createMemo(
    () =>
      Object.values(searchOptions.interests).filter((x) => x.isSelected)
        .length ?? 0,
    [searchOptions.interests],
  )

  const handlerSave = () => {
    setter(
      SEARCH_OPTIONS_ATOM,
      "interests",
      produce((interests) => {
        for (const key in interests) {
          if (interests[key as SearchInteresting]) {
            delete interests[key as SearchInteresting]
          }
        }
        // console.log({ interests })

        for (const _key in searchOptions.interests) {
          const key = _key as SearchInteresting
          if (searchOptions.interests[key]?.isSelected) {
            interests[key] = { isSelected: true }
          }
        }

        console.log({ interests })

        return interests
      }),
    )
    backPage()
  }

  return (
    <FixedLayout position={"bottom"}>
      <Button.Group>
        <Button.Group.Container>
          <Button onClick={handlerSave} stretched size={"large"}>
            <Button.Icon style={{ opacity: 0 }}>
              <Badge size={"small"} type={"text"}>
                <Badge.Container>
                  <Title>
                    {interestsCount()}/{maxInterest}
                  </Title>
                </Badge.Container>
              </Badge>
            </Button.Icon>
            <Button.Container>
              <Title>{lang("apply")}</Title>
            </Button.Container>
            <Button.Icon>
              <Badge size={"small"} type={"text"} appearance={"accentReverse"}>
                <Badge.Container>
                  <Title>
                    {interestsCount()}/{maxInterest}
                  </Title>
                </Badge.Container>
              </Badge>
            </Button.Icon>
          </Button>
        </Button.Group.Container>
      </Button.Group>
    </FixedLayout>
  )
}
export default Footer
