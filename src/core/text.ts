import { Text, TextStyleProps } from 'zrender'
import { BaseShape } from '../index'

export type ITextOptions = BaseShape<TextStyleProps>

/**
 *  创建文字
 * @param options
 * @returns
 */
function createText(options?: ITextOptions): Text {
  const { text, x = 0, y = 0, zlevel = 0, ...rest } = options || {}
  const shape = new Text({
    zlevel,
    style: {
      x,
      y,
      text,
      fill: '#fff',
      stroke: 'none',
      fontSize: 16,
      fontWeight: 400,
      ...rest
    }
  })
  return shape
}

export default createText
