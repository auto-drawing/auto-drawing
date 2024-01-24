<template>
  <div class="container">
    <div ref="mainElementRef" class="main-element" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, shallowReactive, ref, reactive } from 'vue'
import type { ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
type Params = {
  /**
   * 开始坐标
   */
  start?: number[]
  /**
   * 结束坐标
   */
  end?: number[]
  /**
   * 标题
   */
  title: string
  /**
   * 圆点的类型  basicPoint：基点 不可点击   endpoint：端点 可点击
   */
  pointType: 'basicPoint' | 'endpoint' | ''
  /**
   * 圆的圆心x坐标
   */
  cx?: number
  /**
   * 圆的圆心y坐标
   */
  cy?: number
}
type Nullable<T> = T | null

interface IState {
  zr: Nullable<ZRenderType>
  group: Nullable<ZRenderGroup>
  clickGroup: Nullable<ZRenderGroup>
}

const props = defineProps({
  /**
   * 画布宽
   */
  width: {
    type: Number,
    default: 688
  },
  /**
   * 画布高
   */
  height: {
    type: Number,
    default: 400
  }
})

const state = shallowReactive<IState>({
  zr: null,
  group: null,
  clickGroup: null
})
const mainElementRef = ref<any>(null)
// 基本配置
const baseOptions = { x: props.width / 2, y: props.height / 2 }
// 画布两边留白
const gutter = 40

onMounted(() => {
  state.zr = createCanvas(mainElementRef.value as HTMLDivElement) as ZRenderType
  state.group = createGroup(baseOptions) as ZRenderGroup
  state.clickGroup = createGroup(baseOptions) as ZRenderGroup

  const mainRadius = props.height / 2 - gutter

  const main = {
    type: 'circle',
    cx: 0,
    cy: 0,
    r: mainRadius,
    fill: '#ccc',
    stroke: '#ccc',
    zlevel: 1
  }

  const terminal = [...new Array(50)].map((_, index) => {
    const q = [+1, -1]
    const getMark = () => q.at(Math.floor(Math.random() * 2)) as number
    const cx = ((Math.random() * mainRadius * Math.sqrt(2)) / 2 - 12) * getMark()
    const cy = ((Math.random() * mainRadius * Math.sqrt(2)) / 2 - 12) * getMark()
    return {
      type: 'group',
      params: {
        title: index,
        pointType: 'endpoint'
      },
      data: [
        {
          type: 'circle',
          cx,
          cy,
          r: 12,
          fill: 'green',
          stroke: 'green',
          zlevel: 1
        },
        {
          type: 'circle',
          cx,
          cy,
          r: 8,
          fill: 'blue',
          stroke: 'blue',
          zlevel: 2
        },
        {
          type: 'circle',
          cx,
          cy,
          r: 4,
          fill: '#ccc',
          stroke: '#ccc',
          zlevel: 2
        }
      ]
    }
  })

  // 所有数据
  const data = [main, ...terminal] as ShapeCoreType[]

  renderCanvas(state.zr, state.group, data, {
    scale: true,
    translate: true
  })
  renderCanvas(state.zr, state.clickGroup, [], {
    scale: true,
    translate: true
  })

  state.zr.on('click', (e: any) => {
    const { shape, type, parent } = e?.target || {}
    const params = (parent?.params as Params) || {}

    if (!shape || type !== 'circle' || params.pointType !== 'endpoint') return
    const data: ShapeCoreType = {
      type: 'circle',
      ...shape,
      r: 12,
      stroke: 'red',
      fill: 'red',
      zlevel: 2
    }
    // 移除之前的图形
    state.clickGroup?.removeAll()
    renderCanvas(state.zr as ZRenderType, state.clickGroup as ZRenderGroup, [data], {
      scale: true,
      translate: true
    })
    setTimeout(() => {
      alert('点了我：' + params.title)
    })
  })
})

onBeforeUnmount(() => {
  // 销毁画布
  state.zr && state.zr.dispose()
})

const containerCSS = reactive({
  width: props.width + 'px',
  height: props.height + 'px'
})
</script>

<style lang="scss" scoped>
.container {
  height: v-bind(' containerCSS.height');
  width: v-bind(' containerCSS.width');
  overflow: hidden;
  padding: 0;
  .main-element {
    padding: 0;
  }
}
</style>
