import { Rose, RoseShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IRoseOptions = BaseShape<RoseShape>

/**
 *  创建玫瑰线
 * @param options
 * @returns
 */
export function createRose(options?: IRoseOptions): Rose {
  const { common, other } = getCommonParams(options)
  const { cx = 0, cy = 0, r = [], n = 1, k = 0, ...rest } = other
  const shape = new Rose({
    ...common,
    shape: {
      cx,
      cy,
      n,
      r,
      k
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}
