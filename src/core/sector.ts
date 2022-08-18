import { Sector, SectorShape } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type ISectorOptions = BaseShape<SectorShape>

/**
 *  创建扇形
 * @param options
 * @returns
 */
function createSector(options?: ISectorOptions): Sector {
  const { common, other } = getCommonParams(options)
  const {
    r = 0,
    cx = 0,
    cy = 0,
    r0 = 0,
    startAngle = 0,
    endAngle = 0,
    clockwise = true,
    ...rest
  } = other
  const shape = new Sector({
    ...common,
    shape: {
      cx,
      cy,
      r,
      r0,
      startAngle: (Math.PI / 180) * startAngle,
      endAngle: (Math.PI / 180) * endAngle,
      // 顺时针方向。
      clockwise
    },
    style: {
      fill: 'none',
      stroke: 'none',
      ...rest
    }
  })
  return shape
}

export default createSector
