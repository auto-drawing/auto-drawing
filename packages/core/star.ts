import { Star, StarShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IStarOptions = BaseShape<StarShape>

/**
 *  创建星形
 * @param options
 * @returns
 */
export function createStar(options?: IStarOptions): Star {
  const { common, other } = getCommonParams(options)
  const { cx = 0, cy = 0, r = 0, n = 3, r0 = 0, ...rest } = other
  const shape = new Star({
    ...common,
    shape: {
      cx,
      cy,
      n,
      r,
      r0
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}
