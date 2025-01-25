export interface Atom<T, OPTIONS> {
  readonly key: string
  readonly default?: T
  onRequested?: (
    onFinish: () => void,
    key: string | number,
    options: OPTIONS,
  ) => void
  readonly update_via?: number
}
