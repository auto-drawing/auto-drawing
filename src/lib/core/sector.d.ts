import { Sector, SectorShape } from 'zrender';
declare type ISectorOptions = BaseShape<SectorShape>;
/**
 *  创建圆
 * @param options
 * @returns
 */
declare function createSector(options?: ISectorOptions): Sector;
export default createSector;
