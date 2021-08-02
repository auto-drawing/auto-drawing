import { Image as ZRImage, ImageStyleProps } from 'zrender'
import { BaseShape } from '../index'

export type IImageOptions = BaseShape<ImageStyleProps>

/**
 *  创建图片
 * @param options
 * @returns
 */
function createImage(options?: IImageOptions): ZRImage {
  const { x = 0, y = 0, width = 0, height = 0, zlevel = 0, image = '', ...rest } = options || {}
  const shape = new ZRImage({
    zlevel,
    style: {
      x,
      y,
      width,
      height,
      image,
      fill: 'none',
      stroke: 'none',
      ...rest
    }
  })
  return shape
}

export default createImage
