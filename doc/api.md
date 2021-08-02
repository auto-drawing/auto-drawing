# api

## createCanvas 创建画布

```js
/**
 * 创建容器
 * @param element  HTML元素本身 或者 HTML的id
 * @param options 初始参数
 * @returns zrender 实例
 */
export declare function createCanvas(
  element: HTMLElement | string,
  options?: ZRenderInitOptions | undefined
): ZRenderType
```

`type`： `ZRenderInitOptions`

```js
interface  ZRenderInitOptions {
   renderer?: string   // 'canvas' or 'svg
    devicePixelRatio?: number
    width?: number | string // 10, 10px, 'auto'
    height?: number | string
    useDirtyRect?: boolean
}
```

示例

```js
import { createCanvas } from 'auto-drawing'

const app = document.getElementById('app')

const options = {}

const zr = createCanvas(app, options)
```

## disposeCanvas 销毁容器

```js
/**
 * 销毁容器
 * @param zr
 */
export declare function disposeCanvas(zr: ZRenderType): void;
```

示例

```js
import { createCanvas, disposeCanvas } from 'auto-drawing'

const options = {}
const zr = createCanvas(div, options)
disposeCanvas(zr)
```

## createGroup 创建组

```js
/**
 * 创建Group
 */
export declare function createGroup(options?: GroupProps): ZRenderGroup
```

示例

```js
import { createGroup } from 'auto-drawing'

const options = {}
const gp = createGroup(options)
```

## renderCanvas 渲染图形到画布

```js
/**
 * 渲染图形到画布
 * @param zr
 * @param group
 * @param data
 * @param options `scale：是否需要缩放 translate：是否需要平移`
 * @default options =  { scale: false, translate: true }
 */
export declare function renderCanvas(
  zr: ZRenderType,
  group: ZRenderGroup,
  data: ShapeCoreType[],
  options?: Partial<{
    scale: boolean
    translate: boolean
    callback: CallbackType
  }>
): void

```

示例

```js
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
const app = doucument.getElementById('app')
const zr = createCanvas(app)
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
```

## createLine 创建直线

[创建直线文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderline)

```ts
/**
 *  创建直线
 * @param options
 * @returns
 */
declare function createLine(options?: ILineOptions): Line
```

示例

```js
import { createLine, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x1: 0,
  y1: 0,
  x2: 100,
  y2: 100
}
const shape = createLine(data)
const app = createCanvas(app)
app.add(line)
```

## createRect 创建矩形

[创建矩形文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderrect)

```ts
/**
 *  创建矩形
 * @param options
 * @returns
 */
declare function createRect(options?: IRectOptions): Rect
```

示例

```js
import { createRect, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x: 0,
  y: 0,
  width: 100,
  height: 100
}
const shape = createRect(data)
const app = createCanvas(app)
app.add(shape)
```

## createCircle 创建圆

[创建圆文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrendercircle)

```ts
/**
 *  创建圆
 * @param options
 * @returns
 */
declare function createCircle(options?: ICircleOptions): Circle
```

示例

```js
import { createCircle, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  cx: 0,
  cy: 0,
  r: 50
}
const shape = createCircle(data)
const app = createCanvas(app)
app.add(shape)
```

## createArc 创建圆弧

[创建圆弧文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderarc)

```ts
/**
 *  创建圆弧
 * @param options
 * @returns
 */
declare function createArc(options?: IArcOptions): Arc
```

示例

```js
import { createArc, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  r: 0,
  cx: 0,
  cy: 0,
  startAngle: 0,
  endAngle: 360,
  clockwise: true
}
const shape = createArc(data)
const app = createCanvas(app)
app.add(shape)
```

## createPolygon 创建闭合多边型

[创建闭合多边型文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderpolygon)

```ts
/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
declare function createPolygon(options?: IPolygonShapeOptions): Polygon
```

示例

```js
import { createPolygon, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  points: [
    [350, 0],
    [500, 0],
    [350, 100]
  ]
}
const shape = createPolygon(data)
const app = createCanvas(app)
app.add(shape)
```

## createPolyline 创建不闭合多边型

[创建不闭合多边型文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderpolyline)

```ts
/**
 *  创建不闭合多边型
 * @param options
 * @returns
 */
declare function createPolyline(options?: IPolylineShapeOptions): Polyline
```

示例

```js
import { createPolyline, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  points: [
    [350, 0],
    [500, 0],
    [350, 100]
  ]
}
const shape = createPolyline(data)
const app = createCanvas(app)
app.add(shape)
```

## createText 创建文本

[创建文本文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrendertext)

```ts
/**
 *  创建文字
 * @param options
 * @returns
 */
declare function createText(options?: ITextOptions): Text
```

示例

```js
import { createText, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x: 600,
  y: 600,
  text: '你好',
  fontSize: 50,
  fontWeight: 400
}
const shape = createText(data)
const app = createCanvas(app)
app.add(shape)
```

## createBezierCurve 创建贝塞尔曲线

[创建贝塞尔曲线文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderbeziercurve)

```ts
/**
 *  创建贝塞尔曲线
 * @param options
 * @returns
 */
declare function createBezierCurve(options?: IBezierCurveOptions): BezierCurve
```

示例

```js
import { createBezierCurve, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x1: 0,
  y1: 0,
  cpx1: 50,
  cpy1: 50,
  cpx2: 150,
  cpy2: 150,
  x2: 200,
  y2: 200
}
const shape = createBezierCurve(data)
const app = createCanvas(app)
app.add(shape)
```

## createImage 创建图片

[创建图片文档](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderimage)

```ts
/**
 *  创建图片
 * @param options
 * @returns
 */
declare function createImage(options?: IImageOptions): Image
```

示例

```js
import { createImage, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x: 0,
  y: 600,
  width: 600,
  height: 600,
  image: './img.png'
}
const shape = createImage(data)
const app = createCanvas(app)
app.add(shape)
```
