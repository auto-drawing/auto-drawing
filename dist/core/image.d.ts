import { Image as ZRImage, ImageStyleProps } from 'zrender';
import { BaseShape } from '../index';
export declare type IImageOptions = BaseShape<ImageStyleProps>;
/**
 *  创建图片
 * @param options
 * @returns
 */
declare function createImage(options?: IImageOptions): ZRImage;
export default createImage;
