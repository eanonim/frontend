import style from "./AccordionList.module.css"
import { AccordionStoreList } from "../../context"

import { type JSX, type Component, splitProps } from "solid-js"
import { createStore, produce } from "solid-js/store"

interface AccordionList
  extends Omit<JSX.HTMLAttributes<HTMLElement>, "onChange"> {
  /**
   * Обработчик изменения состояния элемента Accordion в списке.
   *
   * Вызывается при изменении состояния любого элемента Accordion в списке.
   *
   * @param uId - Уникальный идентификатор элемента Accordion, состояние которого изменилось.
   * @param status - Текущее состояние элемента Accordion (true - раскрыт, false - свернут).
   */
  onChange?: (uId: string, status: boolean) => void
}

type Store = {
  lastUId: string
  list: Record<string, boolean>
}

const AccordionList: Component<AccordionList> = (props) => {
  const [local, others] = splitProps(props, [
    "class",
    "classList",
    "children",
    "onChange",
  ])

  const [store, setStore] = createStore<Store>({
    lastUId: "",
    list: {},
  })

  const handlerChange = (uId: string, status: boolean) => {
    local.onChange && local.onChange(uId, status)
  }

  const onChange = (uId: string) => {
    const list = { ...store.list }
    const status = !list[uId]

    // Object.keys(list).forEach((key) => {
    //   if (list[key]) {
    //     handlerChange(key, false)
    //   }
    //   list[key] = false
    // })

    if (store.lastUId !== uId) {
      list[store.lastUId] = false
      handlerChange(store.lastUId, false)
    }

    list[uId] = status
    handlerChange(uId, status)

    setStore(
      produce((store) => {
        store.list = list
        store.lastUId = uId
        return store
      }),
    )

    return status
  }

  const value = {
    status: (uId: string) => store.list[uId],
    onChange: onChange,
  }

  return (
    <section
      class={style.AccordionList}
      classList={{
        [`${local.class}`]: !!local.class,
        ...local.classList,
      }}
      {...others}
    >
      <AccordionStoreList.Provider value={value}>
        {local.children}
      </AccordionStoreList.Provider>
    </section>
  )
}

export default AccordionList
