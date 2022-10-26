import { Star, StarShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type IStarOptions = BaseShape<StarShape>

/**
 *  创建星形
 * @param options
 * @returns
 */
function createStar(options?: IStarOptions): Star {
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

export default createStar
