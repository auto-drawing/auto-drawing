import { Polygon, PolygonShape } from 'zrender';
declare type IPolygonShapeOptions = BaseShape<PolygonShape>;
/**
 *  创建闭合多边型
 * @param options
 * @returns
 */
declare function createPolygon(options?: IPolygonShapeOptions): Polygon;
export default createPolygon;
