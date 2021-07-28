import { Group } from 'zrender';
import * as zrender from 'zrender';
import createLine from './core/line';
import createRect from './core/rect';
import createCircle from './core/circle';
import createArc from './core/arc';
import createCompoundPath from './core/compoundPath';
import createPolygon from './core/polygon';
import createText from './core/text';
import createBezierCurve from './core/bezierCurve';
export * from './utils';
export { zrender, Group, createLine, createRect, createCircle, createArc, createCompoundPath, createPolygon, createText, createBezierCurve };
/**
 * 创建容器
 * @param -
 * @param options
 * @returns
 */
export declare function createCanvas(element: HTMLElement | string, options?: ZRenderInitOptions | undefined): CustomZRender;
/**
 * 销毁容器
 * @param zr
 */
export declare function disposeCanvas(zr: CustomZRender): void;
/**
 *  根据数据生成图
 * @param group
 * @param item
 */
export declare function generateShape(item: ShapeCoreType, _index?: number): AllShape;
/**
 * 渲染图形到画布
 * @param zr
 * @param group
 * @param data
 * @param options `scale：是否需要缩放 translate：是否需要平移`
 * @default options =  { scale: false, translate: true }
 */
export declare function renderCanvas(zr: CustomZRender, group: ZRenderGroup, data: ShapeCoreType[], options?: Partial<{
    scale: boolean;
    translate: boolean;
    callback: CallbackType;
}>): void;
