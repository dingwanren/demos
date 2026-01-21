<template>
  <div class="outer-wrapper" ref="outerWrapper" @scroll="handleScroll">
    <!-- placeholder 用于撑开容器,随着数据越来越多时,容器滚动条应越来越小,但不用这个撑开的话,往上滚的时候translateY变小后,滚动条会变大 -->
    <div class="placeholder" :style="{ height: `${totalHeight}px` }"></div>
    <!-- render-wrapper 渲染内容的容器，只渲染固定数量内容，同时进行偏移 -->
    <div
      class="render-wrapper"
      :style="{ transform: `translateY(${offsetY}px)` }">
      <div
        class="render-item"
        :style="{ height: `${itemHeight}px` }"
        v-for="item in dataToRender">
        {{ item }}
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref, useTemplateRef } from 'vue';

  // 固定高度虚拟列表
  const { itemHeight = 50 } = defineProps<{
    itemHeight?: number; // 行高
  }>();

  const outerWrapper = useTemplateRef<HTMLDivElement>('outerWrapper');
  const pageNum = ref<number>(0);
  const bufferNum = 3;
  const startIndex = ref<number>(0);
  const endIndex = ref<number>(0);
  // 这里算数量和visiableStart相加和先用高度计算出下标有区别吗
  // const renderNum = computed(() => { // 应该要根据整个容器高度除以每个高度,再预留几个的缓冲的位置相加得出
  //   if (!outerWrapper.value) return 20
  //   const h =  outerWrapper.value.getBoundingClientRect().height
  //   return Math.ceil(h / itemHeight)
  // })
  const offsetY = ref<number>(0); // 记录 render 容器应该偏移的距离, 这里可以计算出上下padding来撑开整个容器;但这里用占位+translateY,这css属性有gpu优化
  const originData = ref<number[]>([]);
  const totalHeight = computed(() => itemHeight * originData.value.length) // 撑开容器的高度

  // const dataToRender = new Array(10000).fill(10); // 直接渲染,切换时会有1s卡顿,拉到滚动条会白屏一会,f12风扇会起飞
  const dataToRender = computed(() => {
    return originData.value.slice(startIndex.value, endIndex.value);
  });

  /**
   * 模拟分页请求数据
   * @param page 页码
   * @param pageSize 分页大小
   * @param delay 是否模拟延迟
   */
  const fetchData = (
    page: number = 0,
    pageSize: number = 50,
    delay: boolean = false
  ): void => {
    if (delay) {
      setTimeout(() => {
        for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
          originData.value.push(i);
        }
      }, 300);
    } else {
      for (let i = page * pageSize; i < (page + 1) * pageSize; i++) {
        originData.value.push(i);
      }
      console.log(originData.value);
    }
  };

  const handleScroll = () => {
    if (!outerWrapper.value) return;

    const containerHeight = outerWrapper.value.getBoundingClientRect().height;
    const scrollTop = outerWrapper.value.scrollTop;
    offsetY.value = scrollTop;
    // 计算可视区域的起始和结束索引
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.ceil((scrollTop + containerHeight) / itemHeight);
    // 加上缓冲区
    const bufferStart = Math.max(0, visibleStart - bufferNum);
    const bufferEnd = visibleEnd + bufferNum;
    // 更新范围（如果变化了）
    if (visibleStart !== bufferStart || visibleEnd !== bufferEnd) {
      startIndex.value = bufferStart;
      endIndex.value = bufferEnd;
    }

    const scrollHeight = outerWrapper.value.scrollHeight;

    if (scrollHeight - 40 < containerHeight + scrollTop) {
      fetchData(pageNum.value++);
    }
  };

  onMounted(() => {
    fetchData(pageNum.value++);
    handleScroll();
    window.addEventListener('resize', handleScroll)
  });

  onUnmounted(() => {
    window.removeEventListener('resize', handleScroll)
  })
</script>

<style>
  .outer-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
    overflow-y: auto;
  }

  .placeholder {
    visibility: hidden;
  }

  .render-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    will-change: transform;
    backface-visibility: hidden; /* 性能优化 */
  }
</style>
