<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/stores/auth'
import AlertMessage from '@/components/AlertMessage.vue'

const router = useRouter()
const route = useRoute()
const { loginUser } = useAuth()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    await loginUser({ ...form })
    router.push(route.query.redirect || { name: 'games' })
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pv-container pv-container--narrow">
    <span class="pv-eyebrow">PLAYER LOGIN</span>
    <h1>Iniciar sesión</h1>
    <p class="pv-sub">Accede para guardar tus juegos favoritos.</p>

    <AlertMessage :message="errorMessage" />

    <form class="pixel-card pv-form" @submit.prevent="handleSubmit">
      <div class="pv-field">
        <label class="pixel-label" for="email">Correo</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          class="pixel-input"
          required
          placeholder="tu@correo.com"
        />
      </div>

      <div class="pv-field">
        <label class="pixel-label" for="password">Contraseña</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          class="pixel-input"
          required
          placeholder="••••••••"
        />
      </div>

      <button type="submit" class="pixel-btn" :disabled="loading">
        {{ loading ? 'Entrando...' : 'Entrar' }}
      </button>
    </form>

    <p class="pv-switch">¿No tienes cuenta? <RouterLink to="/register">Regístrate</RouterLink></p>
  </div>
</template>

<style scoped>
.pv-sub {
  color: var(--pv-text-dim);
  font-size: 0.85rem;
  margin-bottom: 1.5rem;
}

.pv-form {
  padding: 1.5rem;
}

.pv-switch {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: var(--pv-text-dim);
}
</style>
