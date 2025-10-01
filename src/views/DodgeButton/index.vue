<template>
  <div class="page-DodgeButton">
    <h1>会躲避的按钮</h1>
    <p>give me 100 dollars?yes or no------- no Count: {{ noClickCount }}</p>
    <!-- 页面内容 -->
    <div class="container" ref="container" @mousemove="handlerMouseEnter">
      <button class="btn yes-btn">yes</button>
      <button
        class="btn no-btn"
        :style="{ '--top': `${top}px`, '--left': `${left}px` }"
        @click="handleNoClick"
      >
        no
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref, useTemplateRef } from 'vue';
  const top = ref(10);
  const left = ref(10);
  const noClickCount = ref(0);

  const container = useTemplateRef('container');
  const containerXY = computed(() => {
    const rect = container.value.getBoundingClientRect();
    return {
      left: rect.left,
      top: rect.top,
    };
  });
  // 容器mouseenter 获取鼠标xy坐标
  // top left和button固定宽度可得按钮区域,可以上下左右再+10px 提前判断进去区域
  // 进去即 随机改变 top left 值躲避鼠标,但感觉可以以鼠标位置为圆,某个值为半径,限制改变后的位置需在此区域外
  function handlerMouseEnter(e: EventTarget) {
    // 这里类型是啥

    // 鼠标在容器的里相对位置
    //  offsetXY进入子元素后,原点就变成了子元素了,我想要一直以父元素为原点的
    const mouseX = e.offsetX;
    const mouseY = e.offsetY;
      console.log(mouseX, mouseY, top.value, left.value);

    if (
      top.value + 40 + 5 >= mouseY && // 下
      mouseY + 5 >= top.value &&  // 上
      left.value + 60 + 5 >= mouseX && // 右
      mouseX + 5 >= left.value // 左
    ) {
      // 进入区域了
      console.log('进入区域了', mouseX, mouseY, top.value, left.value);
      top.value = Math.random() * 400
      left.value = Math.random() * 400
    }
  }

  // function changePosition(x: number,y: number, radius: number) {
  //   // 升级版: 以鼠标xy为圆心, radius为半径,划出一个区域
  // }

  function changePosition() {}


  function handleNoClick () {
    noClickCount.value++
  }
</script>

<style scoped>
  .page-DodgeButton {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .page-DodgeButton .container {
    width: 400px;
    height: 400px;
    position: relative;
    border: 1px solid red;
  }

  .btn {
    width: 60px;
    height: 40px;
    padding: 9px;
    border: 1px solid transparent;
    margin: 0;
  }

  .yes-btn {
    background: green;
    color: aliceblue;
    position: absolute;
    top: 10px;
    left: 100px;
  }

  .no-btn {
    background: rgb(72, 72, 210);
    color: white;
    position: absolute;
    top: var(--top);
    left: var(--left);
  }
</style>
