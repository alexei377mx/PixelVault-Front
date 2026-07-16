import axios from 'axios'

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:3000'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pv_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  console.log('📤 Request:', config.method.toUpperCase(), config.url)
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status ?? 0
    const data = error.response?.data ?? {}
    const message =
      data.error ||
      (status === 0 ? 'No se pudo conectar con el servidor.' : 'Ocurrió un error inesperado.')
    const errors = data.errors || []

    if (status === 401) {
      localStorage.removeItem('pv_token')
      localStorage.removeItem('pv_account')
      localStorage.removeItem('pv_role')
    }

    return Promise.reject({ status, message, errors, raw: error })
  },
)

export default api

export const authApi = {
  register: (payload) => api.post('/register', payload),
  login: (payload) => api.post('/login', payload),
  adminLogin: (payload) => api.post('/admin/login', payload),
}

export const categoriesApi = {
  list: () => api.get('/categories'),
  create: (payload) => api.post('/categories', payload),
  update: (id, payload) => api.put(`/categories/${id}`, payload),
  remove: (id) => api.delete(`/categories/${id}`),
}

export const favoritesApi = {
  list: () => api.get('/favorites'),
  create: (gameId) => api.post('/favorites', { game_id: gameId }),
  updateCategory: (gameId, categoryId) =>
    api.put(`/favorites/${gameId}`, { category_id: categoryId }),
  remove: (gameId) => api.delete(`/favorites/${gameId}`),
}

export const gamesApi = {
  list: (params) => api.get('/games', { params }),
  get: (id) => api.get(`/games/${id}`),

  genres: () => api.get('/genres'),
  platforms: () => api.get('/platforms'),
}
