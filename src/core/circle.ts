import { Circle, CircleShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type ICircleOptions = BaseShape<CircleShape & { radius: number; x: number; y: number }>

/**
 *  创建圆
 * @param options
 * @returns
 */
function createCircle(options?: ICircleOptions): Circle {
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

export default createCircle
