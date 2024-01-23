import { Text, TextStyleProps } from 'zrender'
import { BaseShape } from '@auto-drawing/types'
import { getCommonParams } from '@auto-drawing/utils'

export type ITextOptions = BaseShape<TextStyleProps>

/**
 *  创建文字
 * @param options
 * @returns
 */
export function createText(options?: ITextOptions): Text {
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
