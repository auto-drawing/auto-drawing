## 1. createLine 创建直线

[创建直线文档](/guide/json.html#_1-%E7%9B%B4%E7%BA%BF)

类型

```ts
/**
 *  创建直线
 * @param options
 * @returns
 */
declare function createLine(options?: ILineOptions): Line
```

示例

```js{9}
import { createLine, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x1: 0,
  y1: 0,
  x2: 100,
  y2: 100
}
const shape = createLine(data)
const zr = createCanvas(app)
zr.add(line)
```

## 2. createRect 创建矩形

[创建矩形文档](/guide/json.html#_2-%E7%9F%A9%E5%BD%A2)

类型

```ts
/**
 *  创建矩形
 * @param options
 * @returns
 */
declare function createRect(options?: IRectOptions): Rect
```

示例

```js{9}
import { createRect, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x: 0,
  y: 0,
  width: 100,
  height: 100
}
const shape = createRect(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 3. createPolygon 创建闭合多边型

[创建闭合多边型文档](/guide/json.html#_3-%E9%97%AD%E5%90%88%E5%A4%9A%E8%BE%B9%E5%BD%A2)

类型

```ts
/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
declare function createPolygon(options?: IPolygonShapeOptions): Polygon
```

示例

```js{10}
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
const zr = createCanvas(app)
zr.add(shape)
```

## 4. createPolyline 创建不闭合多边型

[创建不闭合多边型文档](/guide/json.html#_4-%E4%B8%8D%E9%97%AD%E5%90%88%E5%A4%9A%E8%BE%B9%E5%BD%A2)

类型

```ts
/**
 *  创建不闭合多边型
 * @param options
 * @returns
 */
declare function createPolyline(options?: IPolylineShapeOptions): Polyline
```

示例

```js{10}
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
const zr = createCanvas(app)
zr.add(shape)
```

## 5. createCircle 创建圆

[创建圆文档](/guide/json.html#_6-%E5%9C%86)

类型

```ts
/**
 *  创建圆
 * @param options
 * @returns
 */
declare function createCircle(options?: ICircleOptions): Circle
```

示例

```js{8}
import { createCircle, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  cx: 0,
  cy: 0,
  r: 50
}
const shape = createCircle(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 6. createArc 创建圆弧

[创建圆弧文档](/guide/json.html#_5-%E5%9C%86%E5%BC%A7)

类型

```ts
/**
 *  创建圆弧
 * @param options
 * @returns
 */
declare function createArc(options?: IArcOptions): Arc
```

示例

```js{11}
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
const zr = createCanvas(app)
zr.add(shape)
```

## 7. createSector 创建扇形

[创建文本文档](/guide/api/drawing.html#_7-createsector-创建扇形)

类型

```ts
/**
 *  创建扇形
 * @param options
 * @returns
 */
declare function createSector(options?: ISectorOptions): Sector
```

示例

```js{15}
import { createSector, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
   type: 'sector',
   cx: 300,
   cy: 300,
   n: 0,
   r: 200,
   r0: 0,
   startAngle: 0,
   endAngle: 270,
   stroke: 'red',
   fill: 'red'
}
const shape = createSector(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 8. createText 创建文本

[创建文本文档](/guide/json.html#_8-%E6%96%87%E6%9C%AC)

类型

```ts
/**
 *  创建文字
 * @param options
 * @returns
 */
declare function createText(options?: ITextOptions): Text
```

示例

```js{10}
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
const zr = createCanvas(app)
zr.add(shape)
```

## 9. createImage 创建图片

[创建图片文档](/guide/json.html#_9-%E5%9B%BE%E7%89%87)

类型

```ts
/**
 *  创建图片
 * @param options
 * @returns
 */
declare function createImage(options?: IImageOptions): Image
```

示例

```js{10}
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
const zr = createCanvas(app)
zr.add(shape)
```

## 10. createBezierCurve 创建贝塞尔曲线

[创建贝塞尔曲线文档](/guide/json.html#_10-%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF)

类型

```ts
/**
 *  创建贝塞尔曲线
 * @param options
 * @returns
 */
declare function createBezierCurve(options?: IBezierCurveOptions): BezierCurve
```

示例

```js{13}
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
const zr = createCanvas(app)
zr.add(shape)
```

## 11. createBezierCurve 创建水滴

<i  class='tag'>v1.0.0</i>

[创建贝水滴文档](/guide/json.html#_10-%E8%B4%9D%E5%A1%9E%E5%B0%94%E6%9B%B2%E7%BA%BF)

类型

```ts
/**
 *  创建水滴
 * @param options
 * @returns
 */
declare function createDroplet(options?: IDropletOptions): Droplet
```

示例

```js{11}
import { createDroplet, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
   cx: 600,
   cy: 600,
   width: 168,
   height: 168,
   stroke: 'red',
   fill: 'red'
}
const shape = createDroplet(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 12. createEllipse 创建椭圆

<i  class='tag'>v1.0.0</i>

[创建椭圆文档](/guide/json.html#_12-椭圆)

类型

```ts
/**
 *  创建椭圆
 * @param options
 * @returns
 */
declare function createEllipse(options?: IDropletOptions): Ellipse
```

示例

```js{11}
import { createEllipse, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  cx: 600,
  cy: 600,
  rx: 168,
  ry: 200,
  stroke: 'red',
  fill: 'red'
}
const shape = createEllipse(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 13. createHeart 创建心形

<i  class='tag'>v1.0.0</i>

[创建心形文档](/guide/json.html#_13-心形)

类型

```ts
/**
 *  创建心形
 * @param options
 * @returns
 */
declare function createHeart(options?: IHeartOptions): Heart
```

示例

```js{11}
import { createHeart, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  cx: 100,
  cy: 100,
  width: 50,
  height: 50,
  stroke: 'yellow',
  fill: 'yellow'
}
const shape = createHeart(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 14. createIsogon 创建正多边形

<i  class='tag'>v1.0.0</i>

[创建正多边形文档](/guide/json.html#_14-正多边形)

类型

```ts
/**
 *  创建正多边形
 * @param options
 * @returns
 */
declare function createIsogon(options?: IIsogonOptions): Isogon
```

示例

```js{9}
import { createIsogon, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  x: 400,
  y: 400,
  r: 50,
  n: 5
}
const shape = createIsogon(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 15. createRose 创建玫瑰线

<i  class='tag'>v1.0.0</i>

[创建玫瑰线文档](/guide/json.html#_15-玫瑰线)

类型

```ts
/**
 *  创建玫瑰线
 * @param options
 * @returns
 */
declare function createRose(options?: IRoseOptions): Rose
```

示例

```js{11}
import { createRose, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  cx: 600,
  cy: 400,
  n: 2,
  r: [100, 120, 140, 160, 200, 220, 240, 260, 280],
  k: 5,
  stroke: 'green'
}
const shape = createRose(data)
const zr = createCanvas(app)
zr.add(shape)
```

## 16. createStar 创建星形

<i  class='tag'>v1.0.0</i>

[创建星形文档](/guide/json.html#_16-星形)

类型

```ts
/**
 *  创建星形
 * @param options
 * @returns
 */
declare function createStar(options?: IStarOptions): Star
```

示例

```js{12}
import { createStar, createCanvas } from 'auto-drawing'
const app = document.getElementById('app')
const data = {
  cx: 100,
  cy: 100,
  n: 5,
  r: 100,
  r0: 50,
  stroke: 'red',
  fill: 'red'
}
const shape = createStar(data)
const zr = createCanvas(app)
zr.add(shape)
```
