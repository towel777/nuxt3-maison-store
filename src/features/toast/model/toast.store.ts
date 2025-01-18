import { defineStore } from 'pinia'

interface Toast {
  id: number
  text: string
  type: 'success' | 'error'
}

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<Toast[]>([])

  function show(text: string, type: 'success' | 'error' = 'success'): void {
    const id = Date.now()
    toasts.value.push({ id, text, type })

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 3500)
  }

  function success(text: string): void {
    show(text, 'success')
  }

  function error(text: string): void {
    show(text, 'error')
  }

  return { toasts, show, success, error }
})
