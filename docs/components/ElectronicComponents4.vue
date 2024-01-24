<template>
  <div id="div4"></div>
</template>

<script setup>
import { onMounted } from 'vue'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
onMounted(() => {
  const width = 688
  const height = 300
  const zr = createCanvas('div4', {
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
          x: -78.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -67.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -56.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -45.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -34.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -23.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -12.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: -1.375,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: 9.625,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: 20.625,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: 31.625,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: 42.625,
          y: 96.206,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: 57.706,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: 46.706,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: 35.706,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: 24.706,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: 13.706,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: 2.706,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: -8.294,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: -19.294,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: -30.294,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: -41.294,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: -52.294,
          width: 35.75,
          height: 5.588,
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
          x: 81.125,
          y: -63.294,
          width: 35.75,
          height: 5.588,
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
          x: 42.625,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: 31.625,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: 20.625,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: 9.625,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -1.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -12.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -23.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -34.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -45.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -56.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -67.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -78.375,
          y: -101.794,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: -63.294,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: -52.294,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: -41.294,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: -30.294,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: -19.294,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: -8.294,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: 2.706,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: 13.706,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: 24.706,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: 35.706,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: 46.706,
          width: 35.75,
          height: 5.588,
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
          x: -116.875,
          y: 57.706,
          width: 35.75,
          height: 5.588,
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
            [-77, 66],
            [-77, -77],
            [77, -77],
            [77, 77],
            [-66, 77],
            [-77, 66],
            [-77, 66]
          ],
          stroke: 'red',
          lineWidth: 0.5,
          zlevel: 10
        }
      ]
    },
    {
      type: 'line',
      zlevel: 1,
      x1: -10,
      y1: 0,
      x2: 10,
      y2: 0,
      stroke: 'red'
    },
    {
      type: 'line',
      zlevel: 1,
      x1: 0,
      y1: 10,
      x2: 0,
      y2: -10,
      stroke: 'red'
    }
  ]
  renderCanvas(zr, gp, data, {
    scale: true,
    translate: true
  })
})
</script>
