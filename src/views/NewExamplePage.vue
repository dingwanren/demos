<template>
<h2>图片光圈</h2>
<div class="image-container" style="margin-top: 50px;">
  <!-- 清晰图片层 -->
  <img width="600" src="https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="清晰图片">
</div>
</template>

<script setup lang="ts">

</script>

<style scoped>
.image-container {
  position: relative;
  display: inline-block; /* 保持图片尺寸 */
}

.image-container img {
  position: relative;
  z-index: 1; /* 确保清晰层在上层 */
  border-radius: 4px; /* 可选：添加圆角使效果更自然 */
}

.image-container::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  background: url("https://images.pexels.com/photos/2286895/pexels-photo-2286895.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2") center/cover; /* 模糊层背景图 */
  filter: blur(8px) brightness(0.9); /* 模糊+亮度调整 */
  transform: translate(-50%, -50%) scale(1.2); /* 放大并居中 */
  z-index: 0; /* 底层 */
  mix-blend-mode: multiply;
  opacity: 1; /* 透明度控制融合强度 */
  border-radius: 4px; /* 与上层保持一致 */
}
</style>"