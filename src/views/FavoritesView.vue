<script setup>
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { favoritesApi, gamesApi, categoriesApi } from '@/services/api'
import GameCard from '@/components/GameCard.vue'
import AlertMessage from '@/components/AlertMessage.vue'

const entries = ref([])
const loading = ref(true)
const errorMessage = ref('')
const busyGameId = ref(null)

const categories = ref([])

async function fetchCategories() {
  try {
    const { data } = await categoriesApi.list()
    categories.value = data
  } catch {
    categories.value = []
  }
}

async function fetchFavorites() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data: favorites } = await favoritesApi.list()

    const games = await Promise.all(
      favorites.map(async (favorite) => {
        try {
          const { data: game } = await gamesApi.get(favorite.game_id)
          return { favorite, game }
        } catch {
          return null
        }
      }),
    )

    entries.value = games.filter(Boolean)
  } catch (err) {
    errorMessage.value = err.message || 'No se pudieron cargar tus favoritos.'
  } finally {
    loading.value = false
  }
}

function categoryName(categoryId) {
  if (!categoryId) return null
  const match = categories.value.find((c) => c.id === categoryId)
  return match ? match.name : `Categoría #${categoryId}`
}

const sortedEntries = computed(() => {
  const withCategory = []
  const withoutCategory = []

  for (const entry of entries.value) {
    if (entry.favorite.category_id) {
      withCategory.push(entry)
    } else {
      withoutCategory.push(entry)
    }
  }

  withCategory.sort((a, b) => {
    const nameA = categoryName(a.favorite.category_id) || ''
    const nameB = categoryName(b.favorite.category_id) || ''
    return nameA.localeCompare(nameB)
  })

  return [...withCategory, ...withoutCategory]
})

async function removeFavorite(game) {
  busyGameId.value = game.id
  errorMessage.value = ''
  try {
    await favoritesApi.remove(game.id)
    entries.value = entries.value.filter((entry) => entry.game.id !== game.id)
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo quitar el juego de tus favoritos.'
  } finally {
    busyGameId.value = null
  }
}

onMounted(() => {
  fetchFavorites()
  fetchCategories()
})
</script>

<template>
  <div>
    <div class="pv-page-head">
      <div>
        <span class="pv-eyebrow">YOUR VAULT</span>
        <h1>Favoritos</h1>
      </div>
      <p v-if="entries.length" class="pv-hint">
        Ordenados por categoría · asigna una desde la ficha de cada juego.
      </p>
    </div>

    <AlertMessage :message="errorMessage" />

    <p v-if="loading" class="pv-loading">CARGANDO FAVORITOS...</p>

    <p v-else-if="!entries.length" class="pv-empty">
      Todavía no has guardado juegos. Explora el <RouterLink to="/">catálogo</RouterLink> y pulsa
      "Añadir a favoritos".
    </p>

    <div v-else class="pv-grid">
      <div v-for="entry in sortedEntries" :key="entry.game.id" class="pv-fav-entry">
        <GameCard
          :game="entry.game"
          show-favorite-toggle
          is-favorite
          :favorite-busy="busyGameId === entry.game.id"
          @toggle-favorite="removeFavorite"
        />
        <RouterLink
          v-if="categoryName(entry.favorite.category_id)"
          :to="{ name: 'game-detail', params: { id: entry.game.id } }"
          class="pixel-badge pv-fav-entry__badge"
        >
          {{ categoryName(entry.favorite.category_id) }}
        </RouterLink>
        <RouterLink
          v-else
          :to="{ name: 'game-detail', params: { id: entry.game.id } }"
          class="pixel-badge pv-fav-entry__badge pv-fav-entry__badge--muted"
        >
          Sin categoría
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pv-hint {
  font-size: 0.75rem;
  color: var(--pv-text-dim);
}

.pv-fav-entry {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
}

.pv-fav-entry__badge {
  color: var(--pv-accent-2);
  border-color: var(--pv-accent-2);
}

.pv-fav-entry__badge:hover {
  text-decoration: none;
  background: var(--pv-surface-raised);
}

.pv-fav-entry__badge--muted {
  color: var(--pv-text-faint);
  border-color: var(--pv-border);
}
</style>
