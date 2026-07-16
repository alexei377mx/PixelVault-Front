<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/stores/auth'
import AlertMessage from '@/components/AlertMessage.vue'

const router = useRouter()
const { registerUser } = useAuth()

const form = reactive({ name: '', email: '', password: '', password_confirmation: '' })
const loading = ref(false)
const errorMessage = ref('')
const errorList = ref([])

async function handleSubmit() {
  loading.value = true
  errorMessage.value = ''
  errorList.value = []
  try {
    await registerUser({ ...form })
    router.push({ name: 'games' })
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo completar el registro.'
    errorList.value = err.errors || []
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pv-container pv-container--narrow">
    <span class="pv-eyebrow">NEW PLAYER</span>
    <h1>Crear cuenta</h1>
    <p class="pv-sub">Regístrate para guardar tu catálogo de favoritos.</p>

    <AlertMessage :message="errorMessage" :errors="errorList" />

    <form class="pixel-card pv-form" @submit.prevent="handleSubmit">
      <div class="pv-field">
        <label class="pixel-label" for="name">Nombre</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          class="pixel-input"
          required
          placeholder="Juan Pérez"
        />
      </div>

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
          minlength="6"
          placeholder="mínimo 6 caracteres"
        />
      </div>

      <div class="pv-field">
        <label class="pixel-label" for="password_confirmation">Confirmar contraseña</label>
        <input
          id="password_confirmation"
          v-model="form.password_confirmation"
          type="password"
          class="pixel-input"
          required
          placeholder="repite tu contraseña"
        />
      </div>

      <button type="submit" class="pixel-btn" :disabled="loading">
        {{ loading ? 'Creando cuenta...' : 'Registrarme' }}
      </button>
    </form>

    <p class="pv-switch">¿Ya tienes cuenta? <RouterLink to="/login">Inicia sesión</RouterLink></p>
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
