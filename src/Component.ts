import { createElement } from "./react"
import { patch } from "./react-dom"

export class Component<P extends Props = Props> {
  static isReactComponent = {}
  props: P
  state: P = {} as P
  updater: Updater<P>
  oldRenderVdom: VDOM | null = null
  constructor(props: P) {
    this.props = props
    this.updater = new Updater(this)
  }

  render() {
    return createElement('', null)
  }

  setState(partialState: P, cb?: () => void) {
    this.updater.addState(partialState, cb)
  }

  forceUpdate() {
    const { oldRenderVdom } = this
    // QA 这里产生的也可能是组件而不是真实 vdom, 怎么处理?
    const renderVdom = this.render()
    // 通过shouldUpdate 调用时必定渲染过至少一次
    patch(oldRenderVdom!, renderVdom)
    this.oldRenderVdom = renderVdom
  }
}

class Updater<P extends Props> {
  instance: Component<P>
  pendingStates: P[] = []
  callbacks: (() => void)[] = []
  constructor(instance: Component<P>) {
    this.instance = instance
  }

  addState(partialState: P, callback?: () => void) {
    this.pendingStates.push(partialState)
    if (callback) {
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }

  emitUpdate() {
    this.updateComponent()
  }

  updateComponent() {
    const { instance, pendingStates } = this
    if (pendingStates.length > 0) {
      shouldUpdate(instance, this.getState())
    }
  }

  /** 根据 pendingStates 计算最终 state 并执行回调队列和清空两个队列 */
  getState() {
    let { instance: { state }, pendingStates } = this
    pendingStates.forEach(nextState => {
      state = nextState
    })
    pendingStates.length = 0
    this.callbacks.forEach(cb => cb())
    this.callbacks.length = 0
    return state
  }
}

/** 修改 state 的值, 组件强制更新 */
function shouldUpdate(instance: Component, nextState: Props) {
  instance.state = nextState
  instance.forceUpdate()
}