import { CompoundPath, CompoundPathShape } from 'zrender';
declare type ICompoundPathOptions = BaseShape<CompoundPathShape> & {
    /**
     * 路径集合，默认不闭合
     */
    paths: number[][];
    /**
     * 路径是否闭合
     */
    isClose?: number;
};
/**
 *  创建复合路径
 * @param options
 * @returns
 */
declare function createCompoundPath(options?: ICompoundPathOptions): CompoundPath;
export default createCompoundPath;
