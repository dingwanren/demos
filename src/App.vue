<template>
  <div class="layout">
    <nav class="sidebar">
      <RouterLink to="/chart-example">饼图示例</RouterLink>
      <RouterLink to="/bar-chart-example">柱状图示例</RouterLink>
      <RouterLink to="/advanced-search-example">高级搜索组件示例</RouterLink>
      <RouterLink to="/virtual-column-example">虚拟列表示例</RouterLink>
      <RouterLink to="/new-example">图片光圈(伪类实现)</RouterLink>
      <RouterLink to="/poker-carousel">扑克轮播</RouterLink>
      <router-link to="/animation">动画示例</router-link>
    </nav>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">

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

nav a {
  display: block;
  margin-bottom: 10px;
  text-decoration: none;
  color: #333;
}

nav a:hover {
  color: #007bff;
  background-color: #e0e0e0;
  border-radius: 4px;
}

nav a.router-link-active {
  color: #ffffff;
  background-color: #007bff;
  border-radius: 4px;
  font-weight: 600;
}
</style>