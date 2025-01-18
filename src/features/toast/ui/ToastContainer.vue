<script setup lang="ts">
import { useToastStore } from '@/features/toast/model/toast.store'

const toastStore = useToastStore()
</script>

<template>
  <Teleport to="body">
    <div class="toast-wrap">
      <TransitionGroup name="toast">
        <div
          v-for="t in toastStore.toasts"
          :key="t.id"
          class="toast"
          :class="`toast--${t.type}`"
        >
          {{ t.type === 'success' ? '✓' : '⚠' }} {{ t.text }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.toast-wrap {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 500;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toast {
  padding: 14px 20px;
  border-radius: 10px;
  background: var(--bg-dark);
  color: var(--text-inv);
  font-size: 0.88rem;
  font-weight: 500;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  gap: 10px;

  &--success { border-left: 3px solid var(--success); }
  &--error { border-left: 3px solid var(--danger); }
}

.toast-enter-active { animation: fadeUp 0.35s var(--ease); }
.toast-leave-active { animation: fadeUp 0.25s var(--ease) reverse; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
