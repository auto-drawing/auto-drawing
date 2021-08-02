import { GroupProps } from 'zrender';
import * as zrender from 'zrender';
import createLine from './core/line';
import createRect from './core/rect';
import createCircle from './core/circle';
import createArc from './core/arc';
import createCompoundPath from './core/compoundPath';
import createPolygon from './core/polygon';
import createPolyline from './core/polyline';
import createText from './core/text';
import createBezierCurve from './core/bezierCurve';
import createImage from './core/image';
import { ZRenderInitOptions, ZRenderType, ShapeCoreType, AllShape, ZRenderGroup, CallbackType } from './types';
export * from './types';
export * from './utils';
export { zrender, createLine, createRect, createCircle, createArc, createPolygon, createPolyline, createText, createBezierCurve, createImage, createCompoundPath };
/**
 * 创建容器
 * @param element  HTML元素本身 或者 HTML的id
 * @param options 初始参数
 * @returns zrender 实例
 */
export declare function createCanvas(element: HTMLElement | string, options?: ZRenderInitOptions | undefined): ZRenderType;
/**
 * 销毁容器
 * @param zr
 */
export declare function disposeCanvas(zr: ZRenderType): void;
/**
 * 创建Group
 */
export declare function createGroup(options?: GroupProps): ZRenderGroup;
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
export declare function renderCanvas(zr: ZRenderType, group: ZRenderGroup, data: ShapeCoreType[], options?: Partial<{
    scale: boolean;
    translate: boolean;
    callback: CallbackType;
}>): void;
