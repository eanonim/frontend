import { Action as EAction, Tabbar, Path, Title, Gap, Avatar } from "components"
import loc, { getLocale } from "engine/languages"

import { panels, swipeView, useRouter, useRouterPanel, views } from "router"

import { type JSX, type Component, createEffect } from "solid-js"
import { createStore } from "solid-js/store"

import SearchDefault from "app/pages/Search/Default/Default"
import ProfileDefault from "app/pages/Profile/Default/Default"
import ChatsDefault from "app/pages/Chats/Default/Default"
import RatingDefault from "app/pages/Rating/Default/Default"
import TaskDefault from "app/pages/Task/Default/Default"

import {
  IconArchiveFilled,
  IconDiamondFilled,
  IconMessageCircleFilled,
  IconStack2Filled,
} from "source"
import { RATING_ATOM, TASK_ATOM, USER_ATOM } from "engine/state"
import { getter, useAtom } from "engine/modules/smart-data"
import { HOST_CDN } from "root/configs"
import { Chats } from "engine/class/useChat"
import { ratingGet, taskList } from "engine/api"

interface Action extends JSX.HTMLAttributes<HTMLDivElement> {
  nav: string
}

const getView = (nav: string) =>
  ({
    [panels.CHATS]: views.CHATS,
    [panels.SEARCH]: views.SEARCH,
    [panels.PROFILE]: views.PROFILE,
    [panels.RATING]: views.RATING,
    [panels.TASK]: views.TASK,
  }[nav] || "")

const Action: Component<Action> = (props) => {
  const [lang] = loc()

  const activeView = useRouter("view")
  const activePanel = useRouterPanel(() => getView(props.nav))

  const [store, setStore] = createStore({ panel: "" })

  createEffect(() => {
    if (
      [
        `${panels.CHATS}`,
        panels.SEARCH,
        panels.PROFILE,
        panels.RATING,
        panels.TASK,
      ].includes(activePanel())
    ) {
      setStore("panel", activePanel())
    }
  })
  const [user] = useAtom(USER_ATOM)

  const handlerChats = () => swipeView({ viewId: views.CHATS })
  const handlerSearch = () => swipeView({ viewId: views.SEARCH })
  const handlerProfile = () => swipeView({ viewId: views.PROFILE })
  const handlerRating = () => swipeView({ viewId: views.RATING })
  const handlerTasks = () => swipeView({ viewId: views.TASK })

  const onTouchStartTasks = () => {
    const tasks = getter(TASK_ATOM, "main" + getLocale())
    if (Object.keys(tasks).length === 0) {
      taskList({ group: "main", lang: getLocale() })
    }
  }

  const onTouchStartRating = () => {
    const rating = getter(RATING_ATOM)
    if ((rating.data || []).length === 0) {
      ratingGet({})
    }
  }

  const onTouchStartChats = () => {
    if (
      Object.values(Chats.get()).filter((x) => !!x.isFavorites).length === 0
    ) {
      Chats.loadChats()
    }
  }

  return (
    <EAction
      {...props}
      activePanel={store.panel}
      bar={
        <Tabbar>
          <Tabbar.Button
            onTouchStart={onTouchStartRating}
            onClick={handlerRating}
            selected={activeView() === views.RATING}
          >
            <Gap direction={"column"}>
              <IconDiamondFilled width={28} height={28} />
              <Title>{lang("rating")}</Title>
            </Gap>
          </Tabbar.Button>
          <Tabbar.Button
            onTouchStart={onTouchStartChats}
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
            onTouchStart={onTouchStartTasks}
            onClick={handlerTasks}
            selected={activeView() === views.TASK}
          >
            <Gap direction={"column"}>
              <IconStack2Filled width={28} height={28} />
              <Title>{lang("tasks")}</Title>
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
      <Path nav={panels.RATING} component={RatingDefault} />
      <Path nav={panels.SEARCH} component={SearchDefault} />
      <Path nav={panels.TASK} component={TaskDefault} />
      <Path nav={panels.PROFILE} component={ProfileDefault} />
      <Path nav={panels.CHATS} component={ChatsDefault} />
    </EAction>
  )
}

export default Action
