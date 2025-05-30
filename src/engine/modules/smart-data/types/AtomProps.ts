import { type Key } from "../types"

export interface AtomProps<VALUE, OPTIONS, KEY> {
  readonly default: VALUE | (() => VALUE)
  /**
   * Функция, вызываемая для генерации ключа
   */
  onKey?: (options: OPTIONS) => string | undefined
  /**
   * Функция, вызываемая при запросе новых данных. Используется для запуска процесса получения данных.
   */
  onRequested?: (options: OPTIONS, key: KEY) => void
  /**
   * Функция, вызываемая при изменении сигнала. Используется для запуска отправки данных.
   */
  onUpdate?: (
    value: { prev: VALUE; next: VALUE },
    key: KEY,
  ) => Promise<boolean> | void
  readonly updateIntervalMs?: number
}
