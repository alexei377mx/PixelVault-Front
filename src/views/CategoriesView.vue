<script setup>
import { onMounted, reactive, ref } from 'vue'
import { categoriesApi } from '@/services/api'
import AlertMessage from '@/components/AlertMessage.vue'

const categories = ref([])
const loading = ref(true)
const errorMessage = ref('')
const successMessage = ref('')

const createForm = reactive({ name: '', description: '' })
const creating = ref(false)

const editingId = ref(null)
const editForm = reactive({ name: '', description: '' })
const saving = ref(false)
const deletingId = ref(null)

async function fetchCategories() {
  loading.value = true
  errorMessage.value = ''
  try {
    const { data } = await categoriesApi.list()
    categories.value = data
  } catch (err) {
    errorMessage.value = err.message || 'No se pudieron cargar las categorías.'
  } finally {
    loading.value = false
  }
}

async function handleCreate() {
  creating.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const { data } = await categoriesApi.create({ ...createForm })
    categories.value.unshift(data)
    createForm.name = ''
    createForm.description = ''
    successMessage.value = 'Categoría creada correctamente.'
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo crear la categoría.'
  } finally {
    creating.value = false
  }
}

function startEdit(category) {
  editingId.value = category.id
  editForm.name = category.name
  editForm.description = category.description || ''
}

function cancelEdit() {
  editingId.value = null
}

async function handleUpdate(category) {
  saving.value = true
  errorMessage.value = ''
  try {
    const { data } = await categoriesApi.update(category.id, { ...editForm })
    const index = categories.value.findIndex((c) => c.id === category.id)
    if (index !== -1) categories.value[index] = data
    editingId.value = null
    successMessage.value = 'Categoría actualizada.'
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo actualizar la categoría.'
  } finally {
    saving.value = false
  }
}

async function handleDelete(category) {
  if (!confirm(`¿Eliminar la categoría "${category.name}"? Esta acción no se puede deshacer.`))
    return
  deletingId.value = category.id
  errorMessage.value = ''
  try {
    await categoriesApi.remove(category.id)
    categories.value = categories.value.filter((c) => c.id !== category.id)
    successMessage.value = 'Categoría eliminada.'
  } catch (err) {
    errorMessage.value = err.message || 'No se pudo eliminar la categoría.'
  } finally {
    deletingId.value = null
  }
}

onMounted(fetchCategories)
</script>

<template>
  <div>
    <div class="pv-page-head">
      <div>
        <span class="pv-eyebrow">ADMIN · CATALOG INDEX</span>
        <h1>Categorías</h1>
      </div>
    </div>

    <AlertMessage :message="errorMessage" />
    <AlertMessage :message="successMessage" variant="success" />

    <form class="pixel-card pv-create-form" @submit.prevent="handleCreate">
      <h2>Nueva categoría</h2>
      <div class="pv-create-form__row">
        <div class="pv-field">
          <label class="pixel-label" for="cat-name">Nombre</label>
          <input
            id="cat-name"
            v-model="createForm.name"
            type="text"
            class="pixel-input"
            required
            placeholder="Survival"
          />
        </div>
        <div class="pv-field">
          <label class="pixel-label" for="cat-desc">Descripción</label>
          <input
            id="cat-desc"
            v-model="createForm.description"
            type="text"
            class="pixel-input"
            placeholder="Juegos de supervivencia"
          />
        </div>
        <button type="submit" class="pixel-btn" :disabled="creating">
          {{ creating ? 'Creando...' : 'Crear' }}
        </button>
      </div>
    </form>

    <p v-if="loading" class="pv-loading">CARGANDO CATEGORÍAS...</p>

    <p v-else-if="!categories.length" class="pv-empty">Todavía no hay categorías registradas.</p>

    <ul v-else class="pv-cat-list">
      <li v-for="category in categories" :key="category.id" class="pixel-card pv-cat-item">
        <template v-if="editingId === category.id">
          <div class="pv-field">
            <label class="pixel-label">Nombre</label>
            <input v-model="editForm.name" type="text" class="pixel-input" required />
          </div>
          <div class="pv-field">
            <label class="pixel-label">Descripción</label>
            <input v-model="editForm.description" type="text" class="pixel-input" />
          </div>
          <div class="pv-cat-item__actions">
            <button class="pixel-btn" :disabled="saving" @click="handleUpdate(category)">
              {{ saving ? 'Guardando...' : 'Guardar' }}
            </button>
            <button class="pixel-btn pixel-btn--ghost" @click="cancelEdit">Cancelar</button>
          </div>
        </template>

        <template v-else>
          <div class="pv-cat-item__info">
            <h3>{{ category.name }}</h3>
            <p v-if="category.description" class="pv-cat-item__desc">{{ category.description }}</p>
          </div>
          <div class="pv-cat-item__actions">
            <button class="pixel-btn pixel-btn--ghost" @click="startEdit(category)">Editar</button>
            <button
              class="pixel-btn pixel-btn--danger"
              :disabled="deletingId === category.id"
              @click="handleDelete(category)"
            >
              {{ deletingId === category.id ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.pv-create-form {
  padding: 1.25rem;
  margin-bottom: 2rem;
}

.pv-create-form h2 {
  margin-bottom: 1rem;
}

.pv-create-form__row {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
  flex-wrap: wrap;
}

.pv-create-form__row .pv-field {
  flex: 1;
  min-width: 180px;
  margin-bottom: 0;
}

.pv-cat-list {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.pv-cat-item {
  padding: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.pv-cat-item__desc {
  color: var(--pv-text-dim);
  font-size: 0.8rem;
  margin-top: 0.35rem;
}

.pv-cat-item__actions {
  display: flex;
  gap: 0.6rem;
  margin-top: auto;
}
</style>
