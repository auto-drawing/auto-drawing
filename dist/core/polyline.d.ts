import { Polyline, PolylineShape } from 'zrender';
import { BaseShape } from '../index';
export declare type IPolylineShapeOptions = BaseShape<PolylineShape>;
/**
 *  创建不闭合多边型
 * @param options
 * @returns
 */
declare function createPolyline(options?: IPolylineShapeOptions): Polyline;
export default createPolyline;
