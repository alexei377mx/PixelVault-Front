import { computed, reactive } from 'vue'
import { authApi } from '@/services/api'

function loadPersisted() {
  try {
    const raw = localStorage.getItem('pv_account')
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const state = reactive({
  token: localStorage.getItem('pv_token') || null,
  account: loadPersisted(),
  role: localStorage.getItem('pv_role') || null,
})

function persist(token, account, role) {
  state.token = token
  state.account = account
  state.role = role
  localStorage.setItem('pv_token', token)
  localStorage.setItem('pv_account', JSON.stringify(account))
  localStorage.setItem('pv_role', role)
}

function clear() {
  state.token = null
  state.account = null
  state.role = null
  localStorage.removeItem('pv_token')
  localStorage.removeItem('pv_account')
  localStorage.removeItem('pv_role')
}

export function useAuth() {
  const isAuthenticated = computed(() => !!state.token)
  const isAdmin = computed(() => state.role === 'admin')
  const isUser = computed(() => state.role === 'user')

  async function registerUser(payload) {
    const { data } = await authApi.register(payload)
    persist(data.token, data.user, 'user')
    return data
  }

  async function loginUser(payload) {
    const { data } = await authApi.login(payload)
    persist(data.token, data.user, 'user')
    return data
  }

  async function loginAdmin(payload) {
    const { data } = await authApi.adminLogin(payload)
    persist(data.token, data.admin, 'admin')
    return data
  }

  function logout() {
    clear()
  }

  return {
    state,
    isAuthenticated,
    isAdmin,
    isUser,
    registerUser,
    loginUser,
    loginAdmin,
    logout,
  }
}
