import { Polygon, PolygonShape } from 'zrender'
import { BaseShape } from '../index'

export type IPolygonShapeOptions = BaseShape<PolygonShape>

/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
function createPolygon(options?: IPolygonShapeOptions): Polygon {
  const { points = [], zlevel = 0, draggable = false } = options || {}
  const shape = new Polygon({
    zlevel,
    draggable,
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
