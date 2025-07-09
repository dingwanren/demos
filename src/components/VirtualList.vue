<template>
  <div 
    ref="containerRef" 
    class="virtual-list-container" 
    @scroll="handleScroll"
  >
    <div 
      class="virtual-list-phantom" 
      :style="{ height: `${totalHeight}px` }" 
    />
    <div 
      class="virtual-list-content" 
      :style="{ transform: `translateY(${offset}px)` }"
    >
      <div 
        v-for="item in visibleData" 
        :key="getKey(item)"
        class="virtual-list-item"
        :data-dom-index="getKey(item)"
        :style="{ height: `${getItemSize(item)}px` }"
      >
        <slot :item="item" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted,onBeforeUnmount, watch } from 'vue'

interface VirtualListProps<T> {
  listData: T[]
  itemSize: number | ((item: T) => number)
  bufferSize?: number
  itemKey?: string | ((item: T) => string | number)
}

const props = withDefaults(defineProps<VirtualListProps<any>>(), {
  bufferSize: 2,
  itemKey: 'id'
})

const emit = defineEmits(['scroll'])

const containerRef = ref<HTMLElement | null>(null)
const startIndex = ref(0)
const endIndex = ref(0)
const offset = ref(0)

// 获取唯一键
const getKey = computed(() => {
  return typeof props.itemKey === 'function' 
    ? props.itemKey 
    : (item: any) => item[props.itemKey]
})

// 获取每一项高度
const getItemSize = computed(() => {
  return typeof props.itemSize === 'function' 
    ? props.itemSize 
    : () => props.itemSize
})

// 容器高度
const containerHeight = ref(0)
// 可见项数量
const visibleCount = computed(() => {
  if (typeof props.itemSize === 'function') {
    let count = 0
    let totalHeight = 0
    while (totalHeight < containerHeight.value && startIndex.value + count < props.listData.length) {
      totalHeight += getItemSize.value(props.listData[startIndex.value + count])
      count++
    }
    return count
  }
  return Math.ceil(containerHeight.value / props.itemSize)
})

// 列表总高度
const totalHeight = computed(() => {
  if (typeof props.itemSize === 'function') {
    return props.listData.reduce((sum, item) => sum + getItemSize.value(item), 0)
  }
  return props.listData.length * props.itemSize
})

// 可见数据
const visibleData = computed(() => {
  return props.listData.slice(startIndex.value, endIndex.value + 1)
})

// 处理滚动
const handleScroll = () => {
  if (!containerRef.value) return
  
  const scrollTop = containerRef.value.scrollTop
  
  // 计算起始索引
  if (typeof props.itemSize === 'function') {
    let sum = 0
    let newStartIndex = 0
    for (let i = 0; i < props.listData.length; i++) {
      sum += getItemSize.value(props.listData[i])
      if (sum >= scrollTop) {
        newStartIndex = i
        break
      }
    }
    startIndex.value = Math.max(0, newStartIndex - props.bufferSize)
  } else {
    startIndex.value = Math.floor(scrollTop / props.itemSize) - props.bufferSize
    startIndex.value = Math.max(0, startIndex.value)
  }
  
  // 计算结束索引
  endIndex.value = startIndex.value + visibleCount.value + props.bufferSize * 2
  endIndex.value = Math.min(props.listData.length - 1, endIndex.value)
  
  // 计算偏移量
  if (typeof props.itemSize === 'function') {
    offset.value = props.listData
      .slice(0, startIndex.value)
      .reduce((sum, item) => sum + getItemSize.value(item), 0)
  } else {
    offset.value = startIndex.value * props.itemSize
  }
  
  emit('scroll', { scrollTop, startIndex: startIndex.value, endIndex: endIndex.value })
}

// 初始化
const init = () => {
  if (containerRef.value) {
    containerHeight.value = containerRef.value.clientHeight
    handleScroll()
  }
}

// 监听数据变化
watch(() => props.listData, init, { deep: true })

onMounted(() => {
  init()
  window.addEventListener('resize', init)
})

// 卸载时清除事件
onBeforeUnmount(() => {
  window.removeEventListener('resize', init)
})
</script>

<style scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  height: 100%;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
  background: rgba(255,0,0,0.1); /* 给占位元素加颜色 */
}

.virtual-list-content {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(0,255,0,0.1); /* 给内容容器加颜色 */
  right: 0;
}

.virtual-list-item {
  position: relative;
}
</style>