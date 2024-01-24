/**
 * ref 绑定的元素类型
 */
declare type ElementRefType = HTMLElement | null

/**
 * setTimeout 类型
 */
declare type Timeout = ReturnType<typeof setTimeout>

/**
 * setInterval 类型
 */
declare type Interval = ReturnType<typeof setInterval>

/**
 * 普通的对象的泛型
 */
declare type RecordType<T = any> = Record<string, T>

/**
 * 允许null的泛型
 */
declare type Nullable<T> = T | null

declare interface Window {
  hljs: any
}
