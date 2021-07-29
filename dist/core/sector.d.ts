import { Sector, SectorShape } from 'zrender';
import { BaseShape } from '../index';
export declare type ISectorOptions = BaseShape<SectorShape>;
/**
 *  创建圆
 * @param options
 * @returns
 */
declare function createSector(options?: ISectorOptions): Sector;
export default createSector;
