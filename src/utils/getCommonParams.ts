/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
import { CommonType } from '../types'

/**
 *
 * @param options
 * @returns
 */
export const getCommonParams = (options?: Record<string, any>) => {
  const {
    /**
     * 	旋转的角度。 zrender是弧度 这里已经做了转换 转成了角度   默认 0
     */
    rotation = 0,
    /**
     * 	旋转和缩放的原点X。默认  0
     */
    originX = 0,
    /**
     * 	旋转和缩放的原点Y。默认 0
     */
    originY = 0,
    /**
     * 缩放X。默认 1
     */
    scaleX = 1,
    /**
     * 缩放Y。默认 1
     */
    scaleY = 1,
    /**
     * 	是否进行裁剪。默认false
     */
    culling = false,
    /**
     * 	鼠标移到元素上时的鼠标样式。 默认'pointer'
     */
    cursor = 'pointer',
    /**
     * 	图形是否可拖曳。  默认false
     */
    draggable = false,
    /**
     * 图形是否不可见，为 true 时不绘制图形，但是仍能触发鼠标事件。  默认false
     */
    invisible = false,
    /**
     * 是否渐进式渲染。当图形元素过多时才使用，用大于 0 的数字表示渲染顺序。  默认 -1
     */
    progressive = 1,
    /**
     * 	是否使用包围盒检验鼠标是否移动到物体。false 则检测元素实际的内容。 默认 false
     */
    rectHover = false,
    /**
     * 	是否响应鼠标事件。 默认 false
     */
    silent = false,
    /**
     * 控制图形的前后顺序。z 值小的图形会被 z 值大的图形覆盖。z 相比 zlevel 优先级更低，而且不会创建新的 Canvas。 默认 0
     */
    z = 0,
    /**
     * 0与 z 类似，优先级比 z 更低。 默认 0
     */
    z2 = 0,
    /**
     * 图形层级  默认 0
     */
    zlevel = 0,
    ...other
  } = options || {}
  const common: CommonType = {
    rotation: (Math.PI / 180) * rotation,
    originX,
    originY,
    scaleX,
    scaleY,
    culling,
    cursor,
    draggable,
    invisible,
    progressive,
    rectHover,
    silent,
    z,
    z2,
    zlevel
  }
  return {
    common,
    other
  }
}
