/*eslint-disable @typescript-eslint/no-explicit-any  */
/*eslint-disable no-case-declarations  */
import CanvasPainter from 'zrender/lib/canvas/Painter'
import SvgPainter from 'zrender/lib/svg/Painter'
import { init, Group, registerPainter, GroupProps } from 'zrender'
import * as zrender from 'zrender'
import createLine from './core/line'
import createRect from './core/rect'
import createCircle from './core/circle'
import createArc from './core/arc'
import createCompoundPath from './core/compoundPath'
import createPolygon from './core/polygon'
import createText from './core/text'
import createBezierCurve from './core/bezierCurve'
import createSector from './core/sector'
import { translateGroup, scaleGroup } from './utils'
import {
  ZRenderInitOptions,
  ZRenderType,
  ShapeCoreType,
  AllShape,
  ZRenderGroup,
  CallbackType
} from './types'

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
  createCompoundPath,
  createPolygon,
  createText,
  createBezierCurve
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
  // console.log(index)
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
    // 下面参数可选
    cpx2,
    cpy2,
    width,
    height,
    r,
    r0,
    points,
    startAngle,
    endAngle,
    text,
    data,
    id,
    paths,
    ...options
  } = item
  let shape: AllShape = undefined
  switch (type) {
    case 'line':
      shape = createLine({ x1, y1, x2, y2, ...options })
      break
    case 'circle':
      shape = createCircle({ cx, cy, r, ...options })
      break
    case 'rect':
      shape = createRect({ x, y, width, height, ...options })
      break
    case 'polygon':
      shape = createPolygon({ points, ...options })
      break
    case 'arc':
      shape = createArc({ cx, cy, r, startAngle, endAngle, ...options })
      break
    case 'text':
      shape = createText({ x, y, text, ...options } as any)
      break
    case 'sector':
      shape = createSector({ cx, cy, r, r0, startAngle, endAngle, ...options } as any)
      break
    case 'compoundPath':
      shape = createCompoundPath({ paths, ...options } as any)
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
      const group = new Group()
      if (id) {
        group.id = id as number
      }
      shapes?.forEach((item: any) => group.add(item))
      shape = group as any
      break
  }
  return shape
}

/**
 * 渲染图形到画布
 * @param zr
 * @param group
 * @param data
 * @param options `scale：是否需要缩放 translate：是否需要平移`
 * @default options =  { scale: false, translate: true }
 */
export function renderCanvas(
  zr: ZRenderType,
  group: ZRenderGroup,
  data: ShapeCoreType[],
  options?: Partial<{
    scale: boolean
    translate: boolean
    callback: CallbackType
  }>
): void {
  const translate = options?.translate ?? true
  const scale = options?.scale ?? false
  const shapes = data.map((item, index: number) => generateShape(item, index))
  shapes.forEach(item => item && group.add(item))
  translate && translateGroup(zr, group, { callback: options?.callback })
  scale && scaleGroup(zr, group, { callback: options?.callback })
  zr.add(group)
}
