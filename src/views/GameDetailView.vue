<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { RouterLink } from 'vue-router'
import { gamesApi, favoritesApi, categoriesApi } from '@/services/api'
import { useAuth } from '@/stores/auth'
import AlertMessage from '@/components/AlertMessage.vue'

const props = defineProps({
  id: { type: [String, Number], required: true },
})

const { isUser } = useAuth()

const game = ref(null)
const loading = ref(true)
const errorMessage = ref('')

const favorite = ref(null)
const favoriteChecked = ref(false)
const favoriteBusy = ref(false)
const isFavorite = computed(() => !!favorite.value)
const categoryChanged = computed(() => {
  return (favorite.value?.category_id ?? '') !== (selectedCategory.value ?? '')
})

const categories = ref([])
const categoryBusy = ref(false)
const selectedCategory = ref('')

async function fetchGame() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await gamesApi.get(props.id)
    game.value = data
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo cargar la información del juego.'
  } finally {
    loading.value = false
  }
}

async function fetchCategories() {
  try {
    const { data } = await categoriesApi.list()
    categories.value = data
  } catch {
    categories.value = []
  }
}

async function checkFavorite() {
  if (!isUser.value) return
  try {
    const { data } = await favoritesApi.list()
    favorite.value = data.find((f) => f.game_id === Number(props.id)) || null
    selectedCategory.value = favorite.value ? (favorite.value.category_id ?? '') : ''
  } finally {
    favoriteChecked.value = true
  }
}

async function toggleFavorite() {
  favoriteBusy.value = true
  errorMessage.value = ''
  try {
    if (isFavorite.value) {
      await favoritesApi.remove(props.id)
      favorite.value = null
    } else {
      const { data } = await favoritesApi.create(props.id)
      favorite.value = data
    }
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo actualizar tus favoritos.'
  } finally {
    favoriteBusy.value = false
  }
}

async function assignCategory(categoryId) {
  if (!favorite.value) return
  const parsed =
    categoryId === '' || categoryId === null || categoryId === undefined ? null : Number(categoryId)
  categoryBusy.value = true
  errorMessage.value = ''
  try {
    const { data } = await favoritesApi.updateCategory(favorite.value.game_id, parsed)
    favorite.value = { ...favorite.value, category_id: data.category_id }
    selectedCategory.value = data.category_id ?? ''
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo asignar la categoría.'
  } finally {
    categoryBusy.value = false
  }
}

watch(
  () => props.id,
  () => {
    fetchGame()
    checkFavorite()
  },
)

onMounted(() => {
  fetchGame()
  checkFavorite()
  fetchCategories()
})
</script>

<template>
  <div>
    <RouterLink to="/" class="pv-back">« Volver al catálogo</RouterLink>

    <AlertMessage :message="errorMessage" />

    <p v-if="loading" class="pv-loading">CARGANDO JUEGO...</p>

    <template v-else-if="game">
      <div class="pixel-card pv-detail">
        <div class="pv-detail__col-media">
          <div class="pv-detail__media">
            <img
              v-if="game.background_image"
              :src="game.background_image.replace('/media/', '/media/resize/420/-/')"
              :alt="game.name"
              loading="lazy"
            />
            <div v-else class="pv-detail__media--placeholder">SIN IMAGEN</div>
          </div>

          <div v-if="game.description_raw" class="pv-description">
            <h2>Descripción</h2>
            <p>{{ game.description_raw }}</p>
          </div>
        </div>

        <div class="pv-detail__col-info">
          <div class="pv-detail__header">
            <span class="pv-eyebrow">GAME PROFILE</span>
            <h1>{{ game.name }}</h1>

            <div v-if="game.genres?.length" class="pv-tags">
              <span v-for="genre in game.genres" :key="genre.id" class="pixel-badge">
                {{ genre.name }}
              </span>
            </div>

            <div class="pv-detail__stats">
              <div v-if="game.released" class="pv-stat">
                <span class="pixel-label">Lanzamiento</span>
                <span>{{ game.released }}</span>
              </div>
              <div v-if="game.rating" class="pv-stat">
                <span class="pixel-label">Rating</span>
                <span>★ {{ game.rating.toFixed(1) }}</span>
              </div>
              <div v-if="game.metacritic" class="pv-stat">
                <span class="pixel-label">Metacritic</span>
                <span>{{ game.metacritic }}</span>
              </div>
              <div v-if="game.playtime" class="pv-stat">
                <span class="pixel-label">Duración media</span>
                <span>{{ game.playtime }} h</span>
              </div>
              <div v-if="game.esrb_rating" class="pv-stat">
                <span class="pixel-label">Clasificación</span>
                <span>{{ game.esrb_rating.name }}</span>
              </div>
            </div>

            <div class="pv-info">
              <div v-if="game.developers?.length" class="pv-info-row">
                <span class="pixel-label">Desarrollador</span>
                <span>{{ game.developers.map((dev) => dev.name).join(', ') }}</span>
              </div>
              <div v-if="game.publishers?.length" class="pv-info-row">
                <span class="pixel-label">Publisher</span>
                <span>{{ game.publishers.map((pub) => pub.name).join(', ') }}</span>
              </div>
              <div v-if="game.platforms?.length" class="pv-info-row">
                <span class="pixel-label">Plataformas</span>
                <span>{{ game.platforms.map((p) => p.platform.name).join(', ') }}</span>
              </div>
            </div>
          </div>

          <div class="pv-detail__footer">
            <div v-if="game.stores?.length" class="pixel-card pv-stores">
              <h2>Disponible en</h2>
              <div class="pv-tags">
                <span v-for="store in game.stores" :key="store.id" class="pixel-badge">
                  {{ store.store.name }}
                </span>
              </div>
            </div>

            <button
              v-if="isUser && favoriteChecked"
              class="pixel-btn"
              :class="{ 'pixel-btn--ghost': isFavorite }"
              :disabled="favoriteBusy"
              @click="toggleFavorite"
            >
              {{ isFavorite ? '★ Quitar de favoritos' : '☆ Añadir a favoritos' }}
            </button>

            <div v-if="isUser && isFavorite" class="pixel-card pv-category">
              <label class="pixel-label" for="fav-category">Categoría</label>
              <select
                id="fav-category"
                v-model="selectedCategory"
                class="pixel-input"
                :disabled="categoryBusy"
              >
                <option value="">Sin categoría</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
              <button
                class="pixel-btn"
                :disabled="!categoryChanged || categoryBusy"
                @click="assignCategory(selectedCategory)"
              >
                {{ categoryBusy ? 'Guardando...' : 'Guardar categoría' }}
              </button>
              <p v-if="!categories.length" class="pv-category__hint">
                Todavía no hay categorías creadas. Pide a un administrador que agregue alguna.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.pv-back {
  display: inline-block;
  font-size: 0.8rem;
  color: var(--pv-text-dim);
  margin-bottom: 1.5rem;
}

