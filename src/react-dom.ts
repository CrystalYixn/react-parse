// import { REACT_TEXT } from "./constants"
import { REACT_TEXT } from '@/constants'

function render(vdom: VNode, container: DOM) {
  const dom = createDom(vdom)
  container.appendChild(dom)
}

function createDom(vdom: VNode) {
  let { type, props } = vdom
  const dom = type === REACT_TEXT
    ? document.createTextNode(props.content)
    : document.createElement(type)
  // 处理 props
  if (props) {
    const { children } = props
    updateProps(dom, {}, props)
    // 处理 children
    if (typeof children === 'object' && 'type' in children) {
      render(children, dom)
    } else if (Array.isArray(children)) {
      reconcileChildren(children, dom)
    }
  }
  return dom
}

function updateProps(dom: DOM, oldProps: Props, newProps: Props) {
  for (const key in newProps) {
    const prop = newProps[key]
    if (key === 'children') continue
    // 处理样式
    if (key === 'style' && 'style' in dom) {
      for (const styleName in prop) {
        // 只能使用 dom.style[number] 索引, 而不能使用 string
        // https://stackoverflow.com/questions/37655393/how-to-set-multiple-css-style-properties-in-typescript-for-an-element
        dom.style[styleName as any] = prop[styleName]
      }
    }
  }
}

function reconcileChildren(children: VNode[], parent: DOM) {
  children.forEach(child => render(child, parent))
}

export default {
  render,
}