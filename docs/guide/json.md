# 画图数据结构

## 通用字段

| 字段名称      | 默认值        | 字段解释             | 数据类型 | 是否必填 | 可选值                                                                                                                                                                                                           | 备注                                     |
| ------------- | ------------- | -------------------- | -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- |
| type          |               | 图形类型             | string   | 是       | 'arc' , 'circle' , 'compoundPath' , 'line' , 'polygon' , 'polyline' , 'rect' , 'text' , 'image' , 'bezierCurve' , 'sector' , 'group' , 'droplet' , 'ellipse' , 'heart' , 'isogon' , 'rose' , 'star'"bezierCurve" |                                          |
| stroke        | "none" "#fff" | 图形轮廓颜色         | string   | 否       |                                                                                                                                                                                                                  | 颜色值                                   |
| fill          | "none"        | 图形填充颜色         | string   | 否       |                                                                                                                                                                                                                  | 颜色值                                   |
| fillOpacity   | 1             | 图形填充颜色透明度   | number   | 否       |                                                                                                                                                                                                                  | 取值范围 0-1                             |
| strokeOpacity | 1             | 图形轮廓颜色透明度   | number   | 否       |                                                                                                                                                                                                                  | 取值范围 0-1                             |
| zlevel        | 0             | 图形层级             | number   | 否       |                                                                                                                                                                                                                  |                                          |
| draggable     | false         | 图形是否可以拖拽     | boolean  | 否       |                                                                                                                                                                                                                  |                                          |
| params        | {}            | 给图形添加的额外参数 | boolean  | 否       |                                                                                                                                                                                                                  | 对图点击等操作需要拿原数据的时候非常有用 |

