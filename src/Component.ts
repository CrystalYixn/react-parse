import { createElement } from './react'
import type { createContext } from './react'
import { findDOM, compareTwoVdom } from './react-dom'
import { shallowEqual } from './utils'

export const updateQueue = {
  // 事件处理阶段，劫持了全局所有事件，在调用处理函数前标记为批量更新模式
  isBatchingUpdate: false,
  // 处理函数完成后执行并清空批量队列
  updaters: [] as Updater<any, any>[],
  batchUpdate() {
    this.updaters.forEach(updater => {
      updater.updateComponent()
    })
    this.updaters.length = 0
  },
}

export class Component<P extends Props = {}, S = {}, G = any> {
  static isReactComponent = {}
  static defaultProps?: Props
  static contextType?: ReturnType<typeof createContext<any>>
  props: P
  state: Readonly<S> = {} as S
  updater: Updater<P, S>
  context: unknown
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
  shouldComponentUpdate?(
    nextProps: Readonly<P> | undefined,
    nextState: Readonly<S>
  ): boolean
  componentWillUpdate?(): void
  componentDidUpdate?(prevProps: Readonly<P>, prevState: Readonly<S>, snapshot: G): void
  componentWillReceiveProps?(): void
  componentWillUnmount?(): void
  getSnapshotBeforeUpdate?(): G

  render() {
    return createElement('', null)
  }

  setState(partialState: S, cb?: () => void) {
    this.updater.addState(partialState, cb)
  }

  forceUpdate() {
    const { oldRenderVdom } = this
    this.context = (this.constructor as typeof Component).contextType?._value
    // QA 这里产生的也可能是组件而不是真实 vdom, 怎么处理?
    // A path 方法接收的就是 VDOM, 内部通过 findDOM 按渲染链查找
    const renderVdom = this.render()
    let snapshot = (this.getSnapshotBeforeUpdate?.()) as G
    // 通过shouldUpdate 调用时必定渲染过至少一次
    compareTwoVdom(
      findDOM(oldRenderVdom!).parentNode!,
      oldRenderVdom!,
      renderVdom
    )
    this.oldRenderVdom = renderVdom
    this.componentDidUpdate?.(this.props, this.state, snapshot)
  }
}

class Updater<P extends Props = StdProps, S = {}> {
  instance: Component<P, S>
  pendingStates: S[] = []
  nextProps?: P
  callbacks: (() => void)[] = []
  constructor(instance: Component<P, S>) {
    this.instance = instance
  }

  addState(partialState: S, callback?: () => void) {
    this.pendingStates.push(partialState)
    if (callback) {
      this.callbacks.push(callback)
    }
    this.emitUpdate()
  }

  emitUpdate(nextProps?: P) {
    // 有 nextProps 时一定是子组件收到更新主动触发
    this.nextProps = nextProps
    if (updateQueue.isBatchingUpdate) {
      updateQueue.updaters.push(this)
    } else {
      this.updateComponent()
    }
  }

  updateComponent() {
    const { instance, pendingStates, nextProps } = this
    if (nextProps || pendingStates.length > 0) {
      shouldUpdate(instance, nextProps, this.getState())
    }
  }

  /** 根据 pendingStates 计算最终 state 并执行回调队列和清空两个队列 */
  getState() {
    let {
      instance: { state },
      pendingStates,
    } = this
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
function shouldUpdate<P extends Props = StdProps, S = {}>(
  instance: Component<P, S>,
  nextProps: P | undefined,
  nextState: S
) {
  let willUpdate =
    instance.shouldComponentUpdate?.(nextProps, nextState) ?? true
  if (willUpdate) {
    instance.componentWillUpdate?.()
  }
  nextProps && (instance.props = nextProps)
  // @ts-ignore
  const derivedState = instance.constructor.getDerivedStateFromProps?.(
    nextProps,
    instance.state
  )
  instance.state = derivedState || nextState
  if (willUpdate) {
    instance.forceUpdate()
  }
}

export class PureComponent<P extends Props = StdProps, S = {}> extends Component<P, S> {
  shouldComponentUpdate(nextProps: P = {} as P, nextState: S) {
    return !shallowEqual(this.props, nextProps) || !shallowEqual(this.state, nextState)
  }
}
