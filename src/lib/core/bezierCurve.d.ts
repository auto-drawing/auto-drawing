import { BezierCurve, BezierCurveShape } from 'zrender';
declare type IBezierCurveOptions = BaseShape<BezierCurveShape>;
/**
 *  创建贝塞尔曲线
 * @param options
 * @returns
 */
declare function createBezierCurve(options?: IBezierCurveOptions): BezierCurve;
export default createBezierCurve;
