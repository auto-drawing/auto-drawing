import { Heart, HeartShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IHeartOptions = BaseShape<HeartShape>

/**
 *  创建心形
 * @param options
 * @returns
 */
export function createHeart(options?: IHeartOptions): Heart {
  const { common, other } = getCommonParams(options)
  const { cx = 0, cy = 0, width = 0, height = 0, ...rest } = other
  const shape = new Heart({
    ...common,
    shape: {
      cx,
      cy,
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
