<template>
  <div id="div3" class="canvas-wrapper"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
onMounted(() => {
  const width = 688
  const height = 300
  const zr = createCanvas('div3', {
    width,
    height
  })
  const baseOptions = { x: width / 2, y: height / 2 }
  const gp = createGroup(baseOptions)
  const data = [
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: -107.46,
          y: 52.14,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: -107.46,
          y: 22.26,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: -107.46,
          y: -7.62,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: -107.46,
          y: -37.5,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: -107.46,
          y: -67.38,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: 76.98,
          y: -67.38,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: 76.98,
          y: -37.5,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: 76.98,
          y: -7.62,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: 76.98,
          y: 22.26,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1,
          x: 76.98,
          y: 52.14,
          width: 30.48,
          height: 15.24,
          fill: 'green',
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'polyline',
          points: [
            [72, -81.6],
            [72, 81.6],
            [-60, 81.6],
            [-72, 69.6],
            [-72, -81.6],
            [72, -81.6],
            [72, -81.6]
          ],
          stroke: 'green',
          lineWidth: 0.5,
          zlevel: 10
        }
      ]
    },
    { type: 'line', zlevel: 1, x1: -10, y1: 0, x2: 10, y2: 0, stroke: 'green' },
    { type: 'line', zlevel: 1, x1: 0, y1: 10, x2: 0, y2: -10, stroke: 'green' }
  ]
  renderCanvas(zr, gp, data, {
    scale: true,
    translate: true
  })
})
</script>
