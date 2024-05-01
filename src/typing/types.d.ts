/* eslint-disable @typescript-eslint/no-unused-vars */
import type { REACT_TEXT } from '@/constants'
import type { Component } from '@/Component'

global {
  type VDOMType<P extends Props> =
    typeof REACT_TEXT | string | FunctionVDOMType<P> | typeof Component<P>
  type FunctionVDOMType<P extends StandardProps> = (props: P) => VDOM

  type VDOM<P extends Props> = {
    type: VDOMType<P>;
    props: P;
  }

  type FunctionVDOM = {
    type: FunctionVDOMType;
  } & VDOM;

  type ClassVDOM = {
    type: typeof Component;
  } & VDOM;

  type Props = StandardProps & {[k: string]: any}
  type StandardProps = {
    children?: VDOM | VDOM[],
    style?: { [k: string]: string },
    content?: string,
  }
  
  type DOM = HTMLElement | Text
}
