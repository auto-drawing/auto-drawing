import { Arc, ArcShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type IArcOptions = BaseShape<ArcShape> & { radius?: number; x?: number; y?: number }

/**
 *  创建圆弧
 * @param options
 * @returns
 */
function createArc(options?: IArcOptions): Arc {
  const { common, other } = getCommonParams(options)
  const { r = 0, cx = 0, cy = 0, startAngle = 0, endAngle = 360, clockwise = true, ...rest } = other
  const shape = new Arc({
    ...common,
    shape: {
      cx,
      cy,
      r,
      startAngle: (Math.PI / 180) * startAngle,
      endAngle: (Math.PI / 180) * endAngle,
      // 顺时针方向。
      clockwise
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}

export default createArc
