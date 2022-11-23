<script setup>
defineProps({ employees: Array });
const emit = defineEmits(['remove']);
</script>

<template>
  <div>
    <div v-show="employees.length > 0">
      <div class="row justify-content-center mt-4">
        <div
          class="card p-2 m-2 bg-light"
          style="width: 18rem"
          v-for="e in employees"
          :key="e.email"
        >
          <img :src="e.picture.large" class="mx-auto d-block" alt="picture of employee" />
          <div class="mx-auto d-block mt-2">
            <h5 class="text-center mt-1 mb-3">{{ e.name.first }} {{ e.name.last }}</h5>
            <span class="small text-secondary">
              <i class="fa-solid fa-envelope me-2"></i> {{ e.email }}
            </span>
            <br />
            <span class="small text-secondary"
              ><i class="fa-solid fa-phone me-2"></i> {{ e.phone }}</span
            >
          </div>
          <button
            @click="emit('remove', e.id)"
            class="btn btn-sm btn-outline-danger mx-auto d-block mt-3"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
img {
  width: 13rem;
}
</style>
