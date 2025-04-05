import { ModalRoot, Path } from "components"

import { type Component, type JSX } from "solid-js"

import { modals, useRouter } from "router"

import InterestsList from "./interests/List/List"
import MessageControl from "./message/control/Control"
import MessageComplaint from "./message/Complaint/Complaint"
import MessageLeave from "./message/Leave/Leave"

import UserEmoji from "./user/Emoji/Emoji"
import UserChangeName from "./user/ChangeName/ChangeName"
import UserPremium from "./user/Premium/Premium"

import TaskInfo from "./task/Info/Info"

interface Modal extends JSX.HTMLAttributes<HTMLDivElement> {}

const Modal: Component<Modal> = (props) => {
  const activeModal = useRouter("modal")

  return (
    <ModalRoot activeModal={activeModal()}>
      <Path nav={modals.INTERESTS_LIST} component={InterestsList} />
      <Path nav={modals.MESSAGE_CONTROL} component={MessageControl} />
      <Path nav={modals.MESSAGE_COMPLAINT} component={MessageComplaint} />
      <Path nav={modals.MODAL_LEAVE} component={MessageLeave} />

      <Path nav={modals.USER_EMOJI} component={UserEmoji} />
      <Path nav={modals.USER_CHANGE_NAME} component={UserChangeName} />
      <Path nav={modals.MODAL_PREMIUM} component={UserPremium} />

      <Path nav={modals.MODAL_TASK} component={TaskInfo} />
    </ModalRoot>
  )
}

export default Modal
