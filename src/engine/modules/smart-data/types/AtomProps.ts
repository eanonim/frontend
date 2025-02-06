export interface AtomProps<T, OPTIONS> {
  readonly default: T
  onRequested?: (options: OPTIONS, key: string | number) => void
  readonly updateIntervalMs?: number
}
