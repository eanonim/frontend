import { Cell, Panel, SubTitle, Title } from "components"

import { Content, Header } from "./fragment"

import { type JSX, type Component, createEffect } from "solid-js"
import { useAtom } from "engine/modules/smart-data"
import { TEST_ATOM } from "engine/state"

interface Default extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const Default: Component<Default> = (props) => {
  const [getter, setter] = useAtom(TEST_ATOM)

  // onMount(() => {
  //   setTimeout(() => {
  //     console.log("END")
  //     setter(
  //       "user",
  //       produce((store) => {
  //         store.first_name = "Егро2"

  //         return store
  //       }),
  //     )

  //     // setter("user", (store) => {
  //     //   store.first_name = "Егор"

  //     //   return store
  //     // })
  //     // setter("user", "first_name", "Егор")
  //   }, 4000)
  // })

  createEffect(() => {
    console.log({ getter: getter })
  })

  return (
    <Panel {...props}>
      <Cell>
        <Cell.Container>
          <Cell.Content>
            <Title>
              {getter.user.first_name}
              {getter.user.last_name}
            </Title>
            <SubTitle>ICON_ID: {getter.user.icon.id}</SubTitle>
          </Cell.Content>
        </Cell.Container>
      </Cell>
      <Header />
      <Content />
    </Panel>
  )
}

export default Default
