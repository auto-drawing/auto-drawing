import { Droplet, DropletShape } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type IDropletOptions = BaseShape<DropletShape>

/**
 *  创建水滴
 * @param options
 * @returns
 */
export function createDroplet(options?: IDropletOptions): Droplet {
  const { common, other } = getCommonParams(options)
  const { cx = 0, cy = 0, width = 0, height = 0, ...rest } = other
  const shape = new Droplet({
    ...common,
    shape: {
      cx,
      cy,
      width,
      height
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}
