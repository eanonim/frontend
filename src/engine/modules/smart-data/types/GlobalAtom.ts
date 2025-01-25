import { Setter } from "solid-js"

enum SP {
  ERROR = "",
}

export type Supported<T> = T & { supported_only_smart_data: SP.ERROR }

export type GlobalAtom<T, OPTIONS> = [
  string,
  Supported<T>,
  () => Supported<T>,
  (v: Supported<T>) => void,
  (handle: (v: Supported<T>) => void) => void,
  (handle: Setter<Supported<T>>) => void,
]
