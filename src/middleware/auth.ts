import { useAuthStore } from '@/features/auth/model/auth.store'

export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated) {
    authStore.openModal()
    return navigateTo('/')
  }
})
