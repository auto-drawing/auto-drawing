import { Rect, RectShape } from 'zrender';
declare type IRectOptions = BaseShape<RectShape>;
/**
 *  创建矩形
 * @param options
 * @returns
 */
declare function createRect(options?: IRectOptions): Rect;
export default createRect;
