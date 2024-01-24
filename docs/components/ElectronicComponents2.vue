<template>
  <div id="div2" class="canvas-wrapper"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
onMounted(() => {
  const width = 688
  const height = 300
  const zr = createCanvas('div2', {
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
          x: -75.856,
          y: 31.344,
          width: 32.512,
          height: 32.512,
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
          x: 43.344,
          y: 31.344,
          width: 32.512,
          height: 32.512,
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
          x: 43.344,
          y: -63.856,
          width: 32.512,
          height: 32.512,
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
          x: -75.856,
          y: -63.856,
          width: 32.512,
          height: 32.512,
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
            [-81.28, -70.096],
            [81.28, -70.096],
            [81.28, 70.096],
            [-81.28, 70.096],
            [-81.28, 8],
            [-75.2, 8],
            [-75.2, 8],
            [-75.2, 8],
            [-72.464, 7.52],
            [-70.048, 6.128],
            [-68.272, 4],
            [-67.312, 1.392],
            [-67.312, -1.392],
            [-68.272, -4],
            [-70.048, -6.128],
            [-72.464, -7.52],
            [-75.2, -8],
            [-81.28, -8],
            [-81.28, -70.096],
            [-81.28, -70.096]
          ],
          stroke: 'green',
          lineWidth: 0.5,
          zlevel: 10
        }
      ]
    },
    {
      type: 'line',
      zlevel: 100,
      x1: -10,
      y1: 0,
      x2: 10,
      y2: 0,
      stroke: 'green'
    },
    {
      type: 'line',
      zlevel: 100,
      x1: 0,
      y1: 10,
      x2: 0,
      y2: -10,
      stroke: 'green'
    }
  ]
  renderCanvas(zr, gp, data, {
    scale: true,
    translate: true
  })
})
</script>
