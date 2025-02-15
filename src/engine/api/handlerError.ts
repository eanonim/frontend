import { popouts, pushPopout } from "router"

const handlerError = ({ code, message }: { code: number; message: string }) => {
  pushPopout({
    popoutId: popouts.ERROR,
    params: {
      error_code: code,
      label: message,
    },
  })
}
export default handlerError
