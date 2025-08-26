<template>
  <div class="layout">
    <NavList />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
  import NavList from './components/NavList.vue';
</script>

<style scoped>
  .layout {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  .content {
    flex: 1;
    height: 100vh;
    overflow-y: auto;
    box-sizing: border-box;
    position: relative;
  }
</style>
