import { ZRenderType } from '../index';
/**
 * 平移ZRender画布
 * @param zr  ZRender 实例
 */
export declare function translateCanvas(zr: ZRenderType): void;
/**
 * 缩放ZRender画布
 * @param  zr  ZRender 实例
 * @param options  `{scaleMin:number, scaleMax:number}`  scaleMin：缩放最小值 scaleMax：缩放最大值
 * @default options = {scaleMin:0.5,scaleMax:100}
 */
export declare function scaleCanvas(zr: ZRenderType, options?: {
    scaleMin: number;
    scaleMax: number;
}): void;
