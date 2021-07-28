import { Rect, RectShape } from 'zrender';
import { BaseShape } from '../index';
export declare type IRectOptions = BaseShape<RectShape>;
/**
 *  创建矩形
 * @param options
 * @returns
 */
declare function createRect(options?: IRectOptions): Rect;
export default createRect;
