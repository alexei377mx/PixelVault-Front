<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="pv-404">
    <span class="pv-eyebrow">ERROR 404</span>
    <h1>GAME OVER</h1>
    <p>No encontramos esta pantalla. Vuelve al catálogo para seguir navegando.</p>
    <RouterLink to="/" class="pixel-btn">Volver al inicio</RouterLink>
  </div>
</template>

<style scoped>
.pv-404 {
  text-align: center;
  padding: 4rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.pv-404 h1 {
  font-size: 1.8rem;
  color: var(--pv-accent);
}

.pv-404 p {
  color: var(--pv-text-dim);
  max-width: 360px;
}
</style>
