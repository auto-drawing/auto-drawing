import { Rect, RectShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IRectOptions = BaseShape<RectShape>

/**
 *  创建矩形
 * @param options
 * @returns
 */
export function createRect(options?: IRectOptions): Rect {
  const { common, other } = getCommonParams(options)
  const { x = 0, y = 0, width = 0, height = 0, ...rest } = other
  const shape = new Rect({
    ...common,
    shape: {
      x,
      y,
      width,
      height
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}
