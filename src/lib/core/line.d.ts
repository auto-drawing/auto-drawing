import { Line, LineShape } from 'zrender';
export declare type ILineOptions = BaseShape<LineShape & {
    zlevel?: number;
}>;
/**
 *  创建直线
 * @param options
 * @returns
 */
declare function createLine(options?: ILineOptions): Line;
export default createLine;
