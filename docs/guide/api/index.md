## createCanvas 创建画布

类型

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

```js{5}
import { createCanvas } from 'auto-drawing'

const app = document.getElementById('app')
const options = {}
const zr = createCanvas(app, options)
```

## disposeCanvas 销毁容器

类型

```js
/**
 * 销毁容器
 * @param zr
 */
export declare function disposeCanvas(zr: ZRenderType): void;
```

示例

```js{5}
import { createCanvas, disposeCanvas } from 'auto-drawing'

const options = {}
const zr = createCanvas(div, options)
disposeCanvas(zr)
```

## createGroup 创建组

类型

```js
/**
 * 创建Group
 */
export declare function createGroup(options?: GroupProps): ZRenderGroup
```

示例

```js{4}
import { createGroup } from 'auto-drawing'

const options = {}
const gp = createGroup(options)
```

## renderCanvas 渲染图形到画布

类型

```js
/**
 * 渲染图形到画布
 * @param zr
 * @param group
 * @param data
 * @param options `scale：是否需要缩放 translate：是否需要平移  mouse：平移响应的鼠标键 默认鼠标左键`
 * @default options =  { scale: false, translate: false, mouse:'left'}
 */
export declare function renderCanvas(zr: ZRenderType, group: ZRenderGroup, data: ShapeCoreType[], options?: Partial<{
    scale: boolean;
    translate: boolean;
    callback: CallbackType;
    mouse: 'left' | 'middle' | 'right';
}>): void;

```

示例

```js{135-138}
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
const app = document.getElementById('app')
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

## setBackgroundColor 设置背景色

示例

```js{8}
import { createImage, createCanvas, renderCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const zr = createCanvas(app, {
  width: 300,
  height: 300
})
const group = createGroup()
zr.setBackgroundColor('#fff')
const data = [
  {
    type: 'line',
    zlevel: 1,
    x1: 32,
    y1: 62,
    x2: 168,
    y2: 62,
    stroke: '#f8f8b8'
  }
]
renderCanvas(zr, group, data, { scale: true, translate: true })
```

## canvasToImage 图形生成图片

类型

```js
/**
 * canvas转成图片
 */
export declare const canvasToImage: (zr: ZRenderType) => Promise<{
    blob: Blob;
    base64: string;
}>;

```

示例

```js{21}
import { createImage, createCanvas, renderCanvas,canvasToImage } from 'auto-drawing'
const app = document.getElementById('app')
const zr = createCanvas(app, {
  width: 300,
  height: 300
})
const group = createGroup()
const data = [
  {
    type: 'rect',
    x: 0,
    y: 0,
    width: 100,
    height: 100,
    stroke: '#f8f8b8'
  }
]
renderCanvas(zr, group, data, { scale: true, translate: true })

const getImage = async () => {
  const { blob ,base64} = await canvasToImage(zr)
  console.log(blob ,base64)
}
getImage()

```
