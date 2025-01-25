export type SmartData<T> = {
  data: T

  update_at: Date
  req_id: string
  system?: {
    isError: boolean
    isLoad: boolean
    isFullLoad: boolean
  }
}