::: tip 提示  
[兼容未列出的 zrender.Displayable 的 其他配置](https://ecomfe.github.io/zrender-doc/public/api.html#zrenderdisplayable)
（使用时 opts 和 opts.style 平级配置）<i  class='tag'>v0.1.1</i>

如下示例
:::

示例

```json
{
  "type": "text",
  "x": 0,
  "y": 0,
  "text": "你好",
  "fontSize": 100,
  "fontWeight": 400,
  "culling": false,
  "cursor": false,
  "draggable": false,
  "progressive": -1,
  "rectHover": false,
  "silent": false,
  "fill": "#ccc",
  "stroke": "#ccc",
  "opacity": 1,
  "lineDash": null,
  "lineDashOffset": null,
  "shadowBlur": 0,
  "shadowColor": "transparent",
  ...
}
```

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

## 3. 闭合多边形

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

## 4. 不闭合多边形

| 字段名称 | 默认值     | 字段解释 | 数据类型   | 是否必填 | 可选值     | 备注 |
| -------- | ---------- | -------- | ---------- | -------- | ---------- | ---- |
| type     | "polyline" | 图的类型 | string     | 是       | "polyline" |      |
| points   |            | 点集合   | number[][] | 是       |            |      |

### 示例

```json
{
  "type": "polyline",
  "points": [
    [0, 0],
    [100, 0],
    [100, 100]
  ],
  "stroke": "red"
}
```

## 5. 圆弧

| 字段名称   | 默认值 | 字段解释                             | 数据类型 | 是否必填 | 可选值 | 备注             |
| ---------- | ------ | ------------------------------------ | -------- | -------- | ------ | ---------------- |
| type       | "arc"  | 图的类型                             | string   | 是       | "arc"  |                  |
| cx         | 0      | 圆心横坐标                           | number   | 是       |        |                  |
| cy         | 0      | 圆心纵坐标                           | number   | 是       |        |                  |
| r          | 0      | 半径                                 | number   | 是       |        |                  |
| startAngle | 0      | 起始角度（以水平 x 轴右方向为 0 度） | number   | 否       |        | 正数，负数都可以 |
| endAngle   | 0      | 终止角度（以水平 x 轴右方向为 0 度） | number   | 否       |        | 正数，负数都可以 |
| clockwise  | true   | 顺时针                               | boolean  | 否       |        |

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

## 6. 圆

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

## 7. 扇形

| 字段名称   | 默认值   | 字段解释                             | 数据类型 | 是否必填 | 可选值   | 备注             |
| ---------- | -------- | ------------------------------------ | -------- | -------- | -------- | ---------------- |
| type       | "sector" | 图的类型                             | string   | 是       | "sector" |                  |
| cx         | 0        | 圆心横坐标                           | number   | 是       |          |                  |
| cy         | 0        | 圆心纵坐标                           | number   | 是       |          |                  |
| r          | 0        | 半径                                 | number   | 是       |          |                  |
| r0         | 0        | 内半径                               | number   | 否       |          | 一般给 0         |
| startAngle | 0        | 起始角度（以水平 x 轴右方向为 0 度） | number   | 否       |          | 正数，负数都可以 |
| endAngle   | 0        | 终止角度（以水平 x 轴右方向为 0 度） | number   | 否       |          | 正数，负数都可以 |
| clockwise  | true     | 顺时针                               | boolean  | 否       |          |

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

## 8. 文本

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

## 9. 图片

| 字段名称 | 默认值  | 字段解释     | 数据类型                                  | 是否必填 | 可选值  | 备注 |
| -------- | ------- | ------------ | ----------------------------------------- | -------- | ------- | ---- |
| type     | "image" | 图的类型     | string                                    | 是       | "image" |      |
| x        | 0       | 起始点横坐标 | number                                    | 是       |         |      |
| y        | 0       | 起始点纵坐标 | number                                    | 是       |         |      |
| width    | 0       | 图片宽       | number                                    | 是       |         |      |
| height   | 0       | 图片高       | number                                    | 是       |         |      |
| image    | 0       | 图片         | string HTMLImageElement HTMLCanvasElement | 是       |

### 示例

```json
{
  "type": "image",
  "x": 0,
  "y": 0,
  "width": 100,
  "height": 100,
  "image": "./img.jpg"
}
```

## 10. 贝塞尔曲线

| 字段名称 | 默认值        | 字段解释      | 数据类型 | 是否必填 | 可选值        | 备注 |
| -------- | ------------- | ------------- | -------- | -------- | ------------- | ---- |
| type     | "bezierCurve" | 图的类型      | string   | 是       | "bezierCurve" |      |
| x1       | 0             | 起始点横坐标  | number   | 是       |               |      |
| y1       | 0             | 起始点纵坐标  | number   | 是       |               |      |
| x2       | 0             | 终点横坐标    | number   | 是       |               |      |
| y2       | 0             | 终点纵坐标    | number   | 是       |               |      |
| cpx1     | 0             | 断点 1 横坐标 | number   | 是       |               |      |
| cpy1     | 0             | 断点 1 纵坐标 | number   | 是       |               |      |
| cpx2     | 0             | 断点 2 横坐标 | number   | 否       |               |      |
| cpy2     | 0             | 断点 2 纵坐标 | number   | 否       |               |      |

### 示例

```json
{
  "type": "bezierCurve",
  "x1": 0,
  "y1": 0,
  "cpx1": 50,
  "cpy1": 50,
  "cpx2": 150,
  "cpy2": 150,
  "x2": 200,
  "y2": 200
}
```

## 11. 水滴

<i  class='tag'>v1.0.0</i>

| 字段名称 | 默认值    | 字段解释   | 数据类型 | 是否必填 | 可选值    | 备注 |
| -------- | --------- | ---------- | -------- | -------- | --------- | ---- |
| type     | "droplet" | 图的类型   | string   | 是       | "droplet" |      |
| cx       | 0         | 圆心横坐标 | number   | 是       |           |      |
| cy       | 0         | 圆心纵坐标 | number   | 是       |           |      |
| width    | 0         | 水滴宽     | number   | 是       |           |      |
| height   | 0         | 水滴高     | number   | 是       |           |      |

### 示例

```json
{
  "type": "droplet",
  "cx": 600,
  "cy": 600,
  "width": 168,
  "height": 168,
  "stroke": "red",
  "fill": "red"
}
```

## 12. 椭圆

<i  class='tag'>v1.0.0</i>

| 字段名称 | 默认值    | 字段解释     | 数据类型 | 是否必填 | 可选值    | 备注 |
| -------- | --------- | ------------ | -------- | -------- | --------- | ---- |
| type     | "ellipse" | 图的类型     | string   | 是       | "ellipse" |      |
| cx       | 0         | 圆心横坐标   | number   | 是       |           |      |
| cy       | 0         | 圆心纵坐标   | number   | 是       |           |      |
| rx       | 0         | 椭圆横向半径 | number   | 是       |           |      |
| rx       | 0         | 椭圆纵向半径 | number   | 是       |           |      |

### 示例

```json
{
  "type": "ellipse",
  "cx": 600,
  "cy": 600,
  "rx": 168,
  "ry": 200,
  "stroke": "red",
  "fill": "red"
}
```

## 13. 心形

<i  class='tag'>v1.0.0</i>

| 字段名称 | 默认值  | 字段解释   | 数据类型 | 是否必填 | 可选值  | 备注 |
| -------- | ------- | ---------- | -------- | -------- | ------- | ---- |
| type     | "heart" | 图的类型   | string   | 是       | "heart" |      |
| cx       | 0       | 圆心横坐标 | number   | 是       |         |      |
| cy       | 0       | 圆心纵坐标 | number   | 是       |         |      |
| width    | 0       | 心形宽     | number   | 是       |         |      |
| height   | 0       | 心形高     | number   | 是       |         |      |

### 示例

```json
{
  "type": "heart",
  "cx": 100,
  "cy": 100,
  "width": 50,
  "height": 50,
  "stroke": "yellow",
  "fill": "yellow"
}
```

## 14. 正多边形

<i  class='tag'>v1.0.0</i>

| 字段名称 | 默认值   | 字段解释   | 数据类型 | 是否必填 | 可选值   | 备注 |
| -------- | -------- | ---------- | -------- | -------- | -------- | ---- |
| type     | "isogon" | 图的类型   | string   | 是       | "isogon" |      |
| x        | 0        | 圆心横坐标 | number   | 是       |          |      |
| y        | 0        | 圆心纵坐标 | number   | 是       |          |      |
| r        | 0        | 半径       | number   | 是       |          |      |
| n        | 0        | 边数       | number   | 是       |          |      |

### 示例

```json
{
  "type": "isogon",
  "x": 400,
  "y": 400,
  "r": 50,
  "n": 5
}
```

## 15. 玫瑰线

<i  class='tag'>v1.0.0</i>

| 字段名称 | 默认值 | 字段解释   | 数据类型 | 是否必填 | 可选值 | 备注 |
| -------- | ------ | ---------- | -------- | -------- | ------ | ---- |
| type     | "rose" | 图的类型   | string   | 是       | "rose" |      |
| cx       | 0      | 圆心横坐标 | number   | 是       |        |      |
| cy       | 0      | 圆心纵坐标 | number   | 是       |        |      |
| r        | []     | 半径       | number[] | 是       |        |      |
| n        | 0      | 花瓣数     | number   | 是       |        |      |
| k        | 1      | 玫瑰线参数 | number   | 是       |        |      |

### 示例

```json
{
  "type": "rose",
  "cx": 600,
  "cy": 400,
  "n": 2,
  "r": [100, 120, 140, 160, 200, 220, 240, 260, 280],
  "k": 5,
  "stroke": "green"
}
```

## 16. 星形

<i  class='tag'>v1.0.0</i>

| 字段名称 | 默认值 | 字段解释   | 数据类型 | 是否必填 | 可选值 | 备注 |
| -------- | ------ | ---------- | -------- | -------- | ------ | ---- |
| type     | "star" | 图的类型   | string   | 是       | "star" |      |
| cx       | 0      | 圆心横坐标 | number   | 是       |        |      |
| cy       | 0      | 圆心纵坐标 | number   | 是       |        |      |
| r        | 0      | 半径       | number   | 是       |        |      |
| n        | 0      | 瓣数       | number   | 是       |        |      |
| r0       | 0      | 内半径     | number   | 是       |        |      |

### 示例

```json
{
  "type": "star",
  "cx": 100,
  "cy": 100,
  "n": 5,
  "r": 100,
  "r0": 50,
  "stroke": "red",
  "fill": "red"
}
```
