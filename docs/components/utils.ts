export type Params = {
  /**
   * 开始坐标
   */
  start?: number[]
  /**
   * 结束坐标
   */
  end?: number[]
  /**
   * 点坐标
   */
  point?: number[]
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

  /**
   * 当前图形标记
   */
  tag?: string
}

/**
 * 生成圆
 * @param cx
 * @param cy
 * @param params
 * @returns
 */
export const getCircle = (
  cx: number,
  cy: number,
  params: Params = { title: '', pointType: '' }
) => ({
  type: 'circle',
  cx: cx,
  cy: cy,
  r: 8,
  fill: '#fa8423',
  stroke: '#fa8423',
  zlevel: 1,
  params: { ...params }
})

/**
 * 生成直线
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns
 */
export const getLine = (x1: number, y1: number, x2: number, y2: number) => ({
  type: 'line',
  x1,
  y1,
  x2,
  y2,
  stroke: '#000',
  fill: '#000'
})

/**
 * 生成文字
 * @param x
 * @param y
 * @param text
 * @returns
 */
export const getText = (x: number, y: number, text: string) => ({
  type: 'text',
  x,
  y,
  text: text,
  fontSize: 14,
  fontWeight: 400,
  stroke: '#000',
  fill: '#000',
  zlevel: 10
})
