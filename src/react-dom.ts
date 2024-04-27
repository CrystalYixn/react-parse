import { REACT_TEXT } from '@/constants'

/** 变为真实 dom 并挂载到 container 中 */
function render(vdom: VDOM, container: DOM) {
  const dom = createDom(vdom)
  container.appendChild(dom)
}

/** 将 vdom 转换为真实 dom */
function createDom(vdom: VDOM): DOM {
  let { type, props } = vdom
  let dom: DOM
  if (type === REACT_TEXT && props.content) {
    dom  = document.createTextNode(props.content)
  } else if (typeof type === 'function') {
    dom = mountFunctionComponent(vdom as FunctionVDOM)
  } else {
    dom = document.createElement(type)
  }
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

/** 更新组件属性, 不包括 children */
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

/** 协调 children 并挂载 */
function reconcileChildren(children: VDOM[], parent: DOM) {
  children.forEach(child => render(child, parent))
}

/** 组件还要多执行一次获得一个新的 vdom */
function mountFunctionComponent(vdom: FunctionVDOM) {
  const { type, props } = vdom
  const renderVdom = type(props)
  return createDom(renderVdom)
}

const ReactDOM = {
  render,
}

export default ReactDOM