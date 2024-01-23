import { Isogon, IsogonShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IIsogonOptions = BaseShape<IsogonShape>

/**
 *  创建正多边形
 * @param options
 * @returns
 */
export function createIsogon(options?: IIsogonOptions): Isogon {
  const { common, other } = getCommonParams(options)
  const { x = 0, y = 0, r = 0, n = 0, ...rest } = other
  const shape = new Isogon({
    ...common,
    shape: {
      x,
      y,
      r,
      n
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}
