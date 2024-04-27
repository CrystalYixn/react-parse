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