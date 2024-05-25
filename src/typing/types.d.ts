/* eslint-disable @typescript-eslint/no-unused-vars */
import type { REACT_TEXT } from '@/constants'
import type { Component } from '@/Component'

declare global {
  type VDOMType<P extends Props> =
    | typeof REACT_TEXT
    | string
    | FunctionVDOMType<P>
    | typeof Component<P>
  type FunctionVDOMType<P extends Props = StdProps> = (props: P) => VDOM<P>

  // 给了默认值有什么影响?
  // 拥有默认值后时，可以进行逆推导类型，不需要再传入，默认值推荐给最小范围对象
  // 不给默认值有什么影响？
  // 强制要求传入泛型
  type VDOM<P extends Props = StdProps> =
    FunctionVDOM<P> | ClassVDOM<P> | NormalVDOM

  type StdVDOM<P extends Props = StdProps> = {
    props: P,
    ref?: { current: Component | Node }
  }

  type FunctionVDOM<P extends Props = StdProps> = {
    type: FunctionVDOMType<P>
    renderVdom?: VDOM<P>
  } & StdVDOM<P>

  type ClassVDOM<P extends Props = StdProps> = {
    type: typeof Component<P>
    renderVdom?: VDOM<P>
  } & StdVDOM<P>

  type NormalVDOM = {
    type: REACT_TEXT | string
    dom?: DOM
  } & StdVDOM

  type Props = StdProps & { [k: string]: any }
  type StdProps = {
    children?: VDOM | VDOM[]
    style?: { [k: string]: string }
    content?: string
  }

  type DOM = (HTMLElement | Text) & {
    store?: { [eventName: string]: (...args: unknown[]) => unknown }
  }

  type EventType = Exclude<
    keyof GlobalEventHandlers,
    'onerror' | 'removeEventListener' | 'addEventListener'
  >
}
