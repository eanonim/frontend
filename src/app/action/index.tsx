import { Action as EAction, Tabbar, Path, Title, Gap, Avatar } from "components"
import loc from "engine/languages"

import { panels, swipeView, useRouter, useRouterPanel, views } from "router"

import { type JSX, type Component, createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import SearchDefault from "app/pages/Search/Default/Default"
import ProfileDefault from "app/pages/Profile/Default/Default"
import ChatsDefault from "app/pages/Chats/Default/Default"

import { IconArchiveFilled, IconMessageCircleFilled } from "source"
import { USER_ATOM } from "engine/state"
import { useAtom } from "engine/modules/smart-data"
import { HOST_CDN } from "root/configs"

interface Action extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const getView = (nav: string) =>
  ({
    [panels.CHATS]: views.CHATS,
    [panels.SEARCH]: views.SEARCH,
    [panels.PROFILE]: views.PROFILE,
  }[nav] || "")

const Action: Component<Action> = (props) => {
  const [lang] = loc()

  const activeView = useRouter("view")
  const activePanel = useRouterPanel(() => getView(props.nav))

  const [store, setStore] = createStore({ panel: "" })

  createEffect(() => {
    if (
      [`${panels.CHATS}`, panels.SEARCH, panels.PROFILE].includes(activePanel())
    ) {
      setStore("panel", activePanel())
    }
  })
  const [user] = useAtom(USER_ATOM)

  const handlerChats = () => swipeView({ viewId: views.CHATS })
  const handlerSearch = () => swipeView({ viewId: views.SEARCH })
  const handlerProfile = () => swipeView({ viewId: views.PROFILE })

  return (
    <EAction
      {...props}
      activePanel={store.panel}
      bar={
        <Tabbar>
          <Tabbar.Button
            onClick={handlerChats}
            selected={activeView() === views.CHATS}
          >
            <Gap direction={"column"}>
              <IconArchiveFilled width={28} height={28} />
              <Title>{lang("chats")}</Title>
            </Gap>
          </Tabbar.Button>
          <Tabbar.Button
            onClick={handlerSearch}
            selected={activeView() === views.SEARCH}
          >
            <Gap direction={"column"}>
              <IconMessageCircleFilled width={28} height={28} />
              <Title>{lang("search")}</Title>
            </Gap>
          </Tabbar.Button>
          <Tabbar.Button
            onClick={handlerProfile}
            selected={activeView() === views.PROFILE}
          >
            <Gap direction={"column"}>
              <Avatar
                size={"28px"}
                src={`https://${HOST_CDN}/v1/image/user/${user.image}?size=1000`}
                style={{
                  border:
                    activeView() === views.PROFILE
                      ? "solid 2px var(--section_bg_color)"
                      : "",
                  outline:
                    activeView() === views.PROFILE
                      ? "solid 1px var(--accent_color)"
                      : "",
                  "box-sizing": "border-box",
                }}
              />
              <Title>{lang("settings")}</Title>
            </Gap>
          </Tabbar.Button>
        </Tabbar>
      }
    >
      <Path nav={panels.SEARCH} component={SearchDefault} />
      <Path nav={panels.PROFILE} component={ProfileDefault} />
      <Path nav={panels.CHATS} component={ChatsDefault} />
    </EAction>
  )
}

export default Action