.pv-back:hover {
  color: var(--pv-accent-2);
  text-decoration: none;
}

.pv-detail {
  display: flex;
  overflow: hidden;
}

.pv-detail__col-media,
.pv-detail__col-info {
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  min-width: 0;
}

.pv-detail__media {
  aspect-ratio: 4 / 3;
  background: var(--pv-bg-soft);
}

.pv-detail__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.pv-detail__media--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--pv-text-faint);
  font-family: var(--pv-font-display);
  font-size: 0.7rem;
}

.pv-detail__header {
  padding: 1.75rem 1.75rem 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pv-detail__stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin: 0.5rem 0 1rem;
}

.pv-stat {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.85rem;
}

.pv-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pv-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pv-info-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.pv-description {
  padding: 0.25rem 1.75rem 1.75rem;
}

.pv-description p {
  line-height: 1.8;
  color: var(--pv-text-dim);
}

.pv-detail__footer {
  padding: 0.5rem 1.75rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pv-stores {
  padding: 1rem;
}

.pv-stores h2 {
  margin-bottom: 0.5rem;
}

.pv-category {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.pv-category__hint {
  font-size: 0.7rem;
  color: var(--pv-text-faint);
}

@media (max-width: 760px) {
  .pv-detail {
    flex-direction: column;
  }

  .pv-detail__col-media,
  .pv-detail__col-info {
    display: contents;
  }

  .pv-detail__media {
    order: 1;
    aspect-ratio: 16 / 9;
  }

  .pv-detail__header {
    order: 2;
    padding: 1.25rem 1.25rem 0;
    gap: 0.75rem;
  }

  .pv-description {
    order: 3;
    padding: 1.5rem 1.25rem 1rem;
  }

  .pv-detail__footer {
    order: 4;
    padding: 0.5rem 1.25rem 1.25rem;
    gap: 0.75rem;
  }

  .pv-detail__stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }

  .pv-stat {
    font-size: 0.8rem;
  }

  .pv-detail__header h1 {
    font-size: 1.2rem;
  }

  .pv-description p {
    font-size: 0.9rem;
  }

  .pv-stores {
    padding: 0.75rem;
  }

  .pv-category {
    padding: 0.75rem;
  }
}

@media (max-width: 480px) {
  .pv-detail__stats {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }

  .pv-stat {
    font-size: 0.75rem;
  }

  .pv-detail__header {
    padding: 1rem 1rem 0;
  }

  .pv-description {
    padding: 0.5rem 1rem 0.75rem;
  }

  .pv-detail__footer {
    padding: 0.5rem 1rem 1rem;
  }

  .pv-detail__header h1 {
    font-size: 1rem;
  }

  .pixel-btn {
    font-size: 0.7rem;
    padding: 0.5rem 0.8rem;
  }
}
</style>
