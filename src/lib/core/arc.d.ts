import { Arc, ArcShape } from 'zrender';
declare type IArcOptions = BaseShape<ArcShape> & {
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
