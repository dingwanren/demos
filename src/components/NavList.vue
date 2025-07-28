<template>
  <div class="nav-container">
    <!-- 使用 Iconify 的汉堡菜单按钮 -->
    <button class="menu-toggle" @click="toggleMenu">
      <Icon :icon="isMenuOpen ? 'mdi:close' : 'mdi:menu'" width="32" height="32" />
    </button>
    
    <!-- 全屏导航菜单 -->
    <transition name="fade">
      <div 
        v-if="isMenuOpen" 
        class="fullscreen-menu" 
        @keydown.esc="closeMenu" 
        tabindex="0"
        @click.self="closeMenu"
      >
        <nav class="nav-list">
          <RouterLink 
            v-for="item in navList" 
            :key="item.path" 
            :to="item.path"
            @click="closeMenu"
          >
            <span class="nav-item-content">
              <!-- 为每个导航项添加图标 -->
              <Icon :icon="item.icon" class="nav-icon" />
              <span class="nav-text">{{ item.name }}</span>
            </span>
          </RouterLink>
        </nav>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Icon } from '@iconify/vue'

const navList = ref([
  { name: '饼图示例', path: '/chart-example', icon: 'mdi:chart-pie' },
  { name: '柱状图示例', path: '/bar-chart-example', icon: 'mdi:chart-bar' },
  { name: '高级搜索组件示例', path: '/advanced-search-example', icon: 'mdi:card-search' },
  { name: '虚拟列表示例', path: '/virtual-column-example', icon: 'mdi:table-column' },
  { name: '图片光圈(伪类实现)', path: '/new-example', icon: 'mdi:image-filter-center-focus' },
  { name: '扑克轮播', path: '/poker-carousel', icon: 'mdi:cards-playing-outline' },
  { name: '动画示例', path: '/animation', icon: 'mdi:animation-play' },
])

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    document.body.classList.add('no-scroll')
  } else {
    document.body.classList.remove('no-scroll')
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.classList.remove('no-scroll')
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('no-scroll')
})
</script>

<style scoped>
/* 基础样式 */
.nav-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}

/* 菜单切换按钮样式 */
.menu-toggle {
  width: 32px;
  height: 32px;
  position: fixed;
  top: 20px;
  left: 20px;
  padding: 0;
  display: inline-block;
  cursor: pointer;
  background-color: transparent;
  border: 0;
  margin: 0;
  z-index: 1001;
  color: #333;
  transition: color 0.3s ease;
  outline: none; /* 移除默认轮廓 */
}

.menu-toggle:hover {
  color: #42b983;
}

/* 为键盘用户保留可见焦点 */
.menu-toggle:focus-visible {
  box-shadow: 0 0 0 2px #42b983;
}

/* 全屏菜单样式 */
.fullscreen-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.98);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  outline: none;
}

.nav-list {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  width: 80%;
  max-width: 600px;
}

.nav-list a {
  width: 100%;
  color: #333;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 15px 25px;
  border-radius: 8px;
  font-size: 1.5rem;
}

.nav-list a:hover {
  color: #42b983;
  background-color: rgba(0, 0, 0, 0.05);
  transform: translateX(10px);
}

.nav-item-content {
  display: flex;
  align-items: center;
  gap: 15px;
}

.nav-icon {
  font-size: 1.8rem;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 禁止滚动 */
.no-scroll {
  overflow: hidden;
}
</style>
