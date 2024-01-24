# auto-drawing

基于 zrender 的自动画图工具，简单的 json 配置就可画出复杂的图形。

## 安装

`npm`

```sh
npm install --save auto-drawing
```

`yarn`

```sh
yarn add  auto-drawing
```

`pnpm`

```sh
pnpm  add  auto-drawing
```

`cdn`

暴露全局变量 `AutoDrawing`

```html
<script src="https://cdn.jsdelivr.net/npm/auto-drawing/dist/auto-drawing.min.js"></script>
```

::: warning 建议
默认使用最新版本，使用时建议加上版本号 如使用`0.0.8`版本，防止因版本导致应用出现问题。

[https://cdn.jsdelivr.net/npm/auto-drawing@0.0.8/dist/auto-drawing.min.js](https://cdn.jsdelivr.net/npm/auto-drawing@0.0.8/dist/auto-drawing.min.js)
:::

## 使用

### ES Module

```html
<div id="app"></div>
```

```js
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const zr = createCanvas(app)
const gp = createGroup()
const data = [
  {
    type: 'rect',
    zlevel: 0,
    x: 26,
    y: 76,
    width: 40,
    height: 50,
    fill: '#ff8041',
    stroke: '#ff8041'
  }
]
renderCanvas(zr, gp, data, {
  scale: true,
  translate: true
})
```

### CDN

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <script src="https://cdn.jsdelivr.net/npm/auto-drawing/dist/auto-drawing.min.js"></script>
  </head>
  <body>
    <div id="app"></div>
    <script>
      const { createCanvas, createGroup, renderCanvas } = AutoDrawing
      const zr = createCanvas('app')
      const gp = createGroup({})
      const data = [
        {
          type: 'rect',
          zlevel: 0,
          x: 26,
          y: 76,
          width: 40,
          height: 50,
          fill: '#ff8041',
          stroke: '#ff8041'
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

### TypeScript

```html
<div id="app"></div>
```

```ts
import { createCanvas, createGroup, ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'
const app = document.getElementById('app') as HTMLElement
const zr: ZRenderType = createCanvas(app)
const gp: ZRenderGroup = createGroup()
const data: ShapeCoreType[] = [
  {
    type: 'rect',
    zlevel: 0,
    x: 26,
    y: 76,
    width: 40,
    height: 50,
    fill: '#ff8041',
    stroke: '#ff8041'
  }
]
renderCanvas(zr, gp, data)
```
