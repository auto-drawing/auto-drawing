/*eslint-disable @typescript-eslint/no-explicit-any */
import { cloneDeep } from 'lodash-es'
import { ZRenderType, ZRenderGroup, CallbackType } from '../index'

/**
 * 鼠标键的映射
 */
export enum mouseMap {
  left = 0,
  middle = 1,
  right = 2
}

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
        originX: 0,
        originY: 0,
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

// 阻止鼠标右键默认事件
const preventDefault = (zr: ZRenderType) => {
  const canvasList = zr.dom?.getElementsByTagName('canvas') || []
  const data = Array.from(canvasList)
  data.forEach(item => {
    item.oncontextmenu = e => {
      e.preventDefault()
      e.stopPropagation()
    }
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
  options?: { callback?: CallbackType; mouse?: keyof typeof mouseMap }
): void {
  const state = { startX: 0, startY: 0, canTranslate: false }
  const { mouse = 'left' } = options || {}
  zr.on('mousedown', (e: any) => {
    const { clientX: startX, clientY: startY } = e.event
    state.startX = startX
    state.startY = startY
    // 判断用户点击的是否是鼠标左键 左键可以平移
    state.canTranslate = e.event.button === mouseMap[mouse] ? true : false
    if (mouse === 'right') {
      preventDefault(zr)
    }
  })
  function move(e: any) {
    if (!state.canTranslate) return
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
    state.canTranslate = false
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
 * @param   arr 原数组
 * @param   count 复制遍数 默认1
 * @returns
 */
export function copyArrayByCount<T = any>(arr: T[], count = 1): T[] {
  let res: T[] = []
  const countArray: undefined[] = [...new Array(count)]
  countArray.forEach(() => {
    res = [...res, ...cloneDeep(arr)]
  })
  return res
}

/**
 * canvas转成图片
 */
export const canvasToImage = (zr: ZRenderType): Promise<{ blob: Blob; base64: string }> => {
  return new Promise((resolve, reject) => {
    try {
      if (zr) {
        const canvas = (zr.painter as any).getRenderedCanvas()
        const base64 = canvas.toDataURL('image/jpeg', 1.0)
        canvas.toBlob((blob: Blob) => {
          resolve({ blob, base64 })
        })
      } else {
        reject()
      }
    } catch (error) {
      reject()
    }
  })
}
