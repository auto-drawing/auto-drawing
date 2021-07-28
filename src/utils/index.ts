/*eslint-disable @typescript-eslint/no-explicit-any */
import cloneDeep from 'lodash/cloneDeep'
import { ZRenderType, ZRenderGroup, CallbackType } from '../index'

/**
 * 缩放ZRender Group
 * @param  zr  ZRender 实例
 * @param  group  Group 实例
 * @param options  `{scaleMin:number, scaleMax:number}`  scaleMin：缩放最小值 scaleMax：缩放最大值
 * @default options = {scaleMin:0.5,scaleMax:100}
 */
export function scaleGroup(
  zr: ZRenderType,
  group: ZRenderGroup,
  options?: Partial<{ scaleMin: number; scaleMax: number; callback: CallbackType }>
): void {
  const { scaleMin = 0.5, scaleMax = 100 } = options || {}
  zr.on('mousewheel', e => {
    e.event.preventDefault()
    const { scaleX, scaleY } = group
    const k = 1 + e.wheelDelta / 5
    if (k < scaleMin || k > scaleMax) {
      return
    }
    const { x = 0, y } = group
    group.animateTo(
      {
        scaleX: scaleX * k,
        scaleY: scaleY * k,
        x: e.offsetX - (e.offsetX - x) * k,
        y: e.offsetY - (e.offsetY - y) * k
      },
      {
        duration: 100,
        delay: 0,
        done: () => {
          options?.callback &&
            options.callback({
              scale: group.scaleX,
              x: group.x,
              y: group.y
            })
        }
      }
    )
  })
}

/**
 * 平移ZRender Group
 * @param zr  ZRender 实例
 * @param group  Group 实例
 */
export function translateGroup(
  zr: ZRenderType,
  group: ZRenderGroup,
  options?: { callback?: CallbackType }
): void {
  const state = { startX: 0, startY: 0, isDown: false }
  zr.on('mousedown', (e: any) => {
    const { clientX: startX, clientY: startY } = e.event
    state.startX = startX
    state.startY = startY
    state.isDown = true
  })
  function move(e: any) {
    const { clientX, clientY } = e.event
    const stepX = clientX - state.startX
    const stepY = clientY - state.startY
    const x = group.x + stepX
    const y = group.y + stepY
    group.animateTo(
      { x, y },
      {
        duration: 100,
        delay: 0,
        done: () => {
          options?.callback &&
            options.callback({
              scale: group.scaleX,
              x: group.x,
              y: group.y
            })
        }
      }
    )
  }
  zr.on('mouseup', (e: any) => {
    move(e)
    state.isDown = true
  })
}

/**
 * 求两点之间的中点坐标
 * @param param0
 * @param param1
 * @returns
 */
export const getMiddle = (
  [x1 = 0, y1 = 0]: [number, number],
  [x2 = 0, y2 = 0]: [number, number]
): [x0: number, y0: number] => {
  const x0 = (x1 + x2) / 2
  const y0 = (y1 + y2) / 2
  return [x0, y0]
}

/**
 * 复制数组元素几遍
 * @param {array} arr 原数组
 * @param {number} count 复制遍数 默认1
 * @returns
 */
export function copyArrayByCount<T>(arr: T[], count = 1): T[] {
  let res: T[] = []
  const countArray: undefined[] = [...new Array(count)]
  countArray.forEach(() => {
    res = [...res, ...cloneDeep(arr)]
  })
  return res
}
