import { Isogon, IsogonShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type IIsogonOptions = BaseShape<IsogonShape>

/**
 *  创建正多边形
 * @param options
 * @returns
 */
function createIsogon(options?: IIsogonOptions): Isogon {
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

export default createIsogon
