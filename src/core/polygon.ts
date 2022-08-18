import { Polygon, PolygonShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type IPolygonShapeOptions = BaseShape<PolygonShape>

/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
function createPolygon(options?: IPolygonShapeOptions): Polygon {
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

export default createPolygon
