# 画图数据结构

## 通用字段

| 字段名称      | 默认值 | 字段解释           | 数据类型 | 是否必填 | 备注         |
| ------------- | ------ | ------------------ | -------- | -------- | ------------ |
| stroke        | null   | 图形轮廓颜色       | string   | 否       | 颜色值       |
| fill          | "#000" | 图形填充颜色       | string   | 否       | 颜色值       |
| fillOpacity   | 1      | 图形轮廓颜色透明度 | number   | 否       | 取值范围 0-1 |
| strokeOpacity | 1      | 图形填充颜色透明度 | number   | 否       | 取值范围 0-1 |

## 1. 直线

| 字段名称  | 默认值  | 字段解释     | 数据类型 | 是否必填 | 可选值                                        | 备注 |
| --------- | ------- | ------------ | -------- | -------- | --------------------------------------------- | ---- |
| type      | "line"  | 图的类型     | string   | 是       | "line"                                        |      |
| x1        | 0       | 起始点横坐标 | number   | 是       |                                               |      |
| y1        | 0       | 起始点纵坐标 | number   | 是       |                                               |      |
| x2        | 0       | 终止点横坐标 | number   | 是       |                                               |      |
| y2        | 0       | 终止点纵坐标 | number   | 是       |                                               |      |
| lineWidth | 1       | 线条宽度     | number   | 否       |                                               |      |
| lineDash  | "solid" | 线条类型     | string   | 否       | "solid"(实线) "dashed"(虚线) "dotted"(点虚线) |      |

### 示例

```json
{
  "type": "line",
  "x1": 0,
  "y1": 0,
  "x2": 100,
  "y2": 100,
  "stroke": "red"
}
```

## 2. 矩形

| 字段名称 | 默认值 | 字段解释     | 数据类型 | 是否必填 | 可选值 | 备注 |
| -------- | ------ | ------------ | -------- | -------- | ------ | ---- |
| type     | "rect" | 图的类型     | string   | 是       | "rect" |      |
| x        | 0      | 起始点横坐标 | number   | 是       |        |      |
| y        | 0      | 起始点纵坐标 | number   | 是       |        |      |
| width    | 0      | 矩形宽       | number   | 是       |        |      |
| height   | 0      | 矩形高       | number   | 是       |        |      |

### 示例

```json
{
  "type": "rect",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "stroke": "red"
}
```

## 3. 多边形

| 字段名称 | 默认值    | 字段解释 | 数据类型   | 是否必填 | 可选值    | 备注 |
| -------- | --------- | -------- | ---------- | -------- | --------- | ---- |
| type     | "polygon" | 图的类型 | string     | 是       | "polygon" |      |
| points   |           | 点集合   | number[][] | 是       |           |      |

### 示例

```json
{
  "type": "polygon",
  "points": [
    [0, 0],
    [100, 0],
    [100, 100]
  ],
  "stroke": "red"
}
```

## 4. 圆弧

| 字段名称   | 默认值 | 字段解释                             | 数据类型  | 是否必填 | 可选值 | 备注             |
| ---------- | ------ | ------------------------------------ | --------- | -------- | ------ | ---------------- |
| type       | "arc"  | 图的类型                             | string    | 是       | "arc"  |                  |
| cx         | 0      | 圆心横坐标                           | number    | 是       |        |                  |
| cy         | 0      | 圆心纵坐标                           | number    | 是       |        |                  |
| r          | 0      | 半径                                 | number    | 是       |        |                  |
| startAngle | 0      | 起始角度（以水平 x 轴右方向为 0 度） | number    | 否       |        | 正数，负数都可以 |
| endAngle   | 0      | 终止角度（以水平 x 轴右方向为 0 度） | number    | 否       |        | 正数，负数都可以 |
| clockwise  | true   | 顺时针                               | clockwise | 否       |        |

### 示例

```json
{
  "type": "arc",
  "cx": 0,
  "cy": 0,
  "r": 100,
  "startAngle": 0,
  "endAngle": 90
}
```

## 5. 圆

| 字段名称 | 默认值   | 字段解释   | 数据类型 | 是否必填 | 可选值   | 备注 |
| -------- | -------- | ---------- | -------- | -------- | -------- | ---- |
| type     | "circle" | 图的类型   | string   | 是       | "circle" |      |
| cx       | 0        | 圆心横坐标 | number   | 是       |          |      |
| cy       | 0        | 圆心纵坐标 | number   | 是       |          |      |
| r        | 0        | 半径       | number   | 是       |          |      |

### 示例

```json
{
  "type": "circle",
  "cx": 0,
  "cy": 0,
  "r": 100
}
```

## 6. 扇形

| 字段名称   | 默认值   | 字段解释                             | 数据类型  | 是否必填 | 可选值   | 备注             |
| ---------- | -------- | ------------------------------------ | --------- | -------- | -------- | ---------------- |
| type       | "sector" | 图的类型                             | string    | 是       | "sector" |                  |
| cx         | 0        | 圆心横坐标                           | number    | 是       |          |                  |
| cy         | 0        | 圆心纵坐标                           | number    | 是       |          |                  |
| r          | 0        | 半径                                 | number    | 是       |          |                  |
| r0         | 0        | 内半径                               | number    | 否       |          | 一般给 0         |
| startAngle | 0        | 起始角度（以水平 x 轴右方向为 0 度） | number    | 否       |          | 正数，负数都可以 |
| endAngle   | 0        | 终止角度（以水平 x 轴右方向为 0 度） | number    | 否       |          | 正数，负数都可以 |
| clockwise  | true     | 顺时针                               | clockwise | 否       |          |

### 示例

```json
{
  "type": "sector",
  "cx": 0,
  "cy": 0,
  "r": 100,
  "r0": 100,
  "startAngle": 0,
  "endAngle": 90
}
```

## 7. 文本

| 字段名称   | 默认值 | 字段解释     | 数据类型 | 是否必填 | 可选值 | 备注 |
| ---------- | ------ | ------------ | -------- | -------- | ------ | ---- |
| type       | "text" | 图的类型     | string   | 是       | "text" |      |
| x          | 0      | 起始点横坐标 | number   | 是       |        |      |
| y          | 0      | 起始点纵坐标 | number   | 是       |        |      |
| text       |        | 文本内容     | string   | 是       |        |      |
| fontSize   | 16     | 文本字号     | number   | 否       |        |      |
| fontWeight | 400    | 文本粗细     | number   | 否       |        |      |

### 示例

```json
{
  "type": "text",
  "x": 0,
  "y": 0,
  "text": "你好",
  "fontSize": 100,
  "fontWeight": 400
}
```

## 画四条线 一个矩形 一个扇形

```js
const data = [
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
```