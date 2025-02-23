import { Component, Show, createEffect, splitProps } from "solid-js"
import { JSX } from "solid-js/jsx-runtime"
import { createStore } from "solid-js/store"

import style from "./ScrollOverflowItem.module.css"
import { createVisibilityObserver } from "@solid-primitives/intersection-observer"

interface ScrollOverflowItem extends JSX.HTMLAttributes<HTMLDivElement> {
  children: JSX.Element
  lastClassList: JSX.CustomAttributes<HTMLDivElement>["classList"]
  notLast: boolean
  contentRef: HTMLDivElement
}

const ScrollOverflowItem: Component<ScrollOverflowItem> = (props) => {
  let ref: HTMLDivElement
  let refTop: HTMLDivElement
  let refBottom: HTMLDivElement

  const [local, others] = splitProps(props, [
    "children",
    "lastClassList",
    "notLast",
    "contentRef",
  ])

  const [store, setStore] = createStore({
    height: (ref! && ref.offsetHeight) ?? 0,
    when: true,
    top_when: false,
    bottom_when: false,
    center_when: false,
  })

  const handleWhen = ({
    top_when = store.top_when,
    bottom_when = store.bottom_when,
    center_when = store.center_when,
  }) => {
    setStore({ ...store, top_when, center_when, bottom_when })
    setStore("when", top_when || bottom_when || center_when)
  }

  const useVisibilityObserver = createVisibilityObserver({
    initialValue: true,
  })
  // const visibleCenter = useVisibilityObserver(() => ref)
  // const visibleTop = useVisibilityObserver(() => refTop)
  const visibleBottom = useVisibilityObserver(() => refBottom!)

  createEffect(() => {
    if (store.when) {
      setStore("height", ref!?.offsetHeight ?? 0)
    }
    handleWhen({
      // center_when: visibleCenter(),
      bottom_when: visibleBottom(),
      // top_when: visibleTop(),
    })
  })

  // createEffect(() => {
  //   if (store.when) {
  //     setStore("height", ref.offsetHeight ?? 0)
  //   }
  // })

  // onMount(() => {
  //   const observer = new IntersectionObserver(
  //     (entrys) => {
  //       console.log({ entrys })
  //       let status = false
  //       for (const entry of entrys) {
  //         if (entry.isIntersecting) status = true
  //       }
  //       //  console.log({
  //       //   status:
  //       //     !!entry[0]?.isIntersecting ||
  //       //     !!entry[1]?.isIntersecting ||
  //       //     !!entry[2]?.isIntersecting,
  //       // })
  //       // setStore(
  //       //   "when",
  //       //   !!entry[0]?.isIntersecting ||
  //       //     !!entry[1]?.isIntersecting ||
  //       //     !!entry[2]?.isIntersecting,
  //       // )
  //       // handleWhen({ center_when: entry[0].isIntersecting })
  //       setStore("when", status)
  //     },
  //     { threshold: 0 },
  //   )

  //   observer.observe(ref)
  //   observer.observe(refTop)
  //   observer.observe(refBottom)

  //   onCleanup(() => {
  //     observer.disconnect()
  //   })
  //   return () => {
  //     observer.disconnect()
  //   }
  //   // const observerCenter = new IntersectionObserver(
  //   //   ([entry]) => {
  //   //     handleWhen({ center_when: entry.isIntersecting })
  //   //   },
  //   //   { threshold: 0 },
  //   // )

  //   // const observerTop = new IntersectionObserver(
  //   //   ([entry]) => {
  //   //     handleWhen({ top_when: entry.isIntersecting })
  //   //   },
  //   //   { threshold: 0 },
  //   // )

  //   // const observerBottom = new IntersectionObserver(
  //   //   ([entry]) => {
  //   //     handleWhen({ bottom_when: entry.isIntersecting })
  //   //   },
  //   //   { threshold: 0 },
  //   // )

  //   // observerTop.observe(refTop)
  //   // observerCenter.observe(ref)
  //   // observerBottom.observe(refBottom)

  //   // onCleanup(() => {
  //   //   observerTop.unobserve(refTop)
  //   //   observerCenter.unobserve(ref)
  //   //   observerBottom.unobserve(refBottom)
  //   // })

  //   // return () => {
  //   //   observerTop.unobserve(refTop)
  //   //   observerCenter.unobserve(ref)
  //   //   observerBottom.unobserve(refBottom)
  //   // }
  // })

  return (
    <div
      class={style.ScrollOverflowItem}
      style={{
        height: !store.when
          ? store.height > 0
            ? store.height + "px"
            : ""
          : "",
      }}
      classList={{
        [`${others.class}`]: !!others.class,
        ...others.classList,
      }}
      {...others}
    >
      {/* <div ref={refTop!} class={style.ScrollOverflowItem__top} /> */}
      <div
        class={style.ScrollOverflowItem__root}
        classList={local.lastClassList}
        ref={ref!}
        // style={{
        //   display: "flex",
        //   "flex-direction": "column-reverse",
        // }}
      >
        <Show when={store.when}>{local.children}</Show>
        <Show when={local.notLast}>
          <span />
        </Show>
      </div>
      <div ref={refBottom!} class={style.ScrollOverflowItem__bottom} />
    </div>
  )
}

export default ScrollOverflowItem
