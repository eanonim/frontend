import { ModalRoot, Path } from "components"

import { type Component, type JSX } from "solid-js"

import { modals, useRouter } from "router"

import InterestsList from "./interests/List/List"
import MessageControl from "./message/control/Control"

interface Modal extends JSX.HTMLAttributes<HTMLDivElement> {}

const Modal: Component<Modal> = (props) => {
  const activeModal = useRouter("modal")

  return (
    <ModalRoot activeModal={activeModal()}>
      <Path nav={modals.INTERESTS_LIST} component={InterestsList} />
      <Path nav={modals.MESSAGE_CONTROL} component={MessageControl} />
    </ModalRoot>
  )
}

export default Modal
