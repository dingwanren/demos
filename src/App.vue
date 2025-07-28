<template>
  <div class="layout">
    <NavList />
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import NavList from './components/NavList.vue'

</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background-color: #f0f0f0;
  padding: 20px;
  height: 100vh;
  box-sizing: border-box;
}

.content {
  flex: 1;
  padding: 20px;
  height: 100vh;
  overflow-y: auto;
  box-sizing: border-box;
}
</style>