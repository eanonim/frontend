import { type Key } from "../types"

export interface AtomProps<VALUE, OPTIONS, KEY> {
  readonly default: VALUE
  /**
   * Функция, вызываемая для генерации ключа
   */
  onKey?: (options: OPTIONS) => string
  /**
   * Функция, вызываемая при запросе новых данных. Используется для запуска процесса получения данных.
   */
  onRequested?: (options: OPTIONS, key: Key) => void
  /**
   * Функция, вызываемая при изменении сигнала. Используется для запуска отправки данных.
   */
  onUpdate?: (value: { prev: VALUE; next: VALUE }, key: Key) => void
  readonly updateIntervalMs?: number
}
