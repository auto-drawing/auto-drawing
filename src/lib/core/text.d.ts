import { Text, TextStyleProps } from 'zrender';
declare type ITextOptions = BaseShape<TextStyleProps>;
/**
 *  创建文字
 * @param options
 * @returns
 */
declare function createText(options?: ITextOptions): Text;
export default createText;
