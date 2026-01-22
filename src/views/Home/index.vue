<template>
  <div class="pages-home">
    <h2>HomeView</h2>
    <Button v-on="item.events"></Button>
    <!-- <button v-on="item.events">sayhello</button> -->
    <Teleport to="body">
      <button
        class="show-btn"
        @click="() => (isBackDropShow = !isBackDropShow)"
        @mouseenter="() => (isShow = true)"
        @mouseleave="() => (isShow = false)">
        x
      </button>
      <div v-show="isShow" class="backdrop-container">
        <div class="backdrop" :class="{ big: isBackDropShow }"></div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';
  import Button from './Button.vue';

  const isShow = ref(false);
  const isBackDropShow = ref(false);
  const hello = () => {
    console.log('Hello from HomeView!');
  };
  const item = {
    events: {
      click: hello,
      'custom-event': () => {
        console.log('enter');
      },
    },
  };
</script>

<style>
  .pages-home {
    position: relative;
  }
  .show-btn {
    position: absolute;
    right: 30px;
    top: 30px;
    z-index: 99;
  }
  .backdrop-container {
    position: absolute;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  .backdrop {
    height: 20px;
    width: 20px;
    background: red;
    border-radius: 50%;
    transition: transform 0.5s ease-in-out;
    position: absolute;
    right: 0;
    top: 0;
    transform: scale(0);
  }
  .big {
    transform: scale(200);
  }
</style>
