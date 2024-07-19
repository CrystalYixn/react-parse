import { Component } from "./Component"
import { REACT_FORWARD_REF_TYPE } from "./constants"
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

export function createRef<T>(): Ref<T> {
  return { current: null }
}

export function forwardRef<T>(
  funcComponent: (p: Props, ref: Ref<T>) => VDOM
) {
  return {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: funcComponent
  }
}


const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
}

export default React