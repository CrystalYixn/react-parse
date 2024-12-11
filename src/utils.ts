import { REACT_TEXT } from './constants'
import { createElement } from './react'

/** ensureVdom 确保字符串/数字返回一个 vdom */
export function wrapToVdom(element: string | number | VDOM) {
  if (typeof element === 'string' || typeof element === 'number') {
    return createElement(REACT_TEXT, { content: element.toString() })
  } else {
    return element
  }
}

export function assert(
  condition: boolean,
  msg = 'assert error'
): asserts condition {
  if (!condition) {
    throw new Error(msg)
  }
}

export function shallowEqual(objA: unknown, objB: unknown) {
  if (objA === objB) return true
  if (
    typeof objA !== 'object' ||
    objA === null ||
    typeof objB !== 'object' ||
    objB === null
  )
    return false
  const keysA = Object.keys(objA) as (keyof typeof objA)[]
  const keysB = Object.keys(objB) as (keyof typeof objB)[]
  if (keysA.length !== keysB.length) return false
  for (const key of keysA) {
    if (objA[key] !== objB[key]) return false
  }
  return true
}
