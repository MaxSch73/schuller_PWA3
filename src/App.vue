<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

import { comparer } from '@/utils/sort.js';
import { onlineTest } from '@/utils/onlineTest.js';

import ButtonGet from '@/components/ButtonGet.vue';
import CardView from '@/components/CardView.vue';

let employees = ref([]);
let update = ref(false);
let isOnline = ref(true);

const fetchEmployees = async () => {
  try {
    const { data } = await axios.get('/employees');
    employees.value = data.sort(({ name: objA }, { name: objB }) => comparer(objA.last, objB.last));
  } catch (error) {
    console.error(error);
    isOnline.value = false;
  }
};
const removeEmployee = async (id) => {
  const { status } = await axios.delete(`/employees/${id}`);
  if (status === 200) {
    employees.value = employees.value.filter((el) => el.id !== id);
  }
};

const onRestart = async () => {
  isOnline.value = await onlineTest();
  window.addEventListener('online', () => (isOnline.value = true));
  window.addEventListener('offline', () => (isOnline.value = false));
  const registration = await navigator.serviceWorker.getRegistration();
  if (registration) registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
  window.location.reload();
};

const sendHello = async () =>
  navigator.serviceWorker.controller?.postMessage({
    type: 'private message',
    info: 'Psst! This is your app!',
  });

const broadcast = new BroadcastChannel('whisper-channel');
broadcast.onmessage = (event) => {
  console.log(event.data);
};

onMounted(async () => {
  isOnline.value = await onlineTest();
  window.addEventListener('online', () => (isOnline.value = true));
  window.addEventListener('offline', () => (isOnline.value = false));
  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    console.log('registration failed!');
    return;
  }
  registration.addEventListener('updatefound', () => (update.value = true));
  if (registration.waiting) update.value = true;
});
</script>

<template>
  <div id="app" class="container d-flex flex-column justify-content-center align-items-center mt-3">
    <div
      class="alert alert-danger d-flex flex-column justify-content-center align-items-center"
      v-if="update"
    >
      <p>A new Update is available!!!</p>
      <button type="button" class="btn btn-outline-secondary" @click="onRestart">
        Restart Now!
      </button>
    </div>
    <div
      class="alert alert-danger d-flex flex-column justify-content-center align-items-center"
      v-if="!isOnline"
    >
      You are Offline!!!
    </div>
    <button @click="sendHello()" class="btn btn-outline-success m-2">Hallo</button>
    <ButtonGet @getEmployees="fetchEmployees"></ButtonGet>
    <CardView :employees="employees" :isOnline="isOnline" @remove="removeEmployee"></CardView>
  </div>
</template>

<style>
@font-face {
  font-family: 'Montserrat';
  font-weight: 400;
  font-style: normal;
  font-display: auto;
  unicode-range: U+000-5FF;
  src: local('Montserrat'), url('/fonts/Montserrat/Montserrat-Regular.ttf') format('truetype');
}

* {
  font-family: 'Montserrat', sans-serif;
}

a {
  text-decoration: none;
}
</style>
