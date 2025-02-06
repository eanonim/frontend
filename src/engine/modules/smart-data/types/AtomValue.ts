import { type SmartData } from "./SmartData"

export type AtomValue<VALUE extends unknown, OPTIONS> = {
  /**
   * Значение по умолчанию для данных в хранилище.
   */
  default: VALUE
  /**
   * Интервал в миллисекундах, с которым данные считаются актуальными (по умолчанию: 5000 мс).  После этого интервала данные будут запрошены повторно.
   */
  updateIntervalMs: number
  /**
   * Функция, вызываемая при запросе новых данных. Используется для запуска процесса получения данных.
   */
  onRequested?: (options: OPTIONS, key: string | number) => void
  /**
   * Кеш для хранения полученных данных.
   */
  cache: { [key in string]: SmartData<VALUE> }
  /**
   * Объект, отслеживающий статус текущих запросов данных.
   * Значение `true` означает, что запрос в процессе обработки.
   *
   * `start` - Идёт запрос
   * `end` - Запрос обработан
   */
  requests: { [key in string]: "start" | "end" }
}
