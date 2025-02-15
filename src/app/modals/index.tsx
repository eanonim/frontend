import { ModalRoot, Path } from "components"

import { type Component, type JSX } from "solid-js"

import { modals, useRouter } from "router"

import InterestsList from "./interests/List/List"

interface Modal extends JSX.HTMLAttributes<HTMLDivElement> {}

const Modal: Component<Modal> = (props) => {
  const activeModal = useRouter("modal")

  return (
    <ModalRoot activeModal={activeModal()}>
      <Path nav={modals.INTERESTS_LIST} component={InterestsList} />
    </ModalRoot>
  )
}

export default Modal
