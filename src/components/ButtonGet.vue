<script setup>
const emit = defineEmits(['getEmployees']);
</script>

<template>
  <div>
    <button class="btn btn-outline-primary" @click="emit('getEmployees')">Get Employees</button>
  </div>
</template>
