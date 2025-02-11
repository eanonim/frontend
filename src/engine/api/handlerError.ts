import { popouts, pushPopout } from "router"

const handlerError = ({
  error_code,
  message,
}: {
  error_code: number
  message: string
}) => {
  pushPopout({
    popoutId: popouts.ERROR,
    params: {
      error_code,
      label: message,
    },
  })
}
export default handlerError
