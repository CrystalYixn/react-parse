/* eslint-disable @typescript-eslint/no-unused-vars */
import type { REACT_TEXT } from '@/constants'

global {
  type VDOMType<P> = typeof REACT_TEXT | string | FunctionVDOMType<P>
  type FunctionVDOMType<P extends StandardProps> = (props: P) => VDOM

  type VDOM = {
    type: VDOMType;
    props: StandardProps;
  }

  type FunctionVDOM = {
    type: FunctionVDOMType;
  } & VDOM;

  type Props = StandardProps & {[k: string]: any}
  type StandardProps = {
    children?: VDOM | VDOM[],
    style?: { [k: string]: string },
    content?: string,
  }
  
  type DOM = HTMLElement | Text
}
