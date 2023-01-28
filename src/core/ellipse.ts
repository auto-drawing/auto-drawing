import { Ellipse, EllipseShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type IEllipseOptions = BaseShape<EllipseShape>

/**
 *  创建椭圆
 * @param options
 * @returns
 */
function createEllipse(options?: IEllipseOptions): Ellipse {
  const { common, other } = getCommonParams(options)
  const { cx = 0, cy = 0, rx = 0, ry = 0, ...rest } = other
  const shape = new Ellipse({
    ...common,
    shape: {
      cx,
      cy,
      rx,
      ry
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}

export default createEllipse
