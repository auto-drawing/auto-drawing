import { Ellipse, EllipseShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IEllipseOptions = BaseShape<EllipseShape>

/**
 *  创建椭圆
 * @param options
 * @returns
 */
export function createEllipse(options?: IEllipseOptions): Ellipse {
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
