import { Component } from "./Component"
import { REACT_CONTEXT, REACT_FORWARD_REF_TYPE, REACT_MEMO, REACT_PROVIDER } from "./constants"
import { shallowEqual, wrapToVdom } from "./utils"
import ReactDOM from "./react-dom"

/** 创建 VDOM */
export function createElement<P extends Props>(
  type: VDOMType<P>,
  props: null | P,
  ...children: (string | number | VDOM)[]
): VDOM {
  if (props === null) props = {} as P
  const { ref } = props
  if (children.length) {
    props.children = children.length === 1
    // 源码没有对孩子进行包装, 导致后续各个方法内部单独去判断
      ? wrapToVdom(children[0])
      : children.map(wrapToVdom)
  }
  // 删除 react 编译生成的部分属性，自己实现中用不到且影响对比
  delete props.__source
  delete props.__self
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

// 首先定义接口
interface Context<T> {
  $$typeof: symbol;
  Provider: Provider<T>;
  Consumer: Consumer<T>;
  _value: T;
}

interface Provider<T> {
  $$typeof: symbol;
  _context: Context<T>;
}

interface Consumer<T> {
  $$typeof: symbol;
  _context: Context<T>;
}

// 创建 context 的函数
export function createContext<T>(defaultValue: T): Context<T> {
  let context: Context<T> = {
    $$typeof: REACT_CONTEXT,
    Provider: {
      $$typeof: REACT_PROVIDER,
      _context: null!,
    },
    Consumer: {
      $$typeof: REACT_CONTEXT,
      _context: null!,
    },
    _value: defaultValue,
  };

  // 处理循环引用
  context.Provider._context = context;
  context.Consumer._context = context;

  return context;
}

function cloneElement(oldElement: VDOM, newProps: Props, children: (string | number | VDOM)) {
  children = wrapToVdom(children)
  const props = { ...oldElement.props, ...newProps, children }
  return {...oldElement, props}
}

function memo<T extends Props>(type: FunctionVDOMType<T>, compare = shallowEqual) {
  return {
    $$typeof: REACT_MEMO,
    type,
    compare,
  }
}

const React = {
  createElement,
  Component,
  createRef,
  forwardRef,
  createContext,
  cloneElement,
  memo,
  useState: ReactDOM.useState,
}

export default React