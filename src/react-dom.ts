import { REACT_TEXT } from '@/constants'

// QA? 为什么需要声明这么多次 P extends Props
// A 因为这些函数是散落在不同处直接无关联的, 所以每一个都需要重新声明

/** 将 vdom 变为真实 dom 并挂载到 container 中 */
function render(vdom: VDOM, container: DOM) {
  const dom = createDom(vdom)
  container.appendChild(dom)
}

/** 将 vdom 转换为真实 dom */
function createDom(vdom: VDOM): DOM {
  let { type, props } = vdom
  let dom: DOM
  if (type === REACT_TEXT) {
    dom  = document.createTextNode(props.content || '')
  } else if (typeof type === 'function') {
    if ('isReactComponent' in type) {
      dom = mountClassComponent(vdom as ClassVDOM)
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
  // 记录真实 dom
  // QA? 这里不是所有组件都会绑定有 dom 属性吗? findDOM 不能直接返回吗
  vdom.dom = dom
  return dom
}

export function patch(oldVdom: VDOM, newVdom: VDOM) {
  const dom = findDOM(oldVdom)
  newVdom.dom = dom
  dom.parentNode?.replaceChildren(createDom(newVdom))
}

function findDOM(vdom: VDOM) {
  const { type } = vdom
  if (typeof type === 'function') {
    if ('oldRenderVdom' in vdom && vdom.oldRenderVdom) {
      return findDOM(vdom.oldRenderVdom)
    } else {
      return document.createTextNode('报错啦')
    }
  } else {
    return vdom.dom!
  }
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
    } else if (key.startsWith('on')) {
      Reflect.set(dom, key.toLocaleLowerCase(), newProps[key])
    } else {
      Reflect.set(dom, key, newProps[key])
    }
  }
}

/** 协调 children 并挂载 */
function reconcileChildren(children: VDOM[], parent: DOM) {
  children.forEach(child => render(child, parent))
}

/** 执行 type() 得到 vdom, 将 vdom 转为真实 dom 并返回 */
function mountFunctionComponent(vdom: FunctionVDOM) {
  const { type, props } = vdom
  const renderVdom = type(props)
  vdom.oldRenderVdom = renderVdom
  return createDom(renderVdom)
}

/** 调用 type() 创建类组件实例, 执行 render 成员函数, 并将 vdom 转为真实 dom */
function mountClassComponent(vdom: ClassVDOM) {
  const { type, props } = vdom
  const instance = new type(props)
  // QA 此处执行后的 renderVdom 也可能是组件?那 oldRenderVdom 不就挂载到了组件上吗
  const renderVdom = instance.render()
  // 组件 vdom 记录 render 生成的 vdom 用于构成组件链, 可以找到渲染 vdom 上的真实 dom
  vdom.oldRenderVdom = renderVdom
  // 组件实例记录当前渲染的 vdom, 用于渲染时比较更新
  instance.oldRenderVdom = renderVdom
  return createDom(renderVdom)
}

const ReactDOM = {
  render,
}

export default ReactDOM