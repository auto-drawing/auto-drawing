import { minus, divide, enableBoundaryChecking } from 'number-precision' // 浮点精度处理 (+ - x /)

// 关闭边界检查提示
enableBoundaryChecking(false)

/**
 * 坐标值的类型
 */
export type CoordinateValue = string | number

/**
 * 坐标
 */
export type Point = [CoordinateValue, CoordinateValue]

/**
 *  知道矩形的中心点和长宽  计算矩形的左上角坐标  y轴会做负值处理 以适应笛卡尔坐标系
 * @param data  矩形的中心点和长宽
 * @param rate 比率 默认为1
 * @returns `{x: number,y: number }`
 */
export const center2LeftTop = (
  data: Point,
  rect: {
    length: CoordinateValue
    width: CoordinateValue
  }
) => {
  return {
    // (data.x -data.length / 2) * rate
    x: minus(Number(data[0]) || 0, divide(Number(rect.length) || 0, 2)),
    // y轴给出负的 坐标系装换
    // (data.y -data.width / 2) * rate
    y: minus(-Number(data[1]) || 0, divide(Number(rect.width) || 0, 2))
  }
}

/**
 * 弧度转角度
 * @param {number} radian  弧度
 * @returns
 */
export const radian2Angle = (radian: number) => radian / (Math.PI / 180)

/**
 * 角度转弧度
 * @param {number} angle 角度
 * @returns
 */
export const angle2Radian = (angle: number) => angle * (Math.PI / 180)

/**
 * 计算坐标和 x轴整方向的角度  （以弧度为单位）
 *
 * 默认计算的是从原点 (0,0) 到 (x,y) 点的线段与 x 轴正方向之间的平面角度 (弧度值)
 * @param {number[]} data 坐标
 * @param {number[]} origin 起始点坐标 默认(0,0)
 * @returns
 */
export const getRadian = (data: Point, origin?: Point) => {
  const originX = origin ? origin[0] || 0 : 0
  const originY = origin ? origin[1] || 0 : 0
  const radian = Math.atan2(
    // Number(data[1]) - Number(originY),
    minus(Number(data[1]) || 0, Number(originY)),

    // Number(data[0]) - Number(originX)
    minus(Number(data[0]) || 0, Number(originX))
  )
  return radian
}

/**
 * 计算弧的起始角度和结束角度 （以弧度为单位）
 *
 * @param {number[]} start  起始点坐标
 * @param {number[]}  end  结束点坐标
 * @param {number[]} center 圆心坐标
 * @returns `{ startRadian: number,endRadian: number }`
 */
export const getArcRadian = (start: Point, end: Point, center: Point) => {
  const startRadian = getRadian(start, center)
  const endRadian = getRadian(end, center)
  return {
    startRadian,
    endRadian
  }
}

/**
 * 计算弧的起始角度和结束角度 （以角度为单位）
 * @param start
 * @param end
 * @param center
 * @returns `{ startAngle: number,endAngle: number}`
 */
export const getArcAngle = (start: Point, end: Point, center: Point) => {
  const startRadian = getRadian(start, center)
  const endRadian = getRadian(end, center)
  return {
    startAngle: radian2Angle(startRadian),
    endAngle: radian2Angle(endRadian)
  }
}

/**
 * 计算两个点之间的距离
 * @param {number[]}  p1  第一个点的坐标
 * @param {number[]} p2   第二个点的坐标
 * @returns
 */
export const getTwoPointDistance = (p1: Point, p2: Point) => {
  return Math.sqrt(
    Math.pow(
      // Number(p1[0])- Number(p2[0])
      minus(Number(p1[0]) || 0, Number(p2[0]) || 0),
      2
    ) +
      Math.pow(
        // Number(p1[1]) - Number(p2[1])
        minus(Number(p1[1]) || 0, Number(p2[1]) || 0),
        2
      )
  )
}
