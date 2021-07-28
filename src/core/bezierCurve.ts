import { BezierCurve, BezierCurveShape } from 'zrender'

type IBezierCurveOptions = BaseShape<BezierCurveShape>

/**
 *  创建贝塞尔曲线
 * @param options
 * @returns
 */
function createBezierCurve(options?: IBezierCurveOptions): BezierCurve {
  const { x1, y1, x2, y2, cpx1, cpy1, cpx2, cpy2, percent = 1, zlevel = 0, ...rest } = options || {}
  const shape = new BezierCurve({
    zlevel,
    shape: {
      // 必选参数
      x1,
      y1,
      x2,
      y2,
      cpx1,
      cpy1,
      // 下面参数可选
      cpx2,
      cpy2,
      percent
    },
    style: {
      fill: 'none',
      stroke: '#0f0',
      ...rest
    }
  })
  return shape
}

export default createBezierCurve
