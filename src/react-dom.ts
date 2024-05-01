import { REACT_TEXT } from '@/constants'

/** 将 vdom 变为真实 dom 并挂载到 container 中 */
function render<P extends Props>(vdom: VDOM<P>, container: DOM) {
  const dom = createDom(vdom)
  container.appendChild(dom)
}

/** 将 vdom 转换为真实 dom */
function createDom<P extends Props>(vdom: VDOM<P>): DOM {
  let { type, props } = vdom
  let dom: DOM
  if (type === REACT_TEXT) {
    dom  = document.createTextNode(props.content || '')
  } else if (typeof type === 'function') {
    if ('isReactComponent' in type) {
      dom = mountClassComponent(vdom)
    } else {
      dom = mountFunctionComponent(vdom as FunctionVDOM)
    }
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
function reconcileChildren<P extends Props>(children: VDOM<P>[], parent: DOM) {
  children.forEach(child => render(child, parent))
}

/** 执行 type() 得到 vdom, 将 vdom 转为真实 dom 并返回 */
function mountFunctionComponent(vdom: FunctionVDOM) {
  const { type, props } = vdom
  const renderVdom = type(props)
  return createDom(renderVdom)
}

/** 调用 type() 创建类组件实例, 执行 render 成员函数, 并将 vdom 转为真实 dom */
function mountClassComponent(vdom: ClassVDOM) {
  const { type, props } = vdom
  const instance = new type(props)
  const renderVdom = instance.render()
  return createDom(renderVdom)
}

const ReactDOM = {
  render,
}

export default ReactDOM