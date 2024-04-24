import { wrapToVdom } from "./utils"

/** 实现 React 源码中的 createElement 方法 */
export function createElement(
  type: VNodeType,
  props: null | Props,
  ...children: (string | number | VNode)[]
): VNode {
  if (props === null) props = {}
  if (children.length) {
    props.children = children.length === 1
      ? wrapToVdom(children[0])
      : children.map(wrapToVdom)
  }

  return {
    type,
    props,
  }
}

export default {
  createElement,
}