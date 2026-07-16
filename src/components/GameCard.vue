<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  game: { type: Object, required: true },
  showFavoriteToggle: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  favoriteBusy: { type: Boolean, default: false },
})

defineEmits(['toggle-favorite'])
</script>

<template>
  <article class="game-card pixel-card">
    <RouterLink :to="{ name: 'game-detail', params: { id: game.id } }" class="game-card__media">
      <img
        v-if="game.background_image"
        :src="game.background_image.replace('/media/', '/media/resize/420/-/')"
        :alt="game.name"
        loading="lazy"
      />
      <div v-else class="game-card__media game-card__media--placeholder">SIN IMAGEN</div>
      <span v-if="game.metacritic" class="game-card__metacritic">{{ game.metacritic }}</span>
    </RouterLink>

    <div class="game-card__body">
      <h3 class="game-card__title">
        <RouterLink :to="{ name: 'game-detail', params: { id: game.id } }">{{
          game.name
        }}</RouterLink>
      </h3>

      <div class="game-card__meta">
        <span v-if="game.released">{{ game.released }}</span>
        <span v-if="game.rating">★ {{ game.rating.toFixed(1) }}</span>
      </div>

      <button
        v-if="showFavoriteToggle"
        class="pixel-btn pixel-btn--ghost game-card__fav"
        :class="{ 'game-card__fav--active': isFavorite }"
        :disabled="favoriteBusy"
        @click="$emit('toggle-favorite', game)"
      >
        {{ isFavorite ? '★ En favoritos' : '☆ Añadir a favoritos' }}
      </button>
    </div>
  </article>
</template>

<style scoped>
.game-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.game-card__media {
  display: block;
  position: relative;
  aspect-ratio: 16 / 10;
  background: var(--pv-bg-soft);
  overflow: hidden;
}

.game-card__media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.2s ease;
}

.game-card:hover .game-card__media img {
  transform: scale(1.04);
}

.game-card__media--placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--pv-text-faint);
  font-family: var(--pv-font-display);
  font-size: 0.6rem;
  text-align: center;
}

.game-card__metacritic {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: var(--pv-bg);
  border: 2px solid var(--pv-accent-2);
  color: var(--pv-accent-2);
  font-family: var(--pv-font-display);
  font-size: 0.65rem;
  padding: 0.2rem 0.4rem;
}

.game-card__body {
  padding: 0.9rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.game-card__title {
  font-size: 0.85rem;
  line-height: 1.4;
}

.game-card__title a {
  color: var(--pv-text);
}

.game-card__title a:hover {
  color: var(--pv-accent);
  text-decoration: none;
}

.game-card__meta {
  display: flex;
  gap: 0.75rem;
  font-size: 0.75rem;
  color: var(--pv-text-dim);
}

.game-card__fav {
  margin-top: auto;
  font-size: 0.7rem;
  padding: 0.5rem 0.7rem;
  width: 100%;
}

.game-card__fav--active {
  border-color: var(--pv-accent);
  color: var(--pv-accent);
}
</style>
