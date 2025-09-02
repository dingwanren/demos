<template>
  <div class="mouse-track">
    <h1>Mouse Track</h1>
    <canvas ref="canvasRef" class="trailing-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

type Point = { x: number, y: number }

const canvasRef = ref<HTMLCanvasElement | null>(null)
const points: Point[] = []
const maxTrailLength = 40

let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let animationId = 0

// 新增自动收缩相关
const lastMoveTimestamp = ref(Date.now())
const trailAutoHide = 100   // 鼠标静止超过100ms后拖尾开始收缩
const trailShrinkSpeed = 2  // 每帧收缩2个点

const resizeCanvas = () => {
  if (!canvasRef.value) return
  dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  canvasRef.value.width = w * dpr
  canvasRef.value.height = h * dpr
  canvasRef.value.style.width = w + 'px'
  canvasRef.value.style.height = h + 'px'
  ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)
  }
}

const onMouseMove = (e: MouseEvent) => {
  const x = e.clientX
  const y = e.clientY
  points.push({ x, y })
  if (points.length > maxTrailLength) {
    points.splice(0, points.length - maxTrailLength)
  }
  lastMoveTimestamp.value = Date.now()
}

const draw = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  if (points.length >= 2) {
    ctx.save()
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'

    // 绘制渐隐效果拖尾
    for (let i = 0; i < points.length - 1; i++) {
      const alpha = (i + 1) / points.length
      ctx.strokeStyle = `rgba(54, 173, 247, ${alpha})`
      ctx.lineWidth = 4
      ctx.beginPath()
      ctx.moveTo(points[i].x, points[i].y)
      ctx.lineTo(points[i + 1].x, points[i + 1].y)
      ctx.stroke()
      ctx.closePath()
    }
    ctx.restore()
  }

  // 自动收缩拖尾
  const now = Date.now()
  if (now - lastMoveTimestamp.value > trailAutoHide && points.length > 0) {
    points.splice(0, Math.min(trailShrinkSpeed, points.length))  // 删掉前面的点, 保留后加入的新点
  }

  animationId = requestAnimationFrame(draw)
}

onMounted(() => {
  resizeCanvas()
  window.addEventListener('resize', resizeCanvas)
  window.addEventListener('mousemove', onMouseMove)
  animationId = requestAnimationFrame(draw)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCanvas)
  window.removeEventListener('mousemove', onMouseMove)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.trailing-canvas {
  position: fixed;
  left: 0; top: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 9999;
  background: transparent;
}
</style>