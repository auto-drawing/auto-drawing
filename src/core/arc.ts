import { Arc, ArcShape } from 'zrender'
import { BaseShape } from '../index'

export type IArcOptions = BaseShape<ArcShape> & { radius?: number; x?: number; y?: number }

/**
 *  创建圆弧
 * @param options
 * @returns
 */
function createArc(options?: IArcOptions): Arc {
  const {
    r = 0,
    cx = 0,
    cy = 0,
    startAngle = 0,
    endAngle = 360,
    zlevel = 0,
    clockwise = true,
    ...rest
  } = options || {}
  const shape = new Arc({
    zlevel,
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
      stroke: 'rgba(0,0,255,0.5)',
      ...rest
    }
  })
  return shape
}

export default createArc
