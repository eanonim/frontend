import { Background, Flex, Message } from "components"
import loc from "engine/languages"

import { type JSX, type Component } from "solid-js"
import { timeAgoOnlyDate } from "engine"
import { useAtom } from "engine/modules/smart-data"
import { SETTINGS_ATOM } from "engine/state"

interface Content extends JSX.HTMLAttributes<HTMLDivElement> {}

const Content: Component<Content> = (props) => {
  const [lang] = loc()
  const [settings] = useAtom(SETTINGS_ATOM)

  return (
    <>
      <Background
        fixed
        type={settings.backgroundId}
        color={settings.backgroundColor}
        quality={2}
      />
      <Flex
        style={{
          height: "100%",
          overflow: "hidden",
          "margin-top": "auto",
        }}
        alignItems={"end"}
        justifyContent={"end"}
      >
        <div
          style={{
            padding: "10px 4px",
            "box-sizing": "border-box",
          }}
        >
          <Message.SystemDate key={0} visible>
            {timeAgoOnlyDate(new Date().getTime())}
          </Message.SystemDate>
          <Message
            type={"out"}
            text={lang("font_size.templates.1")}
            time={new Date()}
            isRead={true}
            onRead={() => {}}
          />
          <Message
            reply={{
              text: lang("font_size.templates.1"),
            }}
            type={"in"}
            text={lang("font_size.templates.2")}
            time={new Date()}
            isRead={true}
            onRead={() => {}}
          />
          <Message
            type={"out"}
            text={lang("font_size.templates.3")}
            time={new Date()}
            isRead={true}
            onRead={() => {}}
          />
        </div>
      </Flex>
    </>
  )
}

export default Content
