import { Line, LineShape } from 'zrender'
import { BaseShape } from '../index'

export type ILineOptions = BaseShape<LineShape & { zlevel?: number }>

/**
 *  创建直线
 * @param options
 * @returns
 */
function createLine(options?: ILineOptions): Line {
  const { x1 = 0, y1 = 0, x2 = 0, y2 = 0, zlevel = 0, percent = 1, ...rest } = options || {}
  const shape = new Line({
    zlevel,
    shape: { x1, y1, x2, y2, percent },
    style: {
      lineWidth: 1,
      lineCap: 'square',
      stroke: '#0f0',
      ...rest
    }
  })
  return shape
}

export default createLine
