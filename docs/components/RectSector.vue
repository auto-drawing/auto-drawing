<template>
  <div id="div0" class="canvas-wrapper"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
onMounted(() => {
  const width = 688
  const height = 400
  const zr = createCanvas('div0', {
    width,
    height
  })
  const baseOptions = { x: 200, y: 140 }
  const gp = createGroup(baseOptions)
  const data = [
    {
      type: 'line',
      zlevel: 1,
      x1: 32,
      y1: 62,
      x2: 168,
      y2: 62,
      stroke: '#f8f8b8'
    },
    {
      type: 'line',
      zlevel: 1,
      x1: 168,
      y1: 62,
      x2: 168,
      y2: 139,
      stroke: '#f8f8b8'
    },
    {
      type: 'line',
      zlevel: 1,
      x1: 168,
      y1: 139,
      x2: 32,
      y2: 139,
      stroke: '#f8f8b8'
    },
    {
      type: 'line',
      zlevel: 1,
      x1: 32,
      y1: 139,
      x2: 32,
      y2: 62,
      stroke: '#f8f8b8'
    },
    {
      type: 'rect',
      zlevel: 0,
      x: 135,
      y: 76,
      width: 40,
      height: 50,
      fill: '#00ff01',
      stroke: '#00ff01'
    },
    {
      type: 'sector',
      cx: 100,
      cy: 96,
      r: 100,
      r0: 0,
      startAngle: 0,
      endAngle: 90,
      fill: 'yellow',
      clockwise: true
    }
  ]
  renderCanvas(zr, gp, data, {
    scale: true,
    translate: true
  })
})
</script>
