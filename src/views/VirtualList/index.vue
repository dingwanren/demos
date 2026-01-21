<template>
  <div class="page-VirtualList">
    <!-- 调试器, 可选择虚拟列表类型 -->
    <div class="config-panel">
      <template v-for="option in options" :key="option.value">
        <input
          type="radio"
          :id="option.value"
          :name="option.name"
          :value="option.value"
          v-model="selectedValue"
          :checked="selectedValue === option.value"
          @change="handleChange($event, option.value)" />
        <label :for="option.value">
          {{ option.label }}
        </label>
      </template>
    </div>

    <!-- 定高,可以去输入高度 -->
    <div class="example-area">
      <component :is="currentList"></component>
    </div>
  </div>
</template>

<script setup lang="ts">
  // 宽度一般相同
  // 1. 定高虚拟列表
  // 2. 不定高虚拟列表
  // 3. 双列虚拟列表
  // 4. (终极)类似钉钉文档大数据量表格的水平垂直虚拟列表
  // https://dorshinar.me/posts/infinite-scroll-hook
  // https://addyosmani.com/blog/infinite-scroll-without-layout-shifts/
  // https://tanstack.com/query/latest/docs/framework/react/examples/load-more-infinite-scroll?panel=code

  import { computed, ref } from 'vue';
  import firstDemo from './firstDemo/index.vue';
  import fixed from './fixed/index.vue';

  interface RadioOption {
    value: string;
    label: string;
    name: string;
  }

  const options: RadioOption[] = [
    { value: 'firstDemo', label: '最初的实现', name: 'vList' },
    { value: 'fixed', label: '定高虚拟列表', name: 'vList' },
    { value: 'unfixed', label: '不定高虚拟列表', name: 'vList' },
    { value: 'doubleCol', label: '双列虚拟列表', name: 'vList' },
  ];

  const selectedValue = ref<string>('fixed');
  const handleChange = (event: Event, value: string) => {
    // 占位,下面代码ai给的,但有v-model,不用手动改了
    const target = event.target as HTMLInputElement;
    if (target.checked) {
      // selectedValue.value = value;
      console.log('选中了:', value);
      // 执行相关逻辑
    }
  };

  const currentList = computed(() => {
    return {
      firstDemo,
      fixed
    }[selectedValue.value];
  });
</script>

<style scoped>
  .page-VirtualList {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .example-area {
    height: 85vh;
    width: 75vw;
  }
</style>
