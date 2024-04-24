import type { REACT_TEXT } from '@/constants'

global {
  type VNodeType = typeof REACT_TEXT | string
  
  type VNode = {
    type: VNodeType;
    props: Props;
  }
  
  type Props = {[k: string]: any} & {
    children?: VNode | VNode[],
    style?: { [k: string]: string }
  }
  
  type DOM = HTMLElement | Text
}
