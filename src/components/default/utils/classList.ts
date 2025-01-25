const classList = (
  props: {
    [k: string]: boolean | undefined
  },
  local: {
    class?: string
    classList?: {
      [k: string]: boolean | undefined
    }
  },
) => {
  return { [`${local.class}`]: !!local.class, ...props, ...local.classList }
}

export default classList
