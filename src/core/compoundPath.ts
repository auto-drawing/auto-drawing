import { CompoundPath, CompoundPathShape, Polygon, Polyline } from 'zrender'
import { BaseShape } from '../index'
import { getCommonParams } from '../utils/getCommonParams'

export type ICompoundPathOptions = BaseShape<CompoundPathShape> & {
  /**
   * 路径集合，默认不闭合
   */
  paths: number[][]
  /**
   * 路径是否闭合
   */
  isClose?: number
}

/**
 *  创建复合路径
 * @param options
 * @returns
 */
function createCompoundPath(options?: ICompoundPathOptions): CompoundPath {
  const { common, other } = getCommonParams(options)
  const { paths = [], isClose = true, ...rest } = other
  const PathShape = isClose ? Polygon : Polyline
  const shape = new CompoundPath({
    ...common,
    shape: {
      paths: [
        new PathShape({
          shape: { points: paths }
        })
      ]
    },
    style: {
      fill: 'none',
      stroke: '#fff',
      ...rest
    }
  })
  return shape
}

export default createCompoundPath
