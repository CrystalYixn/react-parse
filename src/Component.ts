import { createElement } from "./react"
import { patch } from "./react-dom"

export const updateQueue = {
  isBatchingUpdate: false,
  updaters: [] as Updater[],
  batchUpdate() {
    this.updaters.forEach(updater => {
      updater.updateComponent()
    })
    this.updaters.length = 0
  }
}

export class Component<P extends Props = {}, S = {}> {
  static isReactComponent = {}
  static defaultProps?: Props
  props: P
  state: Readonly<S> = {} as S
  updater: Updater<P>
  context: any
  refs: any
  oldRenderVdom: VDOM | null = null
  constructor(props: P) {
    this.props = props
    this.updater = new Updater(this)
  }

  componentWillMount?(): void
  componentDidMount?(): void
  /** 当 props 或 state 变化时依赖此方法可以控制是否更新
   * 像是手动控制可以减少更新频率
   */
  shouldComponentUpdate?(nextProps: Readonly<P> | undefined, nextState: Readonly<S>): boolean
  componentWillUpdate?(): void
  componentDidUpdate?(): void

  render() {
    return createElement('', null)
  }

  setState(partialState: P, cb?: () => void) {
    this.updater.addState(partialState, cb)
  }

  forceUpdate() {
    const { oldRenderVdom } = this
    // QA 这里产生的也可能是组件而不是真实 vdom, 怎么处理?
    // A path 方法接收的就是 VDOM, 内部通过 findDOM 按渲染链查找
    const renderVdom = this.render()
    // 通过shouldUpdate 调用时必定渲染过至少一次
    patch(oldRenderVdom!, renderVdom)
    this.oldRenderVdom = renderVdom
    this.componentDidUpdate?.()
  }
}

class Updater<P extends Props = StdProps> {
  instance: Component<P>
  pendingStates: P[] = []
  nextProps?: P
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

  emitUpdate(nextProps?: P) {
    this.nextProps  = nextProps
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this)
    } else {
      this.updateComponent()
    }
  }

  updateComponent() {
    const { instance, pendingStates, nextProps } = this
    if (pendingStates.length > 0) {
      shouldUpdate(instance, nextProps, this.getState())
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
function shouldUpdate(
  instance: Component,
  nextProps: Props | undefined,
  nextState: Props
) {
  let willUpdate = instance.shouldComponentUpdate?.(
    nextProps, nextState
  ) === true ? true : false
  if (willUpdate) {
    instance.componentWillUpdate?.()
  }
  nextProps && (instance.props = nextProps)
  instance.state = nextState
  if (willUpdate) {
    instance.forceUpdate()
  }
}