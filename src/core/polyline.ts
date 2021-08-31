import { Polyline, PolylineShape } from 'zrender'
import { BaseShape } from '../index'

export type IPolylineShapeOptions = BaseShape<PolylineShape>

/**
 *  创建不闭合多边型
 * @param options
 * @returns
 */
function createPolyline(options?: IPolylineShapeOptions): Polyline {
  const { points = [], zlevel = 0, draggable = false } = options || {}
  const shape = new Polyline({
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

export default createPolyline
