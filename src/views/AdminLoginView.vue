<script setup>
import { reactive, ref } from 'vue'
import { useRouter, RouterLink } from 'vue-router'
import { useAuth } from '@/stores/auth'
import AlertMessage from '@/components/AlertMessage.vue'

const router = useRouter()
const { loginAdmin } = useAuth()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  loading.value = true
  errorMessage.value = ''
  try {
    await loginAdmin({ ...form })
    router.push({ name: 'categories' })
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="pv-container pv-container--narrow">
    <span class="pv-eyebrow">ADMIN ACCESS</span>
    <h1>Acceso administrador</h1>
    <p class="pv-sub">Gestiona categorías y el catálogo de PixelVault.</p>

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
          placeholder="admin@pixelvault.com"
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

    <p class="pv-switch">¿Eres jugador? <RouterLink to="/login">Entra por aquí</RouterLink></p>
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

@media (max-width: 480px) {
  .pv-form {
    padding: 1rem;
  }

  .pv-sub {
    font-size: 0.8rem;
    margin-bottom: 1rem;
  }

  .pv-switch {
    font-size: 0.75rem;
    text-align: center;
  }

  .pixel-btn {
    width: 100%;
    justify-content: center;
  }

  .pv-field {
    margin-bottom: 0.75rem;
  }

  .pixel-input {
    font-size: 0.85rem;
    padding: 0.5rem 0.65rem;
  }
}

@media (max-width: 380px) {
  .pv-form {
    padding: 0.75rem;
  }

  .pv-sub {
    font-size: 0.75rem;
  }

  h1 {
    font-size: 1.1rem;
  }

  .pv-eyebrow {
    font-size: 0.5rem;
  }

  .pixel-input {
    font-size: 0.8rem;
    padding: 0.4rem 0.5rem;
  }

  .pixel-btn {
    font-size: 0.7rem;
    padding: 0.5rem 0.7rem;
  }
}
</style>
