<template>
  <VirtualList
    :list-data="bigList"
    :item-size="getItemHeight"
    :buffer-size="10"
    item-key="id"
    @scroll="handleScroll"
  >
    <template #default="{ item }">
      <div class="custom-item" :style="{ height: `${getItemHeight(item)}px` }">
        <h3>{{ item.title }}</h3>
        <p>{{ item.description }}</p>
        <img :src="item.image" />
      </div>
    </template>
  </VirtualList>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import VirtualList from '../components/VirtualList.vue'
import { generateMockList } from '../mock/mockData'

interface ListItem {
  id: string
  title: string
  description: string
  image: string
  // 其他属性...
}

// 生成 1000 条数据，带图片，前 2 条置顶
const bigList = ref(generateMockList(1000, { 
  withImages: true, 
  pinnedItems: 2,
  maxDescriptionLength: 150 
}))

const getItemHeight = (item: ListItem) => {
  // 动态计算高度逻辑
  return 80 + Math.floor(item.description.length / 50) * 20
}

const handleScroll = ({ scrollTop, startIndex, endIndex }: { 
  scrollTop: number
  startIndex: number
  endIndex: number 
}) => {
  console.log('当前滚动位置:', scrollTop)
  console.log('渲染范围:', startIndex, '~', endIndex)
}
</script>

<style scoped>
.custom-item {
  padding: 16px;
  border-bottom: 1px solid #eee;
}
</style>