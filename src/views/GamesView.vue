<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { gamesApi, favoritesApi } from '@/services/api'
import { useAuth } from '@/stores/auth'
import GameCard from '@/components/GameCard.vue'
import AlertMessage from '@/components/AlertMessage.vue'

const { isUser } = useAuth()

const filters = reactive({ search: '', genre: '', platform: '' })
const page = ref(1)
const games = ref([])
const count = ref(0)
const hasNext = ref(false)
const hasPrevious = ref(false)
const loading = ref(true)
const errorMessage = ref('')

const favoriteGameIds = ref(new Set())
const favoriteBusyId = ref(null)
const genres = ref([])
const platforms = ref([])

let searchDebounce = null

async function fetchGames() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await gamesApi.list({
      page: page.value,
      search: filters.search || undefined,
      genre: filters.genre || undefined,
      platform: filters.platform || undefined,
    })
    console.log('API response:', data)
    games.value = data.results || []
    count.value = data.count || 0
    hasNext.value = !!data.next
    hasPrevious.value = !!data.previous
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo cargar el catálogo de juegos.'
  } finally {
    loading.value = false
  }
}

async function fetchFavorites() {
  if (!isUser.value) return
  try {
    const { data } = await favoritesApi.list()
    favoriteGameIds.value = new Set(data.map((f) => f.game_id))
  } catch {
    console.log('Error')
  }
}

async function toggleFavorite(game) {
  favoriteBusyId.value = game.id
  try {
    if (favoriteGameIds.value.has(game.id)) {
      await favoritesApi.remove(game.id)
      favoriteGameIds.value.delete(game.id)
    } else {
      await favoritesApi.create(game.id)
      favoriteGameIds.value.add(game.id)
    }
    favoriteGameIds.value = new Set(favoriteGameIds.value)
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo actualizar tus favoritos.'
  } finally {
    favoriteBusyId.value = null
  }
}

async function fetchGenres() {
  const { data } = await gamesApi.genres()
  genres.value = data
}

async function fetchPlatforms() {
  const { data } = await gamesApi.platforms()
  platforms.value = data
}

const statItems = computed(() => [
  { key: 'genres', label: 'Géneros disponibles', value: genres.value.length },
  { key: 'games', label: 'Juegos en el catálogo', value: count.value },
  { key: 'platforms', label: 'Plataformas activas', value: platforms.value.length },
])

function goToPage(delta) {
  page.value = Math.max(1, page.value + delta)
}

function handleFilterChange() {
  page.value = 1
  fetchGames()
}

watch(
  () => filters.search,
  () => {
    clearTimeout(searchDebounce)
    searchDebounce = setTimeout(handleFilterChange, 400)
  },
)

watch(page, fetchGames)

onMounted(() => {
  console.log('GamesView mounted')
  fetchGames()
  fetchFavorites()
  fetchGenres()
  fetchPlatforms()
})
</script>

<template>
  <div>
    <section class="pv-hero">
      <span class="pv-hero__eyebrow pv-eyebrow">GAME CATALOG · RAWG</span>
      <h1 class="pv-hero__title">Catálogo de juegos</h1>
      <p class="pv-hero__subtitle">
        Explora, filtra y guarda en tu vault los títulos que quieres tener siempre a la mano.
      </p>
      <span v-if="count" class="pixel-badge pv-hero__badge">
        {{ count.toLocaleString('es-MX') }} juegos encontrados
      </span>
    </section>

    <div class="pixel-card pv-quickfilters">
      <div class="pv-quickfilters__item">
        <label class="pixel-label" for="search">Buscar</label>
        <input
          id="search"
          v-model="filters.search"
          type="text"
          class="pixel-input"
          placeholder="Zelda, Halo, Elden Ring..."
        />
      </div>
      <div class="pv-quickfilters__item">
        <label class="pixel-label" for="genre">Género</label>

        <select id="genre" v-model="filters.genre" class="pixel-input" @change="handleFilterChange">
          <option value="">Todos los géneros</option>

          <option v-for="genre in genres" :key="genre.id" :value="genre.slug">
            {{ genre.name }}
          </option>
        </select>
      </div>
      <div class="pv-quickfilters__item">
        <label class="pixel-label" for="platform">Plataforma</label>

        <select
          id="platform"
          v-model="filters.platform"
          class="pixel-input"
          @change="handleFilterChange"
        >
          <option value="">Todas las plataformas</option>

          <option v-for="platform in platforms" :key="platform.id" :value="platform.id">
            {{ platform.name }}
          </option>
        </select>
      </div>
    </div>

    <AlertMessage :message="errorMessage" />

    <p v-if="loading" class="pv-loading">CARGANDO JUEGOS...</p>

    <p v-else-if="!games.length" class="pv-empty">No se encontraron juegos con esos filtros.</p>

    <div v-else class="pv-grid">
      <GameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        :show-favorite-toggle="isUser"
        :is-favorite="favoriteGameIds.has(game.id)"
        :favorite-busy="favoriteBusyId === game.id"
        @toggle-favorite="toggleFavorite"
      />
    </div>

    <div v-if="!loading && games.length" class="pv-pagination">
      <button class="pixel-btn pixel-btn--ghost" :disabled="!hasPrevious" @click="goToPage(-1)">
        « Anterior
      </button>
      <span class="pv-pagination__page">Página {{ page }}</span>
      <button class="pixel-btn pixel-btn--ghost" :disabled="!hasNext" @click="goToPage(1)">
        Siguiente »
      </button>
    </div>

    <section class="pv-section">
      <span class="pv-eyebrow pv-section__eyebrow">EN NÚMEROS</span>
      <div class="pv-stats">
        <div v-for="stat in statItems" :key="stat.key" class="pv-stats__item">
          <span class="pv-stats__circle">{{ stat.value.toLocaleString('es-MX') }}</span>
          <span class="pv-stats__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.pv-hero {
  text-align: center;
  padding: 2.5rem 1.5rem 2.25rem;
  margin-bottom: 1.75rem;
  border: 2px solid var(--pv-border);
  background: var(--pv-bg-soft);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.45);
}

