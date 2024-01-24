<template>
  <div id="div5"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
onMounted(() => {
  const width = 688
  const height = 400
  const zr = createCanvas('div5', {
    width,
    height
  })
  const baseOptions = { x: width / 2, y: height / 2, scaleX: 1.5, scaleY: 1.5 }
  const gp = createGroup(baseOptions)
  const data = [
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -57.6,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -50.1,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -42.6,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -35.1,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -27.6,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -20.1,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -12.6,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -5.1,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 2.4,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 9.9,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 17.4,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 24.9,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 32.4,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 39.9,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 47.4,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 54.9,
          y: -96,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 54.9,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 47.4,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 39.9,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 32.4,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 24.9,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 17.4,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 9.9,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 2.4,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -5.1,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -12.6,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -20.1,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -27.6,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -35.1,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -42.6,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -50.1,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -57.6,
          y: 75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -66.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -59.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -51.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -44.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -36.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -29.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -21.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -14.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: -6.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 0.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 8.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 15.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 23.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 30.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 38.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: 84.15,
          y: 45.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 45.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 38.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 30.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 23.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 15.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 8.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: 0.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -6.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -14.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -21.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -29.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -36.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -44.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -51.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -59.25,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
        }
      ]
    },
    {
      type: 'group',
      data: [
        {
          type: 'rect',
          zlevel: 1000,
          x: -86.85,
          y: -66.75,
          width: 2.7,
          height: 21,
          fill: 'none',
          lineWidth: 1,
          stroke: 'green'
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
      stroke: 'red'
    },
    {
      type: 'line',
      zlevel: 100,
      x1: 0,
      y1: 10,
      x2: 0,
      y2: -10,
      stroke: 'red'
    },
    {
      type: 'rect',
      x: -75,
      y: -75,
      width: 150,
      height: 150,
      stroke: '#fff',
      lineWidth: 0.5,
      zlevel: 100,
      lineDash: 'dashed'
    },
    {
      type: 'circle',
      zlevel: 1500,
      cx: -60,
      cy: 60,
      r: 7.5,
      fill: 'red',
      stroke: 'red',
      opacity: 0.5
    }
  ]

  renderCanvas(zr, gp, data, {
    scale: true,
    translate: true
  })
})
</script>
