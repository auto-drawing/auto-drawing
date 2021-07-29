# auto-drawing

基于 zrender 的自动画图工具，简单的 json 配置就可画出复杂的图形

## npm 安装

```
npm install --save auto-drawing
```

## 使用 cdn （暴露全局变量 `AutoDrawing`）

[https://unpkg.com/browse/auto-drawing@0.0.1-beta.3/dist/index.min.js](https://unpkg.com/browse/auto-drawing@0.0.1-beta.3/dist/index.min.js)

## 浏览器使用

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://unpkg.com/browse/auto-drawing@0.0.1-beta.3/dist/index.min.js"></script>
  </head>
  <body style="background-color: #000">
    <div id="app"></div>
    <script>
      const { createCanvas, createGroup, renderCanvas } = AutoDrawing
      const zr = createCanvas('app')
      const gp = createGroup({
        scaleX: 0.1,
        scaleY: 0.1
      })
      const data = [
        {
          type: 'group',
          data: [
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
            }
          ]
        },
        {
          type: 'rect',
          zlevel: 0,
          x: 26,
          y: 76,
          width: 40,
          height: 50,
          fill: '#ff8041',
          stroke: '#ff8041'
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
          type: 'line',
          zlevel: 0,
          x1: 96,
          y1: 100,
          x2: 104,
          y2: 100,
          stroke: '#f8f9b7'
        },
        {
          type: 'line',
          zlevel: 0,
          x1: 100,
          y1: 96,
          x2: 100,
          y2: 104,
          stroke: '#f8f9b7'
        },
        {
          type: 'sector',
          cx: 150,
          cy: 150,
          r: 100,
          r0: 0,
          startAngle: 0,
          endAngle: 90,
          fill: 'yellow',
          clockwise: true
        },
        {
          type: 'arc',
          cx: 300,
          cy: 150,
          r: 100,
          startAngle: 0,
          endAngle: 90,
          fill: 'green',
          clockwise: true
        },
        {
          type: 'circle',
          cx: 350,
          cy: 350,
          r: 50,
          fill: 'green'
        },
        {
          type: 'polygon',
          points: [
            [350, 0],
            [500, 0],
            [350, 100]
          ],
          fill: 'red',
          stroke: 'none'
        },
        {
          type: 'text',
          x: 600,
          y: 600,
          text: '你好',
          fontSize: 50,
          fontWeight: 400
        }
      ]
      renderCanvas(zr, gp, data, {
        scale: true,
        translate: true
      })
    </script>
  </body>
</html>
```

## 支持 ES module

```html
<script type="module">
  import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
  const app = doucument.getElementId('app')
  const zr = createCanvas(app)
  const gp = createGroup()
  const data = [
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
      type: 'line',
      zlevel: 0,
      x1: 96,
      y1: 100,
      x2: 104,
      y2: 100,
      stroke: '#f8f9b7'
    },
    {
      type: 'line',
      zlevel: 0,
      x1: 100,
      y1: 96,
      x2: 100,
      y2: 104,
      stroke: '#f8f9b7'
    },
    {
      type: 'sector',
      cx: 150,
      cy: 150,
      r: 100,
      r0: 0,
      startAngle: 0,
      endAngle: 90,
      fill: 'yellow',
      clockwise: true
    },
    {
      type: 'arc',
      cx: 300,
      cy: 150,
      r: 100,
      startAngle: 0,
      endAngle: 90,
      fill: 'green',
      clockwise: true
    },
    {
      type: 'circle',
      cx: 350,
      cy: 350,
      r: 50,
      fill: 'green'
    },
    {
      type: 'polygon',
      points: [
        [350, 0],
        [500, 0],
        [350, 100]
      ],
      fill: 'red',
      stroke: 'none'
    },
    {
      type: 'text',
      x: 600,
      y: 600,
      text: '你好',
      fontSize: 50,
      fontWeight: 400
    }
  ]
  renderCanvas(zr, gp, data)
</script>
```

## 支持 TypeScript

```ts
import { createCanvas, createGroup, ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'
const app = doucument.getElementId('app')
const zr: ZRenderType = createCanvas(app)
const gp: ZRenderGroup = createGroup()

const data: ShapeCoreType[] = [
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
    type: 'line',
    zlevel: 0,
    x1: 96,
    y1: 100,
    x2: 104,
    y2: 100,
    stroke: '#f8f9b7'
  },
  {
    type: 'line',
    zlevel: 0,
    x1: 100,
    y1: 96,
    x2: 100,
    y2: 104,
    stroke: '#f8f9b7'
  },
  {
    type: 'sector',
    cx: 150,
    cy: 150,
    r: 100,
    r0: 0,
    startAngle: 0,
    endAngle: 90,
    fill: 'yellow',
    clockwise: true
  },
  {
    type: 'arc',
    cx: 300,
    cy: 150,
    r: 100,
    startAngle: 0,
    endAngle: 90,
    fill: 'green',
    clockwise: true
  },
  {
    type: 'circle',
    cx: 350,
    cy: 350,
    r: 50,
    fill: 'green'
  },
  {
    type: 'polygon',
    points: [
      [350, 0],
      [500, 0],
      [350, 100]
    ],
    fill: 'red',
    stroke: 'none'
  },
  {
    type: 'text',
    x: 600,
    y: 600,
    text: '你好',
    fontSize: 50,
    fontWeight: 400
  }
]
renderCanvas(zr, gp, data)
```

## 文档

[auto-drawing](https://github.com/l-x-f/auto-drawing)

[json 画图](https://github.com/l-x-f/auto-drawing/blob/main/doc/index.md)

[api](https://github.com/l-x-f/auto-drawing/blob/main/doc/api.md)

## 友情链接

[zrender](https://ecomfe.github.io/zrender-doc/public/)
