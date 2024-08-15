import { REACT_TEXT } from '@/constants'
import { addEvent } from './event'

// QA? 为什么需要声明这么多次 P extends Props
// A 因为这些函数是散落在不同处直接无关联的, 所以每一个都需要重新声明

/** 将 vdom 变为真实 dom 并挂载到 container 中 */
function render(vdom: VDOM, container: DOM) {
  const dom = createDom(vdom)
  container.appendChild(dom)
  dom.componentDidMount?.()
}

function isNormalVDOM(vdom: VDOM): vdom is NormalVDOM {
  const { type } = vdom
  const typeName = typeof type
  return typeName === 'string' || typeName === 'symbol'
}

function isClassVDOM(vdom: VDOM): vdom is ClassVDOM {
  const { type } = vdom
  return 'isReactComponent' in type
}

function isFunctionVDom(vdom: VDOM): vdom is FunctionVDOM {
  const { type } = vdom
  return typeof type === 'function' && !('isReactComponent' in type)
}

function isForwardVDOM(vdom: VDOM): vdom is ForwardVDOM {
  const { type } = vdom
  return '$$typeof' in type
}

/** 将 vdom 转换为真实 dom */
function createDom(vdom: VDOM): DOM {
  let { type, props, ref } = vdom
  let dom: DOM
  if (isNormalVDOM(vdom)) {
    if (type === REACT_TEXT) {
      dom  = document.createTextNode(props.content || '')
    } else {
      dom = document.createElement(type)
    }
  } else if (isForwardVDOM(vdom)) {
    return mountForwardComponent(vdom)
  } else {
    if (isClassVDOM(vdom)) {
      return mountClassComponent(vdom)
    } else {
      return mountFunctionComponent(vdom)
    }
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
  // A 类组件和函数组件 return 了, 所以没有 dom 属性
  vdom.dom = dom
  ref && (ref.current = dom)
  return dom
}

/** 根据新旧孩子类型判断如何更新 */
export function compareTwoVdom(
  parentDom: ParentNode,
  oldVdom: VDOM | null,
  newVdom: VDOM | null,
  nextDOM?: DOM | null,
) {
  // 新老都有
  if (oldVdom && newVdom) {
    const currentDom = findDOM(oldVdom)
    // 新老类型不一样
    if (oldVdom.type !== newVdom.type) {
      if (isClassVDOM(oldVdom)) oldVdom.instance.componentWillUnmount?.()
      const newDom = createDom(newVdom)
      currentDom.parentNode?.replaceChild(newDom, currentDom)
      newDom.componentDidMount?.()
    } else {
      updateElement(oldVdom, newVdom)
    }
    // 只有老的
  } else if (oldVdom) {
    const currentDom = findDOM(oldVdom)
    if (isClassVDOM(oldVdom)) oldVdom.instance.componentWillUnmount?.()
    parentDom?.removeChild(currentDom)
    // 只有新的
  } else if (newVdom) {
    const newDom = createDom(newVdom)
    if (nextDOM) {
      parentDom.insertBefore(newDom, nextDOM)
    } else {
      parentDom?.append(newDom)
    }
    newDom.componentDidMount?.()
  }
}

export function findDOM(vdom: VDOM) {
  if (isNormalVDOM(vdom)) {
    // 首次渲染后一定存在, 第一次执行 findDOM 在渲染后
    return vdom.dom!
  } else {
    if ('renderVdom' in vdom && vdom.renderVdom) {
      return findDOM(vdom.renderVdom)
    } else {
      // QA 什么情况下会走到 else？
      const div = document.createElement('div')
      div.innerHTML = '报错啦'
      return div
    }
  }
}

/** 新旧孩子类型相同时的 diff 更新 */
function updateElement(oldVdom: VDOM, newVdom: VDOM) {
  if (oldVdom.type === REACT_TEXT && newVdom.type === REACT_TEXT && isNormalVDOM(newVdom)) {
    let currentDOM = newVdom.dom = findDOM(oldVdom)
    if (newVdom.props.content && oldVdom.props.content !== newVdom.props.content) {
      currentDOM.textContent = newVdom.props.content
    }
  } else if (typeof oldVdom.type === 'string' && isNormalVDOM(newVdom)) {
    const currentDom = newVdom.dom = findDOM(oldVdom)
    updateProps(currentDom, oldVdom.props, newVdom.props)
    updateChildren(currentDom as HTMLElement, oldVdom.props.children, newVdom.props.children)
  } else if (isClassVDOM(oldVdom) && isClassVDOM(newVdom)) {
    updateClassComponent(oldVdom, newVdom)
  } else if (isFunctionVDom(oldVdom) && isFunctionVDom(newVdom)) {
    updateFunctionComponent(oldVdom, newVdom)
  }
}

function updateChildren(
  parentDOM: ParentNode,
  oldVChildren: VDOM[] | VDOM | null = [],
  newVChildren: VDOM[] | VDOM | null = [],
) {
  const oc = Array.isArray(oldVChildren) ? oldVChildren : [oldVChildren]
  const nc = Array.isArray(newVChildren) ? newVChildren : [newVChildren]
  const maxChildren = oc.length > nc.length ? oc : nc
  maxChildren.forEach((c, i) => {
    const nextVdom = oc.find(
      // 一定是当前元素之后的元素 && 
      (ovChild, idx) => idx > i && ovChild && findDOM(ovChild)
    )
    compareTwoVdom(parentDOM, oc[i], nc[i], nextVdom && findDOM(nextVdom))
  })
}

/** 更新类组件 */
function updateClassComponent(oldVdom: ClassVDOM, newVdom: ClassVDOM) {
  // 同步新旧 vdom 上的挂载属性
  const instance = newVdom.instance = oldVdom.instance
  newVdom.renderVdom = oldVdom.renderVdom
  instance.componentWillReceiveProps?.()
  instance.updater.emitUpdate(newVdom.props)
}

/** 更新函数式组件 */
function updateFunctionComponent(oldVdom: FunctionVDOM, newVdom: FunctionVDOM) {
  const parentDOM = findDOM(oldVdom).parentNode!
  const { type, props } = newVdom
  const renderVdom = type(props)
  newVdom.renderVdom = renderVdom
  compareTwoVdom(parentDOM, oldVdom.renderVdom!, newVdom.renderVdom)
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
      // QA 事件都走的批量更新，什么情况下会触发单个更新？
      addEvent(dom, (key.toLocaleLowerCase()) as EventType, newProps[key])
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
  // 函数式组件挂载传递 ref 时与 mountForwardComponent 完全一致
  // 甚至不用套一层 forwardRef 方法
  // const renderVdom = type(props, ref)
  const renderVdom = type(props)
  vdom.renderVdom = renderVdom
  return createDom(renderVdom)
}

/** 从 type 中解构出 render 方法，并将 ref 对象传递给 render 方法保存 dom */
function mountForwardComponent(vdom: ForwardVDOM) {
  const { type: { render }, props, ref } = vdom
  const renderVdom = render(props, ref)
  vdom.renderVdom = renderVdom
  return createDom(renderVdom)
}

/** 调用 type() 创建类组件实例, 执行 render 成员函数, 并将 vdom 转为真实 dom */
function mountClassComponent(vdom: ClassVDOM) {
  const { type, props, ref } = vdom
  let defaultProps = type.defaultProps || {}
  const instance = new type({ ...defaultProps, ...props })
  const {
    componentWillMount,
    componentDidMount,
  } = instance
  componentWillMount?.()
  // QA 此处执行后的 renderVdom 也可能是组件?那 renderVdom 不就挂载到了组件上吗
  // A 就是需要挂载形成组件链
  const renderVdom = instance.render()
  vdom.instance = instance
  // 组件 vdom 记录 render 生成的 vdom 用于构成组件链, 可以找到渲染 vdom 上的真实 dom
  vdom.renderVdom = renderVdom
  ref && (ref.current = instance)
  // 组件实例记录当前渲染的 vdom, 用于渲染时比较更新
  instance.oldRenderVdom = renderVdom
  const dom = createDom(renderVdom)
  componentDidMount && (dom.componentDidMount = componentDidMount)
  return dom
}

const ReactDOM = {
  render,
}

export default ReactDOM