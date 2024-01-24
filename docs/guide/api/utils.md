## 基础类型说明

```ts
/**
 * 坐标值的类型
 */
export type CoordinateValue = string | number
/**
 * 坐标
 */
export type Point = [CoordinateValue, CoordinateValue]
```

## getMiddle

求两点之间的中点坐标

```ts
/**
 * 求两点之间的中点坐标
 * @param p1 第一个点的坐标
 * @param p2  第二个点的坐标
 * @returns
 */
export declare const getMiddle: (p1: Point, p2: Point) => number[]
```

使用示例

```ts
import { getMiddle } from 'auto-drawing'

getMiddle([0, 0], [2, 2]) // [1,1]
```

## getTwoPointDistance

计算两个点之间的距离

```ts
import type { Point } from 'auto-drawing'
/**
 * 计算两个点之间的距离
 * @param p1 第一个点的坐标
 * @param p2 第二个点的坐标
 * @returns
 */
export declare const getTwoPointDistance: (p1: Point, p2: Point) => number
```

使用示例

```ts
import { getTwoPointDistance } from 'auto-drawing'

getTwoPointDistance([4, 2], [2, 4]) // 2.8284271247461903
```

## center2LeftTop

知道矩形的中心点和长宽 计算矩形的左上角坐标 **y 轴数据会做负值处理 以适应笛卡尔坐标系**

```ts
import type { CoordinateValue, Point } from 'auto-drawing'

/**
 *  知道矩形的中心点和长宽  计算矩形的左上角坐标  y轴会做负值处理 以适应笛卡尔坐标系
 * @param data  矩形的中心点坐标
 * @param rect  矩形的长宽
 * @returns `{x: number,y: number }`
 */
export declare const center2LeftTop: (
  data: Point,
  rect: {
    length: CoordinateValue
    width: CoordinateValue
  }
) => {
  x: number
  y: number
}
```

使用示例

```ts
import { center2LeftTop } from 'auto-drawing'

center2LeftTop([10, -10], {
  length: 5,
  width: 5
}) // {x: 7.5, y: 7.5}
```

## radian2Angle

弧度转角度

```ts
/**
 * 弧度转角度
 * @param {number} radian  弧度
 * @returns
 */
export declare const radian2Angle: (radian: number) => number
```

使用示例

```ts
import { radian2Angle } from 'auto-drawing'

radian2Angle(Math.PI / 2) // 90
```

## angle2Radian

角度转弧度

```ts
/**
 * 角度转弧度
 * @param {number} angle 角度
 * @returns
 */
export declare const angle2Radian: (angle: number) => number
```

使用示例

```ts
import { angle2Radian } from 'auto-drawing'

angle2Radian(180) // 3.141592653589793
```

## getRadian

计算坐标和 x 轴正方向的角度 （以弧度为单位）

```ts
import type { Point } from 'auto-drawing'
/**
 * 计算坐标和 x轴正方向的角度  （以弧度为单位）
 *
 * 默认计算的是从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 (弧度值)
 * @param  data 坐标
 * @param  origin 起始点坐标 默认值[0,0]
 * @returns
 */
export declare const getRadian: (data: Point, origin?: Point) => number
```

使用示例

```ts
import { getRadian } from 'auto-drawing'

getRadian([4, 4]) //0.7853981633974483
```

## getArcRadian

计算弧的起始角度和结束角度 （以弧度为单位）

```ts
import type { Point } from 'auto-drawing'
/**
 * 计算弧的起始角度和结束角度 （以弧度为单位）
 *
 * @param start  起始点坐标
 * @param end  结束点坐标
 * @param center 圆心坐标
 * @returns `{ startRadian: number,endRadian: number }`
 */
export declare const getArcRadian: (
  start: Point,
  end: Point,
  center: Point
) => {
  startRadian: number
  endRadian: number
}
```

使用示例

```ts
import { getArcRadian } from 'auto-drawing'

getArcRadian([4, 2], [2, 4], [2, 2]) // {"startRadian": 0,"endRadian": 1.5707963267948966}
```

## getArcAngle

计算弧的起始角度和结束角度 （以角度为单位）

```ts
import type { Point } from 'auto-drawing'
/**
 * 计算弧的起始角度和结束角度 （以角度为单位）
 * @param  start 起始点坐标
 * @param  end 结束点坐标
 * @param  center 圆心坐标
 * @returns `{ startAngle: number,endAngle: number}`
 */
export declare const getArcAngle: (
  start: Point,
  end: Point,
  center: Point
) => {
  startAngle: number
  endAngle: number
}
```

使用示例

```ts
import { getArcAngle } from 'auto-drawing'

getArcAngle([4, 2], [2, 4], [2, 2]) // { "startAngle": 0,"endAngle": 90}
```
