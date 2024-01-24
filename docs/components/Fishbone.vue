<template>
  <div class="container">
    <div ref="mainElementRef" class="main-element" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, shallowReactive, ref, reactive } from 'vue'
import type { ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'
import { createCanvas, createGroup, renderCanvas } from 'auto-drawing'
import type { Params } from './utils'
import { getCircle, getLine, getText } from './utils'

interface IState {
  zr: Nullable<ZRenderType>
  group: Nullable<ZRenderGroup>
  clickGroup: Nullable<ZRenderGroup>
}

type Direction = 'left' | 'right'

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

onMounted(() => {
  state.zr = createCanvas(mainElementRef.value as HTMLDivElement) as ZRenderType
  state.group = createGroup(baseOptions) as ZRenderGroup
  state.clickGroup = createGroup(baseOptions) as ZRenderGroup
  state.zr.setBackgroundColor('#fff')

  // 原数据
  const originData: string[] = [...new Array(30)].map((_, index) => String(index))

  // 画布两边留白
  const gutter = 40
  // 鱼刺往后斜的距离
  const angleLength = props.width / 20
  // 鱼刺方向
  const direction: Direction = 'left'
  // 鱼刺长度
  const fishboneLength = (props.height / 2 - gutter) / 2
  // 主轴的基本坐标
  const base = props.width / 2 - gutter
  // 主轴数据
  const main = originData.slice(0, 2)
  // 鱼刺数据
  const body = originData.slice(2)
  // 主轴上面鱼刺数据
  const bodyTop = body.slice(0, Math.ceil(body.length / 2))
  // 主轴下面鱼刺数据
  const bodyBottom = body.slice(Math.ceil(body.length / 2))
  // 主抽的点数量
  const pointCount = Math.max(bodyTop.length, bodyBottom.length)
  // 主抽每个点之间的间距
  const pointStep = (props.width - gutter * 2) / (pointCount + 1)

  // 生成主轴点数据
  const point = [...new Array(pointCount)].map((item, index) => {
    return [-base + (index + 1) * pointStep, 0]
  })

  // 生成鱼刺方法
  const getData = (item: string, index: number, type: string) => {
    const mark = type === 'top' ? -1 : 1
    const directionMark = direction === 'left' ? -1 : 1
    const [baseX, baseY] = point[index]
    const params: Params = {
      start: point[index],
      end: [baseX + angleLength * directionMark, fishboneLength * mark],
      title: item,
      pointType: 'basicPoint',
      tag: 'start'
    }
    // 生成主轴基点圆图形数据
    const baseCircle = getCircle(baseX, baseY, params)
    const [x1, y1] = baseCircle.params.start as number[]
    const [x2, y2] = baseCircle.params.end as number[]
    // 生成鱼刺圆点图形数据
    const bodyTop = getCircle(x2, y2, {
      ...baseCircle.params,
      pointType: 'endpoint',
      tag: 'end'
    })
    // 生成鱼刺直线图形数据
    const line = getLine(x1, y1, x2, y2)
    // 生成鱼刺文字图形数据
    const offset = mark === -1 ? -24 : 14
    const text = getText(x2 - 10, y2 + offset, baseCircle.params.title)
    return { type: 'group', data: [baseCircle, bodyTop, line, text], params }
  }

  /** 上鱼刺数据处理 */
  const bodyTopData = bodyTop.map((item, index) => getData(item, index, 'top'))

  /** 下鱼刺数据处理 */
  const bodyBottomData = bodyBottom.map((item, index) => getData(item, index, 'bottom'))

  /** 主抽数据处理 */
  const mainCircleData = main.map((item, index) => {
    const cx = index === 0 ? -base : base
    const cy = 0
    const title = item
    const params: Params = {
      title: item,
      cx,
      cy,
      pointType: 'endpoint',
      point: [cx, cy]
    }
    // 主抽圆点图数据
    const circle = getCircle(cx, 0, params)
    // 主抽文字图数据
    const x = cx - 6
    const y = cy - 24
    const text = getText(x, y, title)
    return { type: 'group', data: [circle, text], params }
  })
  const mainLineMap = mainCircleData.map(item => item.params.point as number[])
  const [[x1, y1], [x2, y2]] = mainLineMap
  // 主抽直线图数据
  const mainLineData = getLine(x1, y1, x2, y2)
  // 主抽整体图数据
  const mainData = [...mainCircleData, mainLineData]

  // 所有数据
  const data = [...mainData, ...bodyTopData, ...bodyBottomData] as ShapeCoreType[]

  renderCanvas(state.zr, state.group, data, { scale: true, translate: true })
  renderCanvas(state.zr, state.clickGroup, [], {
    scale: true,
    translate: true
  })

  state.zr.on('click', (e: any) => {
    const { shape, type } = e?.target || {}
    const params = (e?.target?.params as Params) || {}
    if (!shape || type !== 'circle' || params.pointType !== 'endpoint') return
    const data: ShapeCoreType = {
      type: 'circle',
      ...shape,
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
  height: v-bind('containerCSS.height');
  width: v-bind('containerCSS.width');
  overflow: hidden;
  padding: 0;
  .main-element {
    padding: 0;
  }
}
</style>
