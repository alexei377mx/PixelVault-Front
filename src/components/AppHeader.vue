<script setup>
import { ref } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuth } from '@/stores/auth'

const { state, isAuthenticated, isAdmin, logout } = useAuth()
const router = useRouter()

const isMenuOpen = ref(false)

function handleLogout() {
  logout()
  router.push({ name: 'games' })
  isMenuOpen.value = false
}

function closeMenu() {
  isMenuOpen.value = false
}
</script>

<template>
  <header class="pv-header">
    <div class="pv-header__inner">
      <RouterLink to="/" class="pv-logo" @click="closeMenu">
        <span class="pv-logo__mark">◆</span>PixelVault
      </RouterLink>

      <button class="pv-hamburger" @click="isMenuOpen = !isMenuOpen" aria-label="Menú">
        <span class="pv-hamburger__line"></span>
        <span class="pv-hamburger__line"></span>
        <span class="pv-hamburger__line"></span>
      </button>

      <nav class="pv-nav" :class="{ 'pv-nav--open': isMenuOpen }">
        <RouterLink v-if="isAdmin" to="/categories" class="pv-nav__link" @click="closeMenu">
          Categorías
        </RouterLink>
        <RouterLink v-if="!isAdmin" to="/favorites" class="pv-nav__link" @click="closeMenu">
          Favoritos
        </RouterLink>

        <div class="pv-nav__account">
          <template v-if="isAuthenticated">
            <span class="pixel-badge" v-if="isAdmin">ADMIN</span>
            <span class="pv-account-name">{{ state.account?.name }}</span>
            <button class="pixel-btn pixel-btn--ghost pixel-btn--sm" @click="handleLogout">
              Salir
            </button>
          </template>
          <template v-else>
            <RouterLink class="pv-nav__link" to="/login" @click="closeMenu"> Entrar </RouterLink>
            <RouterLink class="pixel-btn pixel-btn--sm" to="/register" @click="closeMenu">
              Registrarse
            </RouterLink>
          </template>
        </div>
      </nav>

      <div class="pv-header__account">
        <template v-if="isAuthenticated">
          <span class="pixel-badge" v-if="isAdmin">ADMIN</span>
          <span class="pv-account-name">{{ state.account?.name }}</span>
          <button class="pixel-btn pixel-btn--ghost pixel-btn--sm" @click="handleLogout">
            Salir
          </button>
        </template>
        <template v-else>
          <RouterLink class="pv-nav__link" to="/login">Entrar</RouterLink>
          <RouterLink class="pixel-btn pixel-btn--sm" to="/register">Registrarse</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.pv-header {
  border-bottom: 2px solid var(--pv-border);
  background: var(--pv-bg-soft);
  position: sticky;
  top: 0;
  z-index: 10;
}

.pv-header__inner {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0.9rem 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: nowrap;
  position: relative;
}

.pv-logo {
  font-family: var(--pv-font-display);
  font-size: 0.85rem;
  color: var(--pv-text);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  margin-right: auto;

  min-width: 0;
  flex-shrink: 1;
}

.pv-logo:hover {
  text-decoration: none;
  color: var(--pv-accent-2);
}

.pv-logo__mark {
  color: var(--pv-accent);
}

.pv-hamburger {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: 2px solid var(--pv-border-bright);
  padding: 0.4rem 0.5rem;
  cursor: pointer;
  margin-left: auto;
}

.pv-hamburger__line {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--pv-text);
  transition: 0.2s ease;
}

.pv-nav {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
  min-width: 0;
}

.pv-nav__link {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--pv-text-dim);
  white-space: nowrap;
}
.pv-nav__link:hover {
  color: var(--pv-accent-2);
  text-decoration: none;
}
.router-link-exact-active.pv-nav__link {
  color: var(--pv-accent);
}

.pv-nav__account {
  display: none;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.pv-header__account {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
}

.pv-account-name {
  color: var(--pv-text-dim);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pixel-btn--sm {
  padding: 0.45rem 0.8rem;
  font-size: 0.7rem;
}

@media (max-width: 820px) {
  .pv-hamburger {
    display: flex;
  }

  .pv-header__account {
    display: none;
  }

  .pv-nav {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;

    flex-direction: column;
    align-items: stretch;

    padding: 1rem;
    background: var(--pv-bg-soft);
    border-top: 2px solid var(--pv-border);

    z-index: 100;
  }

  .pv-nav--open {
    display: flex;
  }

  .pv-nav__link {
    white-space: normal;
    padding: 0.4rem 0;
    border-bottom: 1px solid var(--pv-border);
  }

  .pv-nav__account {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    margin-top: 0.25rem;
    width: 100%;
  }

  .pv-nav__account .pixel-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>
