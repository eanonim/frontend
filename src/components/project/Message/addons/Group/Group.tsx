import style from "./Group.module.css"
import MessageSystem from "../System/System"
import { List } from "./addons"

import ContextGroup from "./context"
import { leadingAndTrailing, throttle } from "@solid-primitives/scheduled"

import {
  type JSX,
  mergeProps,
  splitProps,
  batch,
  For,
  Accessor,
  createEffect,
  on,
  createUniqueId,
  createSignal,
  onMount,
  Show,
} from "solid-js"
import { createStore, produce } from "solid-js/store"
import { timeAgoOnlyDate } from "engine"
import { sleep } from "@minsize/utils"

interface Group<Message extends unknown>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  dialogs: [string, Message[][]][]
  onNext: () => Promise<boolean>
  hasMore?: boolean

  children: (item: Message, index: Accessor<number>) => JSX.Element
}

type Store<Message extends unknown> = {
  scrollTop: number
  dialogs: [string, Message[][]][]
  safeScrollTop: number
  isLoading: boolean
}

type ScrollTops = Record<
  number,
  {
    height: number
    scrollTop: number
  }
>

const Group = <Message extends unknown>(props: Group<Message>) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "dialogs",
    "onNext",
    "hasMore",
  ])

  let ref: HTMLDivElement

  const [scrollTops, setScrollTops] = createStore<ScrollTops>({})

  const [store, setStore] = createStore<Store<Message>>({
    scrollTop: 0,
    dialogs: local.dialogs.slice(0, 1),
    safeScrollTop: 0,
    isLoading: false,
  })

  const setVisible = (key: number, height: number) => {
    if (scrollTops[key]?.height === height) return

    setScrollTops(
      produce((store) => {
        store[key] = { height: height, scrollTop: store[key]?.scrollTop || 0 }

        return store
      }),
    )

    const scrolls = Object.entries(scrollTops) as unknown as [
      number,
      {
        height: number
        scrollTop: number
      },
    ][]

    batch(() => {
      for (const [key] of scrolls) {
        const heightKey = scrolls.reduce(
          (acb, value) => (value[0] <= key ? acb + value[1].height : acb),
          0,
        )

        setScrollTops(key, "scrollTop", heightKey)
      }
    })
  }

  const getIsVisible = (key: number) => {
    if (!scrollTops[key]) return true
    return store.scrollTop >= scrollTops[key]?.scrollTop
  }

  const trigger = leadingAndTrailing(
    throttle,
    (scrollTop: number) => setStore("scrollTop", Math.abs(scrollTop)),
    250,
  )

  createEffect(
    on(
      () => local.dialogs,
      (dialogs) => {
        setStore("dialogs", dialogs.slice(0, store.dialogs.length || 1))
      },
    ),
  )

  const onNext = async () => {
    setStore("isLoading", true)
    try {
      if (local.dialogs.length > store.dialogs.length) {
        setStore("dialogs", local.dialogs.slice(0, store.dialogs.length + 1))
        return
      }
      await local.onNext()
    } finally {
      requestAnimationFrame(() => {
        setStore("isLoading", false)
      })
    }
  }

  let lastScroll = 0

  return (
    <div
      ref={ref!}
      class={style.Group}
      classList={{
        // _visibleScroll: true,
        // [style[`Group--hidden`]]: store.isLoading,

        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      onScroll={(e) => {
        // if (!store.isLoading) {
        if (e.target.scrollTop < lastScroll - e.target.clientHeight) {
          e.target.scrollTop = lastScroll
        }
        const scrollY = e.target.scrollTop - e.target.clientHeight
        // e.target.scrollHeight - e.target.scrollTop
        trigger(scrollY)

        lastScroll = e.target.scrollTop
        // } else {
        //   e.target.scrollTop = lastScroll
        // }
      }}
      {...others}
    >
      <div class={style.Group__in}>
        <ContextGroup.Provider
          value={{
            getScrollTop: () => store.scrollTop,
            setVisible,
            getIsVisible,
          }}
        >
          <For
            each={store.dialogs}
            fallback={<span style={{ height: "200vh", display: "block" }} />}
          >
            {([time, messages], index) => (
              <List
                data-index={index()}
                onNext={onNext}
                // hasMore={store.dialogs.length < local.dialogs.length}
                hasMore={
                  index() === local.dialogs.length - 1 ? local.hasMore : false
                }
                messages={messages}
                footer={
                  <MessageSystem key={index()}>
                    {timeAgoOnlyDate(new Date(time)?.getTime())}
                  </MessageSystem>
                }
                children={local.children}
              />
            )}
          </For>
        </ContextGroup.Provider>
      </div>
    </div>
  )
}

Group.List = List

export default Group
