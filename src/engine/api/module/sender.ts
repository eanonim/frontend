import { HOST } from "root/configs"

export type RequestError = {
  code: number
  critical?: boolean
  message: string
  fetch_status?: number
}

type Request<T> =
  | { response: T; error: undefined }
  | { response: undefined; error: RequestError }

type Fetch<G> = {
  name: string
  method: "POST" | "GET"
  body?: G
  headers?: HeadersInit
}

export const defaultError = (fetch_status?: number) => ({
  response: undefined,
  error: {
    code: -1,
    fetch_status,
    critical: true,
    message: "fetch error",
  },
})

export const _fetch = async <T, G>({
  name,
  method,
  body,
  headers,
}: Fetch<G>): Promise<Request<T>> => {
  try {
    const url = new URL(`https://${HOST}` + name) // rt.elum.app

    if (method === "GET" && body) {
      for (const [key, value] of Object.entries(body)) {
        url.searchParams.append(key, String(value))
      }
    }

    const response = await fetch(url, {
      method,
      body: method === "POST" ? JSON.stringify(body || {}) : undefined,
      headers,
    })

    if (response.status !== 200) {
      return defaultError(response.status)
    }

    return await response.json()
  } catch {}

  return defaultError()
}
