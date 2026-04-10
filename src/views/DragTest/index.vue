<template>
  <div class="page-DragTest">
    <h2>面试题 拖拽排序</h2>
    <!-- ==================== TODO 需求展示 ==================== -->
    <div class="todo-box">
      <strong>TODO:</strong> 实现一个拖拽排序功能
      <div class="requirements">
        <div>✓ 1. 支持鼠标拖拽</div>
        <div>✓ 2. 实时显示拖拽位置</div>
        <div>✓ 3. 更新数据顺序</div>
      </div>
    </div>
    <!-- ======================================================= -->

    <!-- 
      【需求 1: 支持鼠标拖拽】实现思路:
      1. HTML 添加 draggable="true" 属性 - 让元素可被拖拽
      2. 监听 @dragstart 事件 - 记录开始拖拽的项
      3. 监听 @dragend 事件 - 清空拖拽状态
      
      【需求 2: 实时显示拖拽位置】实现思路:
      1. 监听 @dragover 事件 - 知道鼠标正悬停在哪个元素上方
      2. 用 .dragging 类名给原位置半透明效果 - 显示"从这里拿起"
      3. (可选) 用 .drag-over 类名高亮目标位置 - 显示"要放到这里"
      
      【需求 3: 更新数据顺序】实现思路:
      1. 监听 @drop 事件 - 获取放置的目标位置
      2. 使用数组 splice() 方法 - 从原位置移除，插入到新位置
      3. Vue 响应式自动更新视图 - 完成排序

        :class="{ 
          dragging: draggingIndex === index  // 需求 2: 拖拽中显示效果
        }"
        draggable="true"                      需求 1: 让元素可拖拽
        @dragstart="handleDragStart(index)"   需求 1: 记录拖拽源
        @dragend="handleDragEnd"              需求 1: 清空状态
        @dragover.prevent="handleDragOver(index)"   需求 2: 允许放置
        @drop="handleDrop(index)"             需求 3: 处理放置
    -->
    <div class="list">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="item"
        :class="{
          dragging: draggingIndex === index, // 需求 2: 拖拽中显示效果
        }"
        draggable="true"
        @dragstart="handleDragStart(index)"
        @dragend="handleDragEnd"
        @dragover.prevent="handleDragOver(index)"
        @drop="handleDrop(index)">
        <span class="handle">☰</span>
        {{ item.name }}
        <span class="index-badge">{{ index + 1 }}</span>
      </div>
    </div>

    <!-- 实时显示当前顺序，验证需求 3 -->
    <div class="result">
      <strong>当前顺序:</strong> {{ list.map((i) => i.name).join(' → ') }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref } from 'vue';

  interface Item {
    id: number;
    name: string;
  }

  // 列表数据
  const list = ref<Item[]>([
    { id: 1, name: '项目 A' },
    { id: 2, name: '项目 B' },
    { id: 3, name: '项目 C' },
    { id: 4, name: '项目 D' },
    { id: 5, name: '项目 E' },
  ]);

  // ========== 状态管理 ==========

  /**
   * 记录正在拖拽的元素索引
   * 作用:
   * - 拖拽开始时记录"拿起的是哪一项"
   * - 拖拽过程中用这个值给对应元素添加 .dragging 类名
   * - 拖拽结束时清空
   */
  const draggingIndex = ref<number | null>(null);

  // ========== 事件处理函数 ==========

  /**
   * 【需求 1】拖拽开始
   * 当用户按下鼠标开始拖拽时触发
   * @param index 被拖拽元素的索引
   */
  const handleDragStart = (index: number) => {
    // 记录当前拖拽的是哪一项，后续 drop 时要用
    draggingIndex.value = index;
  };

  /**
   * 【需求 1】拖拽结束
   * 当用户松开鼠标或拖拽取消时触发
   * 清理状态，移除 .dragging 类名
   */
  const handleDragEnd = () => {
    draggingIndex.value = null;
  };

  /**
   * 【需求 2】拖拽经过
   * 当拖拽物在某个元素上方移动时持续触发
   *
   * 关键点: event.preventDefault() 必须调用!
   * 原因: 浏览器默认不允许在元素上放置，必须阻止默认行为
   *
   * @param index 鼠标正悬停的元素索引
   */
  const handleDragOver = (index: number) => {
    console.log(index);
    
    // .prevent 修饰符已经调用了 event.preventDefault()
    // 这里可以添加逻辑来高亮目标位置（可选）
  };

  /**
   * 【需求 3】放置 - 核心排序逻辑
   * 当用户在某个元素上松开鼠标时触发
   *
   * 实现步骤:
   * 1. 获取拖拽源索引 (draggingIndex)
   * 2. 获取目标索引 (targetIndex)
   * 3. 使用 splice 移动数组元素:
   *    - 先从原位置删除
   *    - 再插入到新位置
   * 4. Vue 响应式自动更新视图
   *
   * @param targetIndex 放置目标的索引
   */
  const handleDrop = (targetIndex: number) => {
    const from = draggingIndex.value;

    // 无效拖拽：没有拖拽源 或 原地放下
    if (from === null || from === targetIndex) return;

    // 核心：数组元素移动
    // splice(位置，删除数量) 返回被删除的元素数组
    const [draggedItem] = list.value.splice(from, 1);

    // splice(位置，删除数量，插入元素) - 在目标位置插入
    list.value.splice(targetIndex, 0, draggedItem);
  };
</script>

<style scoped>
  .page-DragTest {
    padding: 20px;
    max-width: 500px;
    margin: 0 auto;
  }

  /* TODO 展示框样式 */
  .todo-box {
    padding: 15px;
    background: #fff7e6;
    border: 1px solid #ffd591;
    border-radius: 6px;
    margin: 20px 0;
  }

  .todo-box .requirements {
    margin-top: 10px;
    padding-left: 20px;
    color: #52c41a;
    font-size: 14px;
  }

  .todo-box .requirements div {
    margin: 5px 0;
  }

  /* 列表容器 */
  .list {
    margin-top: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 10px;
    background: #fafafa;
  }

  /* 列表项 */
  .item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    margin: 8px 0;
    background: #fff;
    border: 1px solid #eee;
    border-radius: 6px;
    cursor: grab; /* 鼠标变成"抓取"手势 */
    transition: all 0.2s;
    user-select: none; /* 防止拖拽时文字被选中 */
  }

  .item:hover {
    border-color: #409eff;
    box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
  }

  /* 
  【需求 2 核心】拖拽中的视觉效果
  当 draggingIndex === index 时应用此样式
  效果：半透明 + 背景变灰 = 看起来像"被拿起来了"
*/
  .item.dragging {
    opacity: 0.4; /* 透明度降低，像被拿起来的影子 */
    background: #f0f0f0; /* 背景变灰 */
    transform: scale(0.98); /* 稍微缩小，增强"拿起"感 */
  }

  /* 拖拽手柄图标 */
  .handle {
    color: #999;
    margin-right: 12px;
    font-size: 18px;
    cursor: grab;
  }

  /* 序号徽章 */
  .index-badge {
    margin-left: auto;
    padding: 3px 10px;
    background: #e6f7ff;
    color: #1890ff;
    border-radius: 12px;
    font-size: 13px;
    font-weight: bold;
  }

  /* 结果展示 */
  .result {
    margin-top: 20px;
    padding: 15px;
    background: #f5f7fa;
    border-radius: 6px;
    font-family: 'Consolas', monospace;
    border: 1px solid #e0e0e0;
  }
</style>
