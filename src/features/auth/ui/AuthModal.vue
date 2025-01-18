<script setup lang="ts">
import { useAuthStore } from '@/features/auth/model/auth.store'
import { useToastStore } from '@/features/toast/model/toast.store'

const auth = useAuthStore()
const toast = useToastStore()

const form = reactive({ name: '', email: '', password: '' })
const errors = reactive<Record<string, string>>({ name: '', email: '', password: '' })
const showPassword = ref(false)

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function clearErrors() {
  errors.name = ''
  errors.email = ''
  errors.password = ''
}

function switchMode(mode: 'login' | 'register') {
  auth.authMode = mode
  clearErrors()
  Object.assign(form, { name: '', email: '', password: '' })
}

function validate(): boolean {
  clearErrors()
  let valid = true

  if (auth.authMode === 'register' && !form.name.trim()) {
    errors.name = 'Введите имя'
    valid = false
  }
  if (!form.email.trim()) {
    errors.email = 'Введите email'
    valid = false
  } else if (!EMAIL_REGEX.test(form.email)) {
    errors.email = 'Неверный формат email'
    valid = false
  }
  if (!form.password) {
    errors.password = 'Введите пароль'
    valid = false
  } else if (form.password.length < 6) {
    errors.password = 'Пароль должен содержать не менее 6 символов'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  if (auth.authMode === 'login') {
    const error = auth.login(form.email, form.password)
    if (error) { errors.password = error; return }
  } else {
    const error = auth.register(form.name, form.email, form.password)
    if (error) { errors.email = error; return }
  }

  auth.closeModal()
  Object.assign(form, { name: '', email: '', password: '' })
  clearErrors()
  toast.success(`Добро пожаловать, ${auth.user!.name}!`)
}
</script>

<template>
  <Teleport to="body">
    <div class="modal-overlay" :class="{ open: auth.showModal }" @click.self="auth.closeModal()">
      <div class="modal">
        <div class="modal__title">{{ auth.authMode === 'login' ? 'Вход' : 'Регистрация' }}</div>
        <div class="modal__sub">
          {{ auth.authMode === 'login' ? 'Войдите в свой аккаунт' : 'Создайте аккаунт для покупок' }}
        </div>

        <div class="modal__form">
          <div v-if="auth.authMode === 'register'" class="form-group">
            <label class="form-label">Имя</label>
            <input class="form-input" :class="{ 'form-input--error': errors.name }" v-model="form.name" placeholder="Иван Иванов">
            <span v-if="errors.name" class="field-error">{{ errors.name }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Email</label>
            <input class="form-input" :class="{ 'form-input--error': errors.email }" v-model="form.email" type="email" placeholder="ivan@example.com">
            <span v-if="errors.email" class="field-error">{{ errors.email }}</span>
          </div>
          <div class="form-group">
            <label class="form-label">Пароль</label>
            <div class="password-wrapper">
              <input
                class="form-input"
                :class="{ 'form-input--error': errors.password }"
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                @keyup.enter="handleSubmit"
              >
              <button type="button" class="password-toggle" @click="showPassword = !showPassword" tabindex="-1">
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
            <span v-if="errors.password" class="field-error">{{ errors.password }}</span>
          </div>
          <button class="btn btn--primary" style="margin-top: 8px" @click="handleSubmit">
            {{ auth.authMode === 'login' ? 'Войти' : 'Зарегистрироваться' }}
          </button>
        </div>

        <div class="modal__switch">
          <template v-if="auth.authMode === 'login'">
            Нет аккаунта? <a @click="switchMode('register')">Зарегистрируйтесь</a>
          </template>
          <template v-else>
            Уже есть аккаунт? <a @click="switchMode('login')">Войдите</a>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 300;
  display: flex; align-items: center; justify-content: center;
  padding: 24px;
  opacity: 0; pointer-events: none;
  transition: opacity 0.25s;
  &.open { opacity: 1; pointer-events: auto; }
}

.modal {
  background: var(--bg);
  border-radius: 16px;
  width: min(420px, 100%);
  padding: 36px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.15);
  transform: scale(0.95);
  transition: transform 0.3s var(--ease);

  .modal-overlay.open & { transform: scale(1); }

  &__title { font-family: var(--serif); font-size: 1.6rem; font-weight: 500; text-align: center; margin-bottom: 6px; }
  &__sub { font-size: 0.88rem; color: var(--text-m); text-align: center; margin-bottom: 28px; }
  &__form { display: flex; flex-direction: column; gap: 12px; }
  &__switch {
    text-align: center; font-size: 0.85rem; color: var(--text-m); margin-top: 20px;
    a { color: var(--accent); font-weight: 500; cursor: pointer; &:hover { text-decoration: underline; } }
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-input--error {
  border-color: #e53e3e !important;
  &:focus { box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.15) !important; }
}

.field-error {
  font-size: 0.78rem;
  color: #e53e3e;
  line-height: 1.3;
}

.password-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .form-input {
    width: 100%;
    padding-right: 42px;
  }
}

.password-toggle {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-m);
  display: flex;
  align-items: center;
  padding: 0;

  &:hover { color: var(--text); }
}
</style>
