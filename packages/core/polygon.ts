import { Polygon, PolygonShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IPolygonShapeOptions = BaseShape<PolygonShape>

/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
export function createPolygon(options?: IPolygonShapeOptions): Polygon {
  const { common, other } = getCommonParams(options)
  const { points = [] } = other
  const shape = new Polygon({
    ...common,
    shape: {
      points
    },
    style: {
      fill: 'none',
      stroke: '#0f0',
      ...options
    }
  })
  return shape
}
