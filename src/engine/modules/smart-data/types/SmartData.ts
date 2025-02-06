export type SmartData<T> = {
  data: T

  update_at: Date
  req_id: string
  system?: {
    error: boolean
    load: boolean
    fullLoad: boolean
  }
}
