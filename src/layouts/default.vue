<script setup lang="ts">
import AppHeader from '@/widgets/app-header/ui/AppHeader.vue'
import CartDrawer from '@/widgets/cart-drawer/ui/CartDrawer.vue'
import AuthModal from '@/features/auth/ui/AuthModal.vue'
import ToastContainer from '@/features/toast/ui/ToastContainer.vue'
</script>

<template>
  <div>
    <AppHeader />

    <main>
      <slot />
    </main>

    <CartDrawer />
    <AuthModal />
    <ToastContainer />
  </div>
</template>
