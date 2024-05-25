import { Component } from "./Component"
import { wrapToVdom } from "./utils"

/** 创建 VDOM */
export function createElement<P extends Props>(
  type: VDOMType<P>,
  props: null | P,
  ...children: (string | number | VDOM<P>)[]
): VDOM<P> {
  if (props === null) props = {} as P
  const { ref } = props
  if (children.length) {
    props.children = children.length === 1
    // 源码没有对孩子进行包装, 导致后续各个方法内部单独去判断
      ? wrapToVdom(children[0])
      : children.map(wrapToVdom)
  }

  return {
    type,
    props,
    ref,
  }
}

export function createRef<T>(): { current: T | null } {
  return { current: null }
}

export function forwardRef(
  funcComponent: (p: Props, ref: ReturnType<typeof createRef<HTMLInputElement>>) => VDOM
) {
  return class extends Component {
    context = null
    refs = {}
    render() {
      return funcComponent(this.props, this.props.ref)
    }
  }
}


const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
}

export default React