<script setup>
import { RouterView } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>

<template>
  <div class="pv-shell">
    <AppHeader />
    <main class="pv-container">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>
