import { Circle, CircleShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type ICircleOptions = BaseShape<CircleShape & { radius: number; x: number; y: number }>

/**
 *  创建圆
 * @param options
 * @returns
 */
export function createCircle(options?: ICircleOptions): Circle {
  const { common, other } = getCommonParams(options)
  const { r = 0, cx = 0, cy = 0, ...rest } = other
  const shape = new Circle({
    ...common,
    shape: {
      cx,
      cy,
      r
    },
    style: {
      fill: 'none',
      stroke: '#00f',
      ...rest
    }
  })
  return shape
}
