import {
  createCanvas,
  createGroup,
  ShapeCoreType,
  Nullable,
  ZRenderType,
  ZRenderGroup,
  CallbackData
} from '../dist/index'

const data: ShapeCoreType[] = [
  {
    type: 'group',
    data: [
      {
        type: 'line',
        zlevel: 1,
        x1: 32,
        y1: 62,
        x2: 168,
        y2: 62,
        stroke: '#f8f8b8'
      },
      {
        type: 'line',
        zlevel: 1,
        x1: 168,
        y1: 62,
        x2: 168,
        y2: 139,
        stroke: '#f8f8b8'
      },
      {
        type: 'line',
        zlevel: 1,
        x1: 168,
        y1: 139,
        x2: 32,
        y2: 139,
        stroke: '#f8f8b8'
      },
      {
        type: 'line',
        zlevel: 1,
        x1: 32,
        y1: 139,
        x2: 32,
        y2: 62,
        stroke: '#f8f8b8'
      }
    ]
  },
  {
    type: 'rect',
    zlevel: 0,
    x: 26,
    y: 76,
    width: 40,
    height: 50,
    fill: '#ff8041',
    stroke: '#ff8041'
  },
  {
    type: 'rect',
    zlevel: 0,
    x: 135,
    y: 76,
    width: 40,
    height: 50,
    fill: '#00ff01',
    stroke: '#00ff01'
  },
  {
    type: 'line',
    zlevel: 0,
    x1: 96,
    y1: 100,
    x2: 104,
    y2: 100,
    stroke: '#f8f9b7'
  },
  {
    type: 'line',
    zlevel: 0,
    x1: 100,
    y1: 96,
    x2: 100,
    y2: 104,
    stroke: '#f8f9b7'
  },
  {
    type: 'sector',
    cx: 100,
    cy: 96,
    r: 100,
    r0: 0,
    startAngle: 0,
    endAngle: 90,
    fill: 'yellow',
    clockwise: true
  }
]

const originData: ShapeCoreType[] = [
  {
    type: 'line',
    zlevel: 0,
    x1: 96,
    y1: 100,
    x2: 104,
    y2: 100,
    lineDash: 'dashed',
    stroke: '#fff'
  },
  {
    type: 'line',
    zlevel: 0,
    x1: 100,
    y1: 96,
    x2: 100,
    y2: 104,
    lineDash: 'dashed',
    stroke: '#fff',
    text: '100',
    fontSize: 1000
  }
]

interface IState {
  zr: Nullable<ZRenderType>
  group: Nullable<ZRenderGroup>
  basicPoint: Nullable<ZRenderGroup>
  rotation: number
  translateX: number
  translateY: number
  currentInfo?: CallbackData
  originInfo?: CallbackData
}

const state: Partial<IState> = {}

const group = createGroup({
  scaleX: 0.1,
  scaleY: 0.1
})

console.log(group)
console.log(originData)
console.log(data)
console.log(state)
console.log(createCanvas)
