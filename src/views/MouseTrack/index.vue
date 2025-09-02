<template>
  <canvas ref="canvasRef" class="trailing-canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

import type { Ref } from 'vue'

type Point = { x: number, y: number }

const canvasRef = ref<HTMLCanvasElement | null>(null)
const points: Point[] = []
const maxTrailLength = 40 // 拖尾长度
let ctx: CanvasRenderingContext2D | null = null
let dpr = 1

let animationId = 0

const resizeCanvas = () => {
  if (!canvasRef.value) return
  // 兼容高DPR屏
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
}

const draw = () => {
  if (!ctx) return
  // 清空画布
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

  if (points.length < 2) {
    animationId = requestAnimationFrame(draw)
    return
  }

  ctx.save()
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = '#36adf7'
  ctx.lineWidth = 4

  ctx.beginPath()
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    if (i === 0) {
      ctx.moveTo(p0.x, p0.y)
    }
    ctx.lineTo(p1.x, p1.y)
  }
  ctx.stroke()
  ctx.restore()

  // 绘制渐隐（alpha）拖尾
  for (let i = 0; i < points.length - 1; i++) {
    const alpha = (i + 1) / points.length
    ctx.save()
    ctx.strokeStyle = `rgba(54, 173, 247, ${alpha})`
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(points[i].x, points[i].y)
    ctx.lineTo(points[i + 1].x, points[i + 1].y)
    ctx.stroke()
    ctx.restore()
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