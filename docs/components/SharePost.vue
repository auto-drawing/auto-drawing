<template>
  <div id="sharePost" class="canvas-wrapper"></div>
</template>

<script setup lang="ts">
import FileSaver from 'file-saver'
import { onMounted, reactive } from 'vue'
import { createCanvas, createGroup, renderCanvas, canvasToImage } from 'auto-drawing'
import type { ZRenderType, ZRenderGroup, ShapeCoreType } from 'auto-drawing'

interface IState {
  zr: ZRenderType | null
  gp: ZRenderGroup | null
}

const state: IState = reactive({
  zr: null,
  gp: null
})

onMounted(() => {
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
      image: 'https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/post.png'
    },
    {
      type: 'image',
      x: 40,
      y: 20,
      width: 50,
      height: 50,
      image: 'https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/avatar.png',
      zlevel: 1
    },
    {
      type: 'text',
      x: 98,
      y: 24,
      text: '我的店铺',
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
      image: 'https://auto-drawing-doc-1252186245.cos.ap-beijing.myqcloud.com/code.jpg'
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

  renderCanvas(state.zr, state.gp, data)
})

// 下载
const download = async () => {
  try {
    const { blob, base64 } = await canvasToImage(state.zr as ZRenderType)
    console.log('blob:', blob)
    console.log('base64:', base64)
    FileSaver.saveAs(blob, 'post.png')
  } catch (error) {
    console.log(error)
    alert('下载失败')
  }
}
</script>

<style>
.btn {
  margin: 10px;
  text-align: left;
}
</style>
