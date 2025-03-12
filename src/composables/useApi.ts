import { ref } from 'vue'

interface UseApiOptions<T> {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: HeadersInit
  body?: any
}

export function useApi<T>({ url, method = 'GET', headers = {}, body }: UseApiOptions<T>) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)
  const isSuccess = ref(false)

  const execute = async () => {
    isLoading.value = true
    error.value = null
    isSuccess.value = false

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })

      if (!response.ok) {
        throw new Error(`Http error! Status: ${response.status}`)
      }

      data.value = await response.json()
      isSuccess.value = true
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      isLoading.value = false
    }
  }

  return { data, error, isLoading, isSuccess, execute }
}
