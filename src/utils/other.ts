/*eslint-disable @typescript-eslint/no-explicit-any */
import { ZRenderType } from '../index'

/**
 * 平移ZRender画布
 * @param zr  ZRender 实例
 */
export function translateCanvas(zr: ZRenderType): void {
  const state = { startX: 0, startY: 0 }
  zr.dragData = { drag: false, pos: [0, 0], group: null, target: null }
  zr.on('mousedown', (e: any) => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    canvas.style.transition = 'all 0.3s'
    const { clientX: startX, clientY: startY } = e.event
    state.startX = startX
    state.startY = startY
  })
  zr.on('mouseup', (e: any) => {
    const { clientX, clientY } = e.event
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    const stepX = clientX - state.startX
    const stepY = clientY - state.startY
    canvas.style.left = parseInt(canvas.style.left) + stepX + 'px'
    canvas.style.top = parseInt(canvas.style.top) + stepY + 'px'
  })
}

/**
 * 缩放ZRender画布
 * @param  zr  ZRender 实例
 * @param options  `{scaleMin:number, scaleMax:number}`  scaleMin：缩放最小值 scaleMax：缩放最大值
 * @default options = {scaleMin:0.5,scaleMax:100}
 */
export function scaleCanvas(
  zr: ZRenderType,
  options?: { scaleMin: number; scaleMax: number }
): void {
  const { scaleMin = 0.5, scaleMax = 100 } = options || {}
  zr.scale = 1.0
  zr.on('mousewheel', function (e: any) {
    const newScale = (zr.scale as number) + e.wheelDelta / 10
    if (newScale < scaleMin || newScale > scaleMax) return
    zr.scale = newScale
    zr.storage.getDisplayList(true, true).forEach(function (x: any) {
      x.attr('scale', [zr.scale, zr.scale])
    })
    zr.refresh()
  })
}
