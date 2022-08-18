import { Polyline, PolylineShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type IPolylineShapeOptions = BaseShape<PolylineShape>

/**
 *  创建不闭合多边型
 * @param options
 * @returns
 */
function createPolyline(options?: IPolylineShapeOptions): Polyline {
  const { common, other } = getCommonParams(options)
  const { points = [] } = other
  const shape = new Polyline({
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

export default createPolyline
