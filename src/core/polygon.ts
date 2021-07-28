import { Polygon, PolygonShape } from 'zrender'

type IPolygonShapeOptions = BaseShape<PolygonShape>

/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
function createPolygon(options?: IPolygonShapeOptions): Polygon {
  const { points = [], zlevel = 0 } = options || {}
  const shape = new Polygon({
    zlevel,
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
