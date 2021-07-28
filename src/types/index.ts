/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ZRenderType as type,
  Group,
  ZRenderInitOpt,
  Line,
  Arc,
  CompoundPath,
  Circle,
  Polygon,
  Rect,
  Text,
  PathStyleProps,
  BezierCurve,
  Sector
} from 'zrender'

/**
 * init 参数
 */
export interface ZRenderInitOptions extends ZRenderInitOpt {
  renderer?: 'svg' | 'canvas'
}

/**
 * 创建图形的基本类型
 */
export type BaseShape<T> = Partial<T & { zlevel: number }> & PathStyleProps

/**
 * 自定义ZRenderType
 */
export type ZRenderType = type & {
  scale?: number
  offsetX?: number
  offsetY?: number
  dragData?: any
}

/**
 * 所有基本形状
 */
export type AllShape =
  | Line
  | Circle
  | Arc
  | CompoundPath
  | Polygon
  | Rect
  | Text
  | BezierCurve
  | Sector
  | undefined

/**
 *
 * 组的类型
 */
export type ZRenderGroup = Group

/**
 * 图形数据类型
 */
export type ShapeCoreType = Partial<{
  /**
   * 图形类型
   */
  type:
    | 'arc'
    | 'circle'
    | 'compoundPath'
    | 'line'
    | 'polygon'
    | 'rect'
    | 'text'
    | 'bezierCurve'
    | 'sector'
    | 'group'
  /**
   * 线宽
   */
  lineWidth: number

  /**
   * 线的类型
   */
  lineDash: string

  /**
   * 线段起始横坐标
   */
  x1: number

  /**
   * 线段起始纵坐标
   */
  y1: number

  /**
   * 线段结束横坐标
   */
  x2: number

  /**
   * 线段结束纵坐标
   */
  y2: number

  /**
   * 线段比例
   */
  percent: number

  /**
   * 贝塞尔曲线断点x1
   */
  cpx1: number

  /**
   * 贝塞尔曲线断点y1
   */
  cpy1: number

  /**
   * 贝塞尔曲线断点x2
   */
  cpx2: number

  /**
   * 贝塞尔曲线断点y2
   */
  cpy2: number

  /**
   * 圆心横坐标
   */
  cx: number

  /**
   * 圆心纵坐标
   */
  cy: number

  /**
   * 矩形 | 文字 起始x坐标
   */
  x: number

  /**
   * 矩形 | 文字 起始y坐标
   */
  y: number

  /**
   * 矩形宽
   */
  width: number

  /**
   * 矩形高
   */
  height: number

  /**
   * 半径
   */
  r: number

  /**
   * 内半径
   */
  r0: number

  /**
   * 多边形点合集
   */
  points: number[][]

  /**
   * 弧度顺时针
   */
  clockwise: boolean

  /**
   * 起始弧度
   */
  startAngle: number

  /**
   * 结束弧度
   */
  endAngle: number

  /**
   * 图形填充颜色
   */
  fill: string

  /**
   * 图形轮廓颜色
   */
  stroke: string

  /**
   * 路径合集
   */
  paths: number[][]

  /**
   * 文本
   */
  text: string

  /**
   * 文本字号
   */
  fontSize: number

  /**
   * 图形层级
   */
  zlevel: number

  /**
   * 组数据
   */
  data: ShapeCoreType[]

  /**
   * 组id
   */
  id: number
}> &
  PathStyleProps

/**
 * 缩放平移回调数据
 */
export type CallbackData = { scale: number; x: number; y: number }

/**
 *  缩放平移回调
 */
export type CallbackType = (info: CallbackData) => void

/**
 * Nullable
 */
export type Nullable<T> = T | null
