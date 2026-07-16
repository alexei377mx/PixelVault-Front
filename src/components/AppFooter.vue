<script setup>
import { useAuth } from '@/stores/auth'

const { isAuthenticated } = useAuth()

const columns = [
  {
    title: 'Cuenta',
    links: [
      { label: 'Entrar', to: { name: 'login' } },
      { label: 'Registrarse', to: { name: 'register' } },
    ],
  },
]
</script>

<template>
  <footer class="pv-footer">
    <div class="pv-footer__inner">
      <div class="pv-footer__brand">
        <span class="pv-footer__mark"> <span></span><span></span><span></span> </span>
        <p class="pv-footer__tagline">PixelVault — tu vault de juegos, siempre a la mano.</p>
      </div>

      <div v-if="!isAuthenticated" class="pv-footer__columns">
        <div v-for="col in columns" :key="col.title" class="pv-footer__col">
          <h3 class="pv-footer__col-title">{{ col.title }}</h3>
          <ul class="pv-footer__list">
            <li v-for="link in col.links" :key="link.label" class="pv-footer__item">
              <RouterLink :to="link.to" class="pv-footer__link">{{ link.label }}</RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.pv-footer {
  border-top: 2px solid var(--pv-border);
  background: var(--pv-bg-soft);
  margin-top: auto;
}

.pv-footer__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 2rem 1.25rem;
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
}

.pv-footer__brand {
  max-width: 260px;
}

.pv-footer__mark {
  display: inline-flex;
  gap: 0.35rem;
  margin-bottom: 0.75rem;
}

.pv-footer__mark span {
  width: 8px;
  height: 8px;
  background: var(--pv-accent);
}

.pv-footer__mark span:nth-child(2) {
  background: var(--pv-accent-2);
}

.pv-footer__mark span:nth-child(3) {
  background: var(--pv-warn);
}

.pv-footer__tagline {
  font-size: 0.8rem;
  color: var(--pv-text-dim);
}

.pv-footer__columns {
  display: flex;
  gap: 2.5rem;
  flex-wrap: wrap;
}

.pv-footer__col-title {
  font-size: 0.7rem;
  color: var(--pv-text-dim);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: 0.75rem;
}

.pv-footer__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.pv-footer__item::before {
  content: '»';
  color: var(--pv-accent);
  margin-right: 0.4rem;
}

.pv-footer__link {
  font-size: 0.8rem;
  color: var(--pv-text-dim);
}

.pv-footer__link:hover {
  color: var(--pv-accent-2);
  text-decoration: none;
}
</style>
