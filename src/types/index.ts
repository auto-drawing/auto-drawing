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
  Polyline,
  Rect,
  Image,
  Text,
  PathStyleProps,
  BezierCurve,
  Sector,
  Droplet,
  Ellipse,
  Heart,
  Isogon,
  Rose,
  Star
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
export type BaseShape<T> = Partial<
  T & { zlevel: number; draggable: boolean | 'horizontal' | 'vertical' }
> &
  PathStyleProps

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
  | Polyline
  | Rect
  | Text
  | BezierCurve
  | Sector
  | Image
  | Droplet
  | Ellipse
  | Heart
  | Isogon
  | Rose
  | Star
  | undefined

/**
 *
 * 组的类型
 */
export type ZRenderGroup = Group & { params?: Record<string, any> }

/**
 * 公共参数类型
 */
export type CommonType = {
  /**
   * 旋转的角度。 zrender是弧度 这里已经做了转换 转成了角度   默认 0
   */
  rotation: number
  /**
   * 	旋转和缩放的原点X。默认  0
   */
  originX: number
  /**
   * 	旋转和缩放的原点Y。默认 0
   */
  originY: number
  /**
   * 缩放X。默认 1
   */
  scaleX: number
  /**
   * 缩放Y。默认 1
   */
  scaleY: number
  /**
   * 	是否进行裁剪。默认false
   */
  culling: boolean
  /**
   * 	鼠标移到元素上时的鼠标样式。 默认'pointer'
   */
  cursor: string
  /**
   * 	图形是否可拖曳。  默认false
   */
  draggable: boolean | 'horizontal' | 'vertical'
  /**
   * 图形是否不可见，为 true 时不绘制图形，但是仍能触发鼠标事件。  默认false
   */
  invisible: boolean
  /**
   * 是否渐进式渲染。当图形元素过多时才使用，用大于 0 的数字表示渲染顺序。  默认 -1
   */
  progressive: boolean
  /**
   * 	是否使用包围盒检验鼠标是否移动到物体。false 则检测元素实际的内容。 默认 false
   */
  rectHover: boolean
  /**
   * 	是否响应鼠标事件。 默认 false
   */
  silent: boolean
  /**
   * 控制图形的前后顺序。z 值小的图形会被 z 值大的图形覆盖。z 相比 zlevel 优先级更低，而且不会创建新的 Canvas。 默认 0
   */
  z: number
  /**
   * 0与 z 类似，优先级比 z 更低。 默认 0
   */
  z2: number
  /**
   * 图形层级  默认 0
   */
  zlevel: number
}

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
    | 'polyline'
    | 'rect'
    | 'text'
    | 'image'
    | 'bezierCurve'
    | 'sector'
    | 'group'
    | 'droplet'
    | 'ellipse'
    | 'heart'
    | 'isogon'
    | 'rose'
    | 'star'

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
   * 椭圆横向半径
   */
  rx: number

  /**
   * 椭圆纵向半径
   */
  ry: number

  /**
   * 矩形 | 文字 起始x坐标
   */
  x: number

  /**
   * 矩形 | 文字 起始y坐标
   */
  y: number

  /**
   * 多边形边数 | 花瓣数
   */
  n: number

  /**
   * 玫瑰线参数
   */
  k: number

  /**
   *  `宽` 矩形 | 心形 | 水滴
   */
  width: number

  /**
   * `高`  矩形 | 心形 | 水滴
   */
  height: number

  /**
   * 图片
   */
  image: string | HTMLImageElement | HTMLCanvasElement

  /**
   * 半径
   */
  r: number | number[]

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
   * 组数据
   */
  data: ShapeCoreType[]

  /**
   * 组id
   */
  id: number

  /**
   * 附加参数
   */
  params: Record<string, any>
}> &
  PathStyleProps &
  Partial<CommonType>

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
