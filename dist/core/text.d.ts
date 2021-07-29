import { Text, TextStyleProps } from 'zrender';
import { BaseShape } from '../index';
export declare type ITextOptions = BaseShape<TextStyleProps>;
/**
 *  创建文字
 * @param options
 * @returns
 */
declare function createText(options?: ITextOptions): Text;
export default createText;
