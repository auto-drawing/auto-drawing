import { Text, TextStyleProps } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type ITextOptions = BaseShape<TextStyleProps>

/**
 *  创建文字
 * @param options
 * @returns
 */
function createText(options?: ITextOptions): Text {
  const { common, other } = getCommonParams(options)
  const { text, x = 0, y = 0, ...rest } = other
  const shape = new Text({
    ...common,
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
