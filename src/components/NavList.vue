<template>
  <div class="nav-container">
    <!-- 使用 Iconify 的汉堡菜单按钮 -->
    <button class="menu-toggle" @click="toggleMenu" ref="menuButton" @mousedown="handleMouseDown">
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
import { ref, onMounted, onBeforeUnmount, useTemplateRef } from 'vue'
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

// 处理 esc 键关闭菜单
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

// 定义菜单按钮的引用
const menuButton = useTemplateRef<HTMLButtonElement>('menuButton')

// 拖拽状态
const isDragging = ref(false)
const startX = ref(0) // 鼠标按下时的X坐标
const startLeft = ref(0) // 鼠标按下时元素的left值

// 处理鼠标按下事件
const handleMouseDown = (e: MouseEvent) => {
  // 只有当按下 Ctrl (或 Alt) 键时才开始拖拽，防止与点击事件冲突
  // 你可以根据需要选择 CtrlKey, AltKey, ShiftKey 或 MetaKey (Command on Mac)
  if (!e.ctrlKey) return // 改为 e.altKey 如果想用 Alt 键

  // 阻止默认行为（如文本选择）
  e.preventDefault()

  // 记录初始状态
  isDragging.value = true
  startX.value = e.clientX
  // 获取当前元素的 left 值（考虑可能的 transform 或其他定位）
  const rect = menuButton.value?.getBoundingClientRect()
  if (rect) {
    // 我们需要将相对视口的位置转换为相对于其定位上下文（这里是视口）的 left 值
    // 因为它是 fixed 定位，left 是相对于视口的
    // getComputedStyle 可以获取应用了所有样式后的计算值
    const computedStyle = window.getComputedStyle(menuButton.value!)
    const currentLeft = parseFloat(computedStyle.left) || 0
    startLeft.value = currentLeft
  }

  // 添加全局事件监听器，确保即使鼠标移出元素也能继续拖拽和结束拖拽
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
}

// 处理鼠标移动事件（拖拽中）
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging.value) return

  // 计算鼠标在水平方向上的位移
  const deltaX = e.clientX - startX.value

  // 计算新的 left 值
  let newLeft = startLeft.value + deltaX

  // 可选：添加边界限制，防止元素移出视口
  // 获取视口宽度和元素宽度
  const viewportWidth = window.innerWidth
  const elementWidth = menuButton.value?.offsetWidth || 0

  // 限制在视口内：不能小于 0（左边界），不能大于 (viewportWidth - elementWidth)（右边界）
  newLeft = Math.max(0, Math.min(newLeft, viewportWidth - elementWidth))

  // 更新元素的 left 样式
  if (menuButton.value) {
    menuButton.value.style.left = `${newLeft}px`
    // 注意：这会覆盖内联样式。如果初始 left 不是通过内联样式设置的，
    // 可能需要考虑其他方式（如 CSS 类或 CSS 变量），但内联样式在此场景下是直接有效的。
  }
}

// 处理鼠标松开事件（结束拖拽）
const handleMouseUp = () => {
  if (isDragging.value) {
    isDragging.value = false
    // 移除全局事件监听器
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
}


onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.body.classList.remove('no-scroll')

  if (isDragging.value) {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }
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
