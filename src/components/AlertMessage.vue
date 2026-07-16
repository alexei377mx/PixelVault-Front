<script setup>
defineProps({
  message: { type: String, default: '' },
  variant: { type: String, default: 'error' },
  errors: { type: Array, default: () => [] },
})
</script>

<template>
  <div
    v-if="message"
    class="pv-alert"
    :class="{ 'pv-alert--success': variant === 'success' }"
    role="alert"
  >
    <p>{{ message }}</p>
    <ul v-if="errors.length" class="pv-form-errors">
      <li v-for="(err, i) in errors" :key="i">{{ err }}</li>
    </ul>
  </div>
</template>
