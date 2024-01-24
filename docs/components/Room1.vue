<template>
  <div class="container">
    <div ref="mainElementRef" class="main"></div>
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue'
import { createCanvas, createGroup, renderCanvas, ZRenderGroup, ZRenderType } from 'auto-drawing'
import type { ShapeCoreType } from 'auto-drawing'
import axios from 'axios'

type Nullable<T> = T | null

interface IState {
  zr: Nullable<ZRenderType>
  group: Nullable<ZRenderGroup>
  loading: boolean
}

/**
 * 生成圆弧
 * @param cx
 * @param cy
 * @param params
 * @returns
 */
const getCircle = (cx: number, cy: number, r: number, startAngle: number, endAngle: number) => ({
  type: 'arc',
  cx: cx,
  cy: cy,
  startAngle,
  endAngle,
  r,
  fill: 'none',
  stroke: 'green',
  zlevel: 1
})

/**
 * 生成直线
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
const getLine = (x1: number, y1: number, x2: number, y2: number, stroke = '#fff') => ({
  type: 'line',
  x1,
  y1,
  x2,
  y2,
  stroke,
  fill: '#fff'
})

/**
 * 生成文字
 * @param x
 * @param y
 * @param text
 * @returns
 */
const getText = (x: number, y: number, text: string) => ({
  type: 'text',
  x,
  y,
  text: text,
  fontSize: 6,
  fontWeight: 400,
  stroke: '#fff',
  fill: '#fff',
  zlevel: 10
})

const state = reactive<IState>({ zr: null, group: null, loading: true })
const mainElementRef = ref<any>(null)

const width = 688
const height = 400
const rate = 50

const baseOptions = { x: 260, y: height - 100 }
onMounted(() => {
  state.zr = createCanvas(mainElementRef.value, {
    width,
    height
  })
  state.group = createGroup(baseOptions)
  axios.get('https://xf-1252186245.cos.ap-chengdu.myqcloud.com/room.json').then(res => {
    const data = res.data.data
    const shapeData = data.map((item: any) => {
      if (item['名称'] === '直线') {
        const x1 = Number(item['起点X']) / rate
        const y1 = -Number(item['起点Y']) / rate
        const x2 = Number(item['端点X']) / rate
        const y2 = -Number(item['端点Y']) / rate
        const layout = item['图层']
        const color: Record<string, string> = {
          标注: 'red',
          '0': 'yellow',
          墙线: '#fff',
          轴线: 'green',
          楼梯: '#ccc',
          门窗: '#eee'
        }
        const stroke = color[layout] || '#fff'
        return getLine(x1, y1, x2, y2, stroke)
      }
      if (item['名称'] === '圆弧') {
        const cx = Number(item['中心X']) / rate
        const cy = -Number(item['中心Y']) / rate
        const r = Number(item['半径']) / rate
        const startAngle = Number(item['起点角度'])
        const endAngle = startAngle + Number(item['总角度'])
        return getCircle(cx, cy, r, startAngle, endAngle)
      }
      if (item['名称'] === '多行文字') {
        const x = Number(item['位置X']) / rate
        const y = -Number(item['位置Y']) / rate
        const text = item['内容']
        return getText(x, y, text)
      }
      return {
        type: 'group',
        data: []
      }
    }) as ShapeCoreType[]

    renderCanvas(state.zr as ZRenderType, state.group as ZRenderGroup, shapeData, {
      translate: true,
      scale: true
    })
    state.loading = false
  })
})

onBeforeUnmount(() => {
  state.zr && state.zr.dispose()
})
</script>

<style scoped>
.container {
  padding: 40px;
  background: #000;
  box-sizing: border-box;
  overflow: hidden;
}
</style>
