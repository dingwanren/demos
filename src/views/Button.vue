<template>
  <button
   @click="onClick"
   @mouseenter="onEnter"
  >
   sayhello
   </button>
</template>

<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(['click', 'custom-event'])
const onClick = () => {
  emit('click')
}
const onEnter = () => {
  emit('custom-event')
}

</script>