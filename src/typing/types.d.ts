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
  // 拥有默认值后时, 仅使用默认值中的属性或不使用相关属性时不再需要继续传递
  // 不给默认值会强制要求传入泛型, 如果大部分都是默认类型的泛型则推荐默认值? 默认值一定是最小范围的
  // 
  type VDOM<P extends Props = StdProps> =
    FunctionVDOM<P> | ClassVDOM<P> | NormalVDOM

  type StdVDOM<P extends Props = StdProps> = {
    props: P
    dom?: DOM
  }

  type FunctionVDOM<P extends Props = StdProps> = {
    type: FunctionVDOMType<P>
    oldRenderVdom?: VDOM<P>
  } & StdVDOM<P>

  type ClassVDOM<P extends Props = StdProps> = {
    type: typeof Component<P>
    oldRenderVdom?: VDOM<P>
  } & StdVDOM<P>

  type NormalVDOM = {
    type: REACT_TEXT | string
  } & StdVDOM

  type Props = StdProps & { [k: string]: any }
  type StdProps = {
    children?: VDOM | VDOM[]
    style?: { [k: string]: string }
    content?: string
  }

  type DOM = HTMLElement | Text
}