.pv-hero__eyebrow {
  display: block;
  margin: 0 auto 0.9rem;
}

.pv-hero__title {
  margin-bottom: 0.75rem;
}

.pv-hero__subtitle {
  max-width: 46ch;
  margin: 0 auto 1.25rem;
  color: var(--pv-text-dim);
  font-size: 0.9rem;
}

.pv-hero__badge {
  color: var(--pv-accent-2);
  border-color: var(--pv-accent-2);
}

.pv-quickfilters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 1.1rem;
  margin-bottom: 1.75rem;
}

.pv-quickfilters__item {
  flex: 1;
  min-width: 200px;
}

.pv-section {
  margin-top: 2.5rem;
}

.pv-section__eyebrow {
  display: block;
  text-align: center;
  margin-bottom: 1rem;
}

.pv-tagstrip {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.pv-tagstrip__item {
  aspect-ratio: 3 / 2;
  display: flex;
  align-items: flex-end;
  padding: 0.75rem;
  border: 2px solid var(--pv-border);
  background: var(--pv-accent-2);
  cursor: pointer;
  box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.45);
  transition:
    transform 0.08s ease,
    box-shadow 0.08s ease;
}

.pv-tagstrip__item:hover {
  transform: translate(-1px, -1px);
  box-shadow: 5px 5px 0 rgba(0, 0, 0, 0.45);
}

.pv-tagstrip__item--alt {
  background-color: var(--pv-surface-raised);
  background-image: repeating-linear-gradient(
    45deg,
    var(--pv-accent-2) 0,
    var(--pv-accent-2) 3px,
    transparent 3px,
    transparent 9px
  );
}

.pv-tagstrip__item--active {
  border-color: var(--pv-accent);
  outline: 2px solid var(--pv-accent);
  outline-offset: -4px;
}

.pv-tagstrip__label {
  font-family: var(--pv-font-display);
  font-size: 0.6rem;
  line-height: 1.4;
  color: #0c1512;
  background: rgba(11, 10, 18, 0.15);
  padding: 0.2rem 0.35rem;
}

.pv-tagstrip__item--alt .pv-tagstrip__label {
  color: var(--pv-text);
  background: rgba(11, 10, 18, 0.55);
}

.pv-stats {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: clamp(1.5rem, 4vw, 3rem);
  flex-wrap: wrap;
  text-align: center;
}

.pv-stats__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  max-width: 160px;
}

.pv-stats__circle {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 150px;
  height: 90px;
  padding: 0 1.5rem;
  border-radius: 999px;
  border: 2px solid var(--pv-border-bright);
  background: var(--pv-surface);
  box-shadow: 4px 4px 0 rgba(0, 0, 0, 0.45);
  font-family: var(--pv-font-display);
  font-size: 1.15rem;
  color: var(--pv-accent);
}

.pv-stats__item:nth-child(2) .pv-stats__circle {
  min-width: 180px;
  height: 105px;
  font-size: 1.35rem;
  color: var(--pv-accent-2);
}

.pv-stats__label {
  font-size: 0.75rem;
  color: var(--pv-text-dim);
}
@media (max-width: 600px) {
  .pv-stats {
    flex-direction: column;
    align-items: center;
  }

  .pv-stats__item {
    max-width: 100%;
  }

  .pv-stats__circle {
    min-width: unset;
    width: 100%;
    max-width: 280px;
    height: 80px;
    font-size: 1rem;
  }

  .pv-stats__item:nth-child(2) .pv-stats__circle {
    min-width: unset;
    width: 100%;
    max-width: 300px;
    height: 90px;
    font-size: 1.2rem;
  }
}
</style>
