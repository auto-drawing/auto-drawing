# auto-drawing

基于 zrender 的自动画图工具，简单的 json 配置就可画出复杂的图形

## 安装

```
npm install --save auto-drawing
```

## 浏览器使用

```html
<script src="../src/lib/index.browser.js"></script>

console.log(vayoDrawing)
```

## 支持 ES module

```html
<script type="module">
  import { createCanvas, Group, renderCanvas } from 'auto-drawing'
  const canvas = createCanvas('div')
  const group = new Group()
</script>
```

## 支持 ts

```js
import { createCanvas } from 'auto-drawing'
console.log(createCanvas)
```

## 示例

```js
import { createCanvas, Group, renderCanvas } from 'auto-drawing'
const canvas = createCanvas('div')
const group = new Group()

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
  }
]

renderCanvas(canvas, group, data)
```

## 文档

[auto-drawing](https://github.com/l-x-f/auto-drawing)

## 友情链接

[zrender](https://ecomfe.github.io/zrender-doc/public/)
