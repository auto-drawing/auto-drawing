import {
  createCanvas,
  createGroup,
  renderCanvas,
  createImage,
  createCircle,
  ZRenderType,
  ZRenderGroup,
  ShapeCoreType
} from '../dist'

interface IState {
  zr: ZRenderType | null
  gp: ZRenderGroup | null
}

const state: IState = {
  zr: null,
  gp: null
}

const width = 375
const height = 592
state.zr = createCanvas('sharePost', {
  width,
  height
})
state.zr.setBackgroundColor('#ff6e0b')
state.gp = createGroup()
const data: ShapeCoreType[] = [
  {
    type: 'image',
    x: 0,
    y: 0,
    width: 375,
    height: 592,
    image: '/auto-drawing-doc/post.png'
  },
  // {
  //   type: 'image',
  //   x: 40,
  //   y: 20,
  //   width: 50,
  //   height: 50,
  //   image: '/auto-drawing-doc/avatar.jpg',
  //   zlevel: 1
  // },
  {
    type: 'text',
    x: 98,
    y: 24,
    text: 'xiaofei的店铺',
    fontSize: 16,
    fill: '#fff'
  },
  {
    type: 'text',
    x: 98,
    y: 50,
    text: '邀请你共享优惠',
    fontSize: 12,
    fill: '#ffd3a2'
  },
  {
    type: 'text',
    x: 50,
    y: 400,
    text: '￥99.9',
    fontSize: 32,
    fill: '#f00'
  },
  {
    type: 'text',
    x: 150,
    y: 410,
    text: '￥1999.9',
    fontSize: 12,
    fill: '#999'
  },
  {
    type: 'line',
    x1: 158,
    y1: 414,
    x2: 200,
    y2: 414,
    stroke: '#999'
  },
  {
    type: 'text',
    x: 60,
    y: 440,
    text: '自营',
    fontSize: 12,
    backgroundColor: '#fa4f00',
    padding: 2,
    borderRadius: 5
  },
  {
    type: 'text',
    x: 96,
    y: 440,
    text: '30天最低价',
    fontSize: 12,
    fill: '#805609',
    backgroundColor: '#faf5d9',
    padding: 2
  },
  {
    type: 'text',
    x: 168,
    y: 440,
    text: '包邮',
    fontSize: 12,
    fill: '#805609',
    backgroundColor: '#faf5d9',
    padding: 2
  },
  {
    type: 'text',
    x: 200,
    y: 440,
    text: '满减优惠',
    fontSize: 12,
    fill: '#805609',
    backgroundColor: '#faf5d9',
    padding: 2
  },
  {
    type: 'text',
    x: 55,
    y: 480,
    text: '精美兔子毛绒',
    fontSize: 24,
    fill: '#000'
  },
  {
    type: 'text',
    x: 55,
    y: 510,
    text: '玩具，回家必备。',
    fontSize: 24,
    fill: '#000'
  },
  {
    type: 'image',
    x: 250,
    y: 472,
    width: 70,
    height: 70,
    image: '/auto-drawing-doc/code.jpg'
  },
  {
    type: 'text',
    x: 320,
    y: 210,
    text: '兔 年 快 乐',
    fontSize: 20,
    fill: '#fa4f00',
    rotation: -90,
    originX: 320,
    originY: 210
  }
]

const image = createImage({
  x: 40,
  y: 20,
  width: 50,
  height: 50,
  image: '/auto-drawing-doc/avatar.jpg',
  zlevel: 1
})
const circle = createCircle({
  cx: 65,
  cy: 45,
  r: 30,
  zlevel: 2
})

image.setClipPath(circle)
state.zr.add(image)

renderCanvas(state.zr, state.gp, data, {
  scale: true,
  translate: true
})
