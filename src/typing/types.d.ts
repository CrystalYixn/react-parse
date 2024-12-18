import type {
  REACT_TEXT,
  REACT_FORWARD_REF_TYPE,
  REACT_CONTEXT,
  REACT_PROVIDER,
  REACT_MEMO,
} from '@/constants'
import type { Component } from '@/Component'

declare global {
  type VDOMType<P extends Props> =
    | typeof REACT_TEXT
    | string
    | FunctionVDOMType<P>
    | typeof Component<P>
    | typeof REACT_PROVIDER
    | typeof REACT_CONTEXT
    | typeof REACT_MEMO
  type FunctionVDOMType<P extends Props = StdProps> = (props: P) => VDOM<P>

  // 给了默认值有什么影响?
  // 拥有默认值后时，可以进行逆推导类型，不需要再传入，默认值推荐给最小范围对象
  // 不给默认值有什么影响？
  // 强制要求传入泛型
  type VDOM<P extends Props = StdProps> =
    | FunctionVDOM<P>
    | ClassVDOM<P>
    | NormalVDOM
    | ForwardVDOM
    | ContextProviderVDOM<P>
    | ContextConsumerVDOM<P>
    | MemoVDOM<P>

  type StdVDOM<P extends Props = StdProps> = {
    props: P
    ref?: { current: Component | Node }
  }

  type ContextProviderVDOM<P extends Props = StdProps> = {
    type: { $$typeof: typeof REACT_PROVIDER; _context: Context<P> }
    renderVdom?: VDOM<P>
  } & StdVDOM<P & { value: unknown }>

  type ContextConsumerVDOM<P extends Props = StdProps> = {
    type: { $$typeof: typeof REACT_CONTEXT; _context: Context<P> }
    renderVdom?: VDOM<P>
  } & StdVDOM<{ children: (value: unknown) => VDOM }>

  type MemoVDOM<P extends Props = StdProps> = {
    type: {
      $$typeof: typeof REACT_MEMO
      type: FunctionVDOMType<P>
      compare: (prevProps: P, nextProps: P) => boolean
    }
    prevProps?: P
    renderVdom?: VDOM<P>
  } & StdVDOM<P>

  type FunctionVDOM<P extends Props = StdProps> = {
    type: FunctionVDOMType<P>
    renderVdom?: VDOM<P>
  } & StdVDOM<P>

  type ClassVDOM<P extends Props = StdProps> = {
    type: typeof Component<P>
    renderVdom?: VDOM<P>
    instance: Component<P>
  } & StdVDOM<P>

  type NormalVDOM = {
    type: REACT_TEXT | string
    dom?: DOM
  } & StdVDOM

  type ForwardVDOM<P extends Props = StdProps> = {
    type: {
      $$typeof: typeof REACT_FORWARD_REF_TYPE
      render: (p: Props, ref: Ref) => React.JSX.Element
    }
    renderVdom?: VDOM<P>
  } & StdVDOM

  type Props = StdProps & { [k: string]: any }
  type StdProps = {
    children?: VDOM | VDOM[]
    style?: { [k: string]: string }
    content?: string
  }

  type DOM = (HTMLElement | Text) & {
    store?: { [eventName: string]: (...args: unknown[]) => unknown }
    componentDidMount?: () => void
  }

  type EventType = Exclude<
    keyof GlobalEventHandlers,
    'onerror' | 'removeEventListener' | 'addEventListener'
  >

  type Ref<T> = { current: T | null }
}
