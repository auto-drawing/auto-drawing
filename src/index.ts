/*eslint-disable @typescript-eslint/no-explicit-any  */
/*eslint-disable no-case-declarations  */
import CanvasPainter from 'zrender/lib/canvas/Painter'
import SvgPainter from 'zrender/lib/svg/Painter'
import { init, Group, registerPainter, GroupProps } from 'zrender'
import * as zrender from 'zrender'

// 基本绘图方法
import createLine from './core/line'
import createRect from './core/rect'
import createCircle from './core/circle'
import createArc from './core/arc'
import createCompoundPath from './core/compoundPath'
import createPolygon from './core/polygon'
import createPolyline from './core/polyline'
import createText from './core/text'
import createBezierCurve from './core/bezierCurve'
import createSector from './core/sector'
import createImage from './core/image'
import createDroplet from './core/droplet'
import createEllipse from './core/ellipse'
import createHeart from './core/heart'
import createIsogon from './core/isogon'
import createRose from './core/rose'
import createStar from './core/star'

import { translateGroup, scaleGroup } from './utils'
import {
  ZRenderInitOptions,
  ZRenderType,
  ShapeCoreType,
  AllShape,
  ZRenderGroup,
  CallbackType
} from './types'

// 导出类型
export * from './types'

// 导出utils下所有方法
export * from './utils'

/**
 * 注册画布，解决打包后出现 `Renderer 'undefined' is not imported. Please import it first` 的问题
 */
registerPainter('canvas', CanvasPainter as any)
registerPainter('svg', SvgPainter as any)

export {
  zrender,
  // 导出核心生成图形方法
  createLine,
  createRect,
  createCircle,
  createArc,
  createPolygon,
  createPolyline,
  createText,
  createBezierCurve,
  createImage,
  createCompoundPath,
  createDroplet,
  createEllipse
}

/**
 * 创建容器
 * @param element  HTML元素本身 或者 HTML的id
 * @param options 初始参数
 * @returns zrender 实例
 */
export function createCanvas(
  element: HTMLElement | string,
  options: ZRenderInitOptions | undefined = {}
): ZRenderType {
  const el =
    element instanceof HTMLElement ? element : (document.getElementById(element) as HTMLElement)
  const ratio = window.devicePixelRatio
  const height = window.innerHeight * ratio
  const width = window.innerWidth * ratio
  const Canvas = init(el, {
    renderer: 'canvas',
    devicePixelRatio: ratio,
    width: width,
    height: height,
    ...options
  } as ZRenderInitOptions)
  // 画布默认设置为黑色
  Canvas?.painter?.setBackgroundColor('#000')
  return Canvas
}

/**
 * 销毁容器
 * @param zr
 */
export function disposeCanvas(zr: ZRenderType): void {
  zr && zr.dispose()
}

/**
 * 创建Group
 */
export function createGroup(options?: GroupProps): ZRenderGroup {
  const group = new Group(options)
  return group
}

/**
 *  根据数据生成图
 * @param group
 * @param item
 */
export function generateShape(item: ShapeCoreType, _index?: number): AllShape {
  const {
    type,
    x1,
    y1,
    x2,
    y2,
    x,
    y,
    cx,
    cy,
    cpx1,
    cpy1,
    rx,
    ry,
    // 下面参数可选
    cpx2,
    cpy2,
    width,
    height,
    r,
    r0,
    n,
    k,
    points,
    startAngle,
    endAngle,
    text,
    data,
    id,
    paths,
    image,
    params = {},
    ...options
  } = item
  let shape: AllShape = undefined
  switch (type) {
    case 'line':
      shape = createLine({ x1, y1, x2, y2, ...options })
      break
    case 'circle':
      shape = createCircle({ cx, cy, r: r as number, ...options })
      break
    case 'rect':
      shape = createRect({ x, y, width, height, ...options })
      break
    case 'polygon':
      shape = createPolygon({ points, ...options })
      break
    case 'polyline':
      shape = createPolyline({ points, ...options })
      break
    case 'arc':
      shape = createArc({ cx, cy, r: r as number, startAngle, endAngle, ...options })
      break
    case 'text':
      shape = createText({ x, y, text, ...options } as any)
      break
    case 'sector':
      shape = createSector({ cx, cy, r: r as number, r0, startAngle, endAngle, ...options })
      break
    case 'image':
      shape = createImage({ x, y, width, height, image, ...options })
      break
    case 'droplet':
      shape = createDroplet({ cx, cy, width, height, ...options })
      break
    case 'ellipse':
      shape = createEllipse({ cx, cy, rx, ry, ...options })
      break
    case 'heart':
      shape = createHeart({ cx, cy, width, height, ...options })
      break
    case 'isogon':
      shape = createIsogon({ x, y, r: r as number, n, ...options })
      break
    case 'rose':
      shape = createRose({ cx, cy, n, r: r as number[], k, ...options })
      break
    case 'star':
      shape = createStar({ cx, cy, n, r: r as number, r0, ...options })
      break
    case 'compoundPath':
      shape = createCompoundPath({ paths: paths as any, ...options })
      break
    case 'bezierCurve':
      shape = createBezierCurve({
        x1,
        y1,
        x2,
        y2,
        cpx1,
        cpy1,
        // 下面参数可选
        cpx2,
        cpy2,
        ...options
      } as any)
      break
    case 'group':
      const shapes = data?.map((item: any) => generateShape(item))
      const group = createGroup()
      if (id) {
        group.id = id as number
      }
      if (params) {
        Reflect.set(group, 'params', params)
      }

      shapes?.forEach((item: any) => group.add(item))
      shape = group as any
      break
  }

  if (params && shape) {
    Reflect.set(shape as any, 'params', params)
  }

  return shape
}

/**
 * 渲染图形到画布
 * @param zr
 * @param group
 * @param data
 * @param options `scale：是否需要缩放 translate：是否需要平移  mouse：平移响应的鼠标键 默认鼠标左键`
 * @default options =  { scale: false, translate: false, mouse:'left'}
 */
export function renderCanvas(
  zr: ZRenderType,
  group: ZRenderGroup,
  data: ShapeCoreType[],
  options?: Partial<{
    scale: boolean
    translate: boolean
    callback: CallbackType
    mouse: 'left' | 'middle' | 'right'
  }>
): void {
  const translate = options?.translate ?? false
  const scale = options?.scale ?? false
  const shapes = data.map((item, index: number) => generateShape(item, index))
  shapes.forEach(item => item && group.add(item))
  translate && translateGroup(zr, group, { callback: options?.callback, mouse: options?.mouse })
  scale && scaleGroup(zr, group, { callback: options?.callback })
  zr.add(group)
}
