<template>
  <div class="mouse-track">
    <h1>Mouse Track</h1>

    <!-- 全屏 Canvas 作为拖尾效果的绘制画布 -->
    <canvas ref="canvasRef" class="trailing-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
  /*
    实现流程描述：

    1. 渲染一个全屏 Canvas，覆盖页面但不影响鼠标事件；
    2. 监听鼠标移动，把坐标点压入拖尾数组 points；
    3. 鼠标持续移动时，拖尾数组保持最多 maxTrailLength 个点，只保留最新的点；
    4. 使用 requestAnimationFrame 持续清空并重绘拖尾，拖尾以不同透明度渐隐显示；
    5. 鼠标静止超过 trailAutoHide 毫秒后，每帧自动从拖尾头部移除 trailShrinkSpeed 个点，拖尾逐渐收缩；
    6. 响应窗口变化自适应 Canvas 尺寸，高分屏适配；
    7. 组件卸载时清理所有事件监听和动画帧；
  */
  import { ref, onMounted, onBeforeUnmount } from 'vue';

  // 鼠标轨迹点的数据结构，包含 x, y 坐标
  type Point = { x: number; y: number };

  // Canvas 实例引用，响应式变量
  const canvasRef = ref<HTMLCanvasElement | null>(null);
  // 鼠标轨迹点的数组，时时更新拖尾
  const points: Point[] = [];
  // 拖尾最大长度（最多保留点数）
  const maxTrailLength = 40;

  // Canvas 2D 渲染上下文
  let ctx: CanvasRenderingContext2D | null = null;
  // 设备像素比，高分屏适配
  let dpr = 1;
  // 动画帧 id，用于取消 requestAnimationFrame
  let animationId = 0;

  // 自动收缩相关变量
  const lastMoveTimestamp = ref(Date.now()); // 最近一次鼠标移动时间
  const trailAutoHide = 100; // 静止触发自动收缩的时间阈（毫秒）
  const trailShrinkSpeed = 2; // 拖尾每帧收缩点数

  // Canvas 尺寸自适应和高分屏（Retina 屏）矫正
  const resizeCanvas = () => {
    if (!canvasRef.value) return; // 没有画布直接返回
    dpr = window.devicePixelRatio || 1; // 获取设备像素比
    const w = window.innerWidth; // 获取当前窗口宽
    const h = window.innerHeight; // 获取当前窗口高
    canvasRef.value.width = w * dpr; // 设置画布实际像素宽
    canvasRef.value.height = h * dpr; // 设置画布实际像素高
    canvasRef.value.style.width = w + 'px'; // 设置画布实际显示宽
    canvasRef.value.style.height = h + 'px'; // 设置画布实际显示高
    ctx = canvasRef.value.getContext('2d'); // 获取 2D 渲染上下文
    if (ctx) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置变换矩阵
      ctx.scale(dpr, dpr); // 按像素比放大，保证清晰
    }
  };

  // 鼠标移动事件处理：记录鼠标坐标到拖尾点数组
  const onMouseMove = (e: MouseEvent) => {
    const x = e.clientX; // 鼠标横坐标
    const y = e.clientY; // 鼠标纵坐标
    points.push({ x, y }); // 添加点到队尾
    // 拖尾点数量超过最大长度时，从头部删除多余点，保持队尾是最新
    if (points.length > maxTrailLength) {
      points.splice(0, points.length - maxTrailLength);
    }
    // 更新时间戳（用于判断鼠标是否静止）
    lastMoveTimestamp.value = Date.now();
  };

  // 拖尾效果的主动画循环
  const draw = () => {
    if (!ctx) return;
    // 每帧先清空整个画布
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    // 拖尾点至少有两个才能绘制线段
    if (points.length >= 2) {
      ctx.save(); // 保存当前状态（叠加属性或变换无影响其它绘制）
      ctx.lineJoin = 'round'; // 线段连接为圆角
      ctx.lineCap = 'round'; // 线段端点为圆角

      // 按点顺序，画出拖尾的每一小段，透明度跟点顺序渐变
      for (let i = 0; i < points.length - 1; i++) {
        // 计算当前段的透明度，越近队尾(alpha 越大)越不透明
        const alpha = (i + 1) / points.length;
        ctx.strokeStyle = `rgba(54, 173, 247, ${alpha})`; // 渐变色拖尾
        ctx.lineWidth = 4; // 线宽为 4px
        ctx.beginPath();
        ctx.moveTo(points[i].x, points[i].y); // 线起点
        ctx.lineTo(points[i + 1].x, points[i + 1].y); // 线终点
        ctx.stroke(); // 绘制线段
        ctx.closePath();
      }
      ctx.restore();
    }

    // 自动收缩拖尾：鼠标停止一段时间后，每帧收缩若干个点
    const now = Date.now();
    if (now - lastMoveTimestamp.value > trailAutoHide && points.length > 0) {
      // 删除拖尾数组头部 trailShrinkSpeed 个点
      points.splice(0, Math.min(trailShrinkSpeed, points.length));
    }

    // 下一帧继续动画
    animationId = requestAnimationFrame(draw);
  };

  // 组件挂载时，初始化画布与事件监听，并启动动画
  onMounted(() => {
    resizeCanvas(); // 初始 canvas 尺寸
    window.addEventListener('resize', resizeCanvas); // 窗口缩放时重设画布
    window.addEventListener('mousemove', onMouseMove); // 监听鼠标移动
    animationId = requestAnimationFrame(draw); // 启动动画循环
  });

  // 组件卸载时，清理所有事件与动画，避免内存泄漏
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeCanvas);
    window.removeEventListener('mousemove', onMouseMove);
    if (animationId) cancelAnimationFrame(animationId);
  });
</script>

<style scoped>
  .trailing-canvas {
    position: fixed; /* 固定全屏 */
    left: 0;
    top: 0;
    width: 100vw; /* 视口宽度 */
    height: 100vh; /* 视口高度 */
    pointer-events: none; /* 不干扰鼠标事件，相当于透明遮罩 */
    z-index: 9999; /* 高层级，避免被覆盖 */
    background: transparent; /* 透明背景 */
  }
</style>
