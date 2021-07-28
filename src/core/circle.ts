import { Circle, CircleShape } from 'zrender'

type ICircleOptions = BaseShape<CircleShape & { radius: number; x: number; y: number }>

/**
 *  创建圆
 * @param options
 * @returns
 */
function createCircle(options?: ICircleOptions): Circle {
  const { r = 0, cx = 0, cy = 0, zlevel = 0, ...rest } = options || {}
  const shape = new Circle({
    zlevel,
    shape: {
      cx,
      cy,
      r
    },
    style: {
      fill: 'none',
      stroke: '#00f',
      ...rest
    }
  })
  return shape
}

export default createCircle
