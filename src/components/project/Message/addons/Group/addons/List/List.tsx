import InfiniteScroll from "@ui/project/InfiniteScroll/InfiniteScroll"
import style from "./List.module.css"
import ContextList from "./context"

import {
  type JSX,
  mergeProps,
  splitProps,
  onMount,
  onCleanup,
  Accessor,
  createEffect,
  on,
  Show,
} from "solid-js"
import { createStore } from "solid-js/store"

interface List<Message extends unknown>
  extends Omit<JSX.HTMLAttributes<HTMLDivElement>, "children"> {
  footer?: JSX.Element
  messages: Message[][]

  onNext: () => Promise<void>
  hasMore?: boolean
  children: (item: Message, index: Accessor<number>) => JSX.Element
}

const List = <Message extends unknown>(props: List<Message>) => {
  const merged = mergeProps({}, props)
  const [local, others] = splitProps(merged, [
    "class",
    "classList",
    "children",
    "messages",
    "onNext",
    "hasMore",
    "footer",
  ])

  const [store, setStore] = createStore({
    height: 0,
    messages: local.messages.slice(0, 1),
    hasMore: true,
  })

  let ref: HTMLDivElement
  onMount(() => {
    if (ref!) {
      const observer = new ResizeObserver((entries) => {
        entries.forEach((entry) => {
          setStore("height", Number(entry.contentRect.height.toFixed(0)))
        })
      })

      observer.observe(ref)

      onCleanup(() => {
        observer.disconnect()
      })
    }
  })

  createEffect(
    on([() => local.messages, () => local.messages.length], ([messages]) => {
      setStore(
        "messages",
        messages.slice(
          messages.length - store.messages.length,
          messages.length,
        ),
      )
    }),
  )

  const onNext = async () => {
    if (local.messages.length > store.messages.length) {
      const newMessages = local.messages.slice(
        local.messages.length - store.messages.length - 1,
        local.messages.length,
      )
      if (newMessages?.[0].length) {
        setStore("messages", newMessages)
        return
      } else {
        setStore("messages", local.messages)
      }
    }
    setStore(
      "hasMore",
      local.messages.length > store.messages.length || !!local.hasMore,
    )
    await local.onNext()
  }

  return (
    <div
      ref={ref!}
      class={style.List}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <InfiniteScroll
        scrollTreshold={window.innerHeight}
        next={onNext}
        hasMore={store.hasMore} // store.messages.length < local.messages.length
        each={store.messages}
        children={local.children}
      />
      <Show
        when={
          store.messages.length &&
          store.messages.some((x) => {
            if (!x || !x.length) return false

            return x.some((item) => item)
          })
        }
      >
        <ContextList.Provider value={{ getHeight: () => store.height }}>
          {local.footer}
        </ContextList.Provider>
      </Show>
    </div>
  )
}

export default List
