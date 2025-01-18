import { defineStore } from 'pinia'
import type { User } from '@/entities/user/model/user.types'

interface RegisteredUser {
  name: string
  email: string
  phone: string
  birthday: string
  addresses: string[]
  passwordHash: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const showModal = ref(false)
  const authMode = ref<'login' | 'register'>('login')
  const registeredUsers = ref<Record<string, RegisteredUser>>({})

  const isAuthenticated = computed(() => !!user.value)

  function hashPassword(password: string): string {
    return btoa(encodeURIComponent(password))
  }

  function login(email: string, password: string): string | null {
    const stored = registeredUsers.value[email.toLowerCase()]
    if (!stored) return 'Пользователь с таким email не найден'
    if (stored.passwordHash !== hashPassword(password)) return 'Неверный пароль'

    const { passwordHash: _, ...userData } = stored
    user.value = userData
    return null
  }

  function register(name: string, email: string, password: string): string | null {
    const key = email.toLowerCase()
    if (registeredUsers.value[key]) return 'Этот email уже зарегистрирован'

    const newUser: RegisteredUser = {
      name,
      email,
      phone: '',
      birthday: '',
      addresses: [],
      passwordHash: hashPassword(password),
    }
    registeredUsers.value[key] = newUser

    const { passwordHash: _, ...userData } = newUser
    user.value = userData
    return null
  }

  function logout(): void {
    user.value = null
  }

  function openModal(mode: 'login' | 'register' = 'login'): void {
    authMode.value = mode
    showModal.value = true
  }

  function closeModal(): void {
    showModal.value = false
  }

  function requireAuth(): boolean {
    if (isAuthenticated.value) return true
    openModal()
    return false
  }

  return {
    user,
    showModal,
    authMode,
    registeredUsers,
    isAuthenticated,
    login,
    register,
    logout,
    openModal,
    closeModal,
    requireAuth,
  }
}, {
  persist: true,
})
