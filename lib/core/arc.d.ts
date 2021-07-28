import { Arc, ArcShape } from 'zrender';
import { BaseShape } from '../index';
export declare type IArcOptions = BaseShape<ArcShape> & {
    radius?: number;
    x?: number;
    y?: number;
};
/**
 *  创建圆弧
 * @param options
 * @returns
 */
declare function createArc(options?: IArcOptions): Arc;
export default createArc;
