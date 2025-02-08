export interface AtomProps<VALUE, OPTIONS> {
  readonly default: VALUE
  /**
   * Функция, вызываемая при запросе новых данных. Используется для запуска процесса получения данных.
   */
  onRequested?: (options: OPTIONS, key: string | number) => void
  /**
   * Функция, вызываемая при изменении сигнала. Используется для запуска отправки данных.
   */
  onUpdate?: (value: { prev: VALUE; next: VALUE }, key: string | number) => void
  readonly updateIntervalMs?: number
}
