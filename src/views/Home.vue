<template>
  <h2>HomeView</h2>
  <Button v-on="item.events"></Button>
  <!-- <button v-on="item.events">sayhello</button> -->
</template>

<script setup lang="ts">
import Button from './Button.vue'

const hello = () => {
  console.log('Hello from HomeView!')
}
const item = {
  events: {
    click: hello,
    'custom-event': () => { console.log('enter') }
  }
}

</script>