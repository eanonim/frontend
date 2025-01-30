import style from "./InfiniteScroll.module.css"

import {
  type Accessor,
  type JSX,
  createEffect,
  createSignal,
  For,
  Match,
  mergeProps,
  onCleanup,
  onMount,
  Show,
  Switch,
  untrack,
} from "solid-js"
import { createVisibilityObserver } from "@solid-primitives/intersection-observer"

import { Plug, Spinner } from "components"

import ScrollOverflowItem from "./ScrollOverflowItem"
import { createStore } from "solid-js/store"

type InfiniteScroll<T, U> = {
  each: () => T[][] | undefined
  children: (item: T, index: Accessor<number>) => U
  next: () => Promise<unknown>
  hasMore: boolean
  loadingMessage?: JSX.Element
  endMessage?: JSX.Element
  scrollTreshold?: number
}

function InfiniteScroll<T, U extends JSX.Element>(props: InfiniteScroll<T, U>) {
  let contentRef: HTMLDivElement
  let observerRef: HTMLDivElement

  const merged = mergeProps({ scrollTreshold: 300 }, props)

  const [store, setStore] = createStore({
    when: true,
  })

  onMount(() => {
    setStore("when", true)
  })

  onCleanup(() => {
    setStore("when", false)
  })

  const [loading, setLoading] = createSignal(false)
  const [lazyEach, setLazyEach] = createSignal<T[][]>([])

  const useVisibilityObserver = createVisibilityObserver({
    initialValue: true,
    root: contentRef!,
  })
  const visibleObserver = useVisibilityObserver(() => observerRef!)
  const visibleContent = useVisibilityObserver(() => contentRef!)

  const setEach = (): boolean => {
    const each = (props.each() || [])[untrack(lazyEach).length]
    if (each && each.length > 0) {
      setLazyEach((value) => [...value, ...[each]])
      return true
    }
    return false
  }

  const handleNext = async () => {
    const _lazyEach = untrack(lazyEach)
    if ((props.each() || []).length > _lazyEach.length) {
      if (setEach()) {
        // return
      }
    }
    if (props.hasMore && store.when) {
      setLoading(true)
      await props.next()
      setLoading(false)

      const _loading = untrack(loading)
      if (untrack(visibleObserver) && untrack(visibleContent) && !_loading) {
        handleNext()
      }
    }
  }

  /**
   * Если происходит изменение props.each но он не находитсья в состоянии загрузки, то менять в each
   */
  createEffect(() => {
    const _loading = untrack(loading)
    const _lazyEach = untrack(lazyEach)
    const _each = props.each() || []
    if (_lazyEach.length >= 1) {
      if (_each.length <= 0) {
        setLazyEach(_each)
      }

      if (!_loading) {
        setLazyEach(_each.slice(0, _lazyEach.length))
      }
    }
  })

  createEffect(() => {
    const _loading = untrack(loading)
    if (visibleObserver() && visibleContent() && !_loading) {
      handleNext()
    } else if (
      visibleObserver() &&
      (props.each() || [])?.length === 0 &&
      !_loading
    ) {
      handleNext()
    }
  })

  createEffect(() => {
    if (!props.hasMore) {
      setLoading(false)
    }
  })

  createEffect(setEach)

  return (
    <div>
      <div class={style.InfiniteScroll__in} ref={contentRef!}>
        <For each={lazyEach()}>
          {(content, rootIndex) => (
            <ScrollOverflowItem
              contentRef={contentRef!}
              data-index={rootIndex()}
              lastClassList={{
                ["_firstChild"]: rootIndex() === 0,
                ["_lastChild"]: rootIndex() === (lazyEach() || []).length - 1,
              }}
              notLast={rootIndex() < (lazyEach() || []).length - 1}
            >
              <For each={content}>
                {(item, index) =>
                  props.children(
                    item,
                    () => index() + (lazyEach()[0]?.length || 0) * rootIndex(),
                  )
                }
              </For>
            </ScrollOverflowItem>
          )}
        </For>
      </div>
      <div
        ref={observerRef!}
        class={style.InfiniteScroll__observe}
        style={{
          position: "absolute",
          width: "100%",
          height: Math.abs(merged.scrollTreshold) + "px",
          "margin-top": "-" + Math.abs(merged.scrollTreshold) + "px",
        }}
      />
      <Show when={loading()}>
        <Switch
          fallback={
            <Plug>
              <Spinner color={"secondary"} />
            </Plug>
          }
        >
          <Match when={!!props.loadingMessage}>
            <div>{props.loadingMessage}</div>
          </Match>
        </Switch>
      </Show>
      <Show when={!props.hasMore} children={props.endMessage} />
    </div>
  )
}

export default InfiniteScroll
