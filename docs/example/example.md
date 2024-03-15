# 示例

## 分销海报

<CodeCard fileName='SharePost'  title='分销海报(下载可以拿到海报blob base64数据)' >
 <SharePost /> 
</CodeCard>

## 线段矩形扇形

<CodeCard fileName='RectSector'  title='线段矩形扇形' >
 <RectSector /> 
</CodeCard>

## 户型图-1

<CodeCard fileName='Room1' title='户型图' >
<Room1 /> 
</CodeCard>

## 户型图-2

<CodeCard fileName='Room2' title='户型图' >
<Room2 /> 
</CodeCard>

## 示例-1

<CodeCard fileName='ElectronicComponents1'  title='示例' >
 <ElectronicComponents1 /> 
</CodeCard>

## 示例-2

<CodeCard fileName='ElectronicComponents2' title='示例'>
 <ElectronicComponents2 /> 
</CodeCard>

## 示例-3

<CodeCard fileName='ElectronicComponents3' title='示例'>
 <ElectronicComponents3 /> 
</CodeCard>

## 示例-4

<CodeCard fileName='ElectronicComponents4' title='示例'>
 <ElectronicComponents4 />
</CodeCard>

## 示例-5

<CodeCard fileName='ElectronicComponents5' title='示例'>
 <ElectronicComponents5 />
</CodeCard>

## 鱼骨图

<CodeCard fileName='Fishbone'  title='鱼骨图'  >
 <Fishbone /> 
</CodeCard>

## 圆点图

<CodeCard fileName='DotChart' title='圆点图'   >
 <DotChart /> 
</CodeCard>

<!-- ## PCB 图

<CodeCard fileName='CircuitBoard' title='百万级别数据,移除了缩放和平移功能' >
<CircuitBoard />
</CodeCard> -->

## [更多示例](https://github.com/l-x-f/auto-drawing/tree/main/tests)

<script setup>
import { provide} from 'vue'
import RectSector from '../components/RectSector.vue'
import ElectronicComponents1 from '../components/ElectronicComponents1.vue'
import ElectronicComponents2 from '../components/ElectronicComponents2.vue'
import ElectronicComponents3 from '../components/ElectronicComponents3.vue'
import ElectronicComponents4 from '../components/ElectronicComponents4.vue'
import ElectronicComponents5 from '../components/ElectronicComponents5.vue'
import Fishbone from '../components/Fishbone.vue'
import DotChart from '../components/DotChart.vue'
import CircuitBoard from '../components/CircuitBoard.vue'
import Room1 from '../components/Room1.vue'
import Room2 from '../components/Room2.vue'
import SharePost from '../components/SharePost.vue'

const modules = import.meta.glob('../components/*.vue', { eager: true, as: 'raw' }) 

provide('components-raw',modules)

</script>
