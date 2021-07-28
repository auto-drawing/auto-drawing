import { Circle, CircleShape } from 'zrender';
import { BaseShape } from '../index';
export declare type ICircleOptions = BaseShape<CircleShape & {
    radius: number;
    x: number;
    y: number;
}>;
/**
 *  创建圆
 * @param options
 * @returns
 */
declare function createCircle(options?: ICircleOptions): Circle;
export default createCircle;
