import { BezierCurve, BezierCurveShape } from 'zrender';
import { BaseShape } from '../index';
export declare type IBezierCurveOptions = BaseShape<BezierCurveShape>;
/**
 *  创建贝塞尔曲线
 * @param options
 * @returns
 */
declare function createBezierCurve(options?: IBezierCurveOptions): BezierCurve;
export default createBezierCurve;
