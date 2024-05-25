// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React, { createRef, forwardRef } from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

class Counter extends Component {
  state = { number: 0 }
  inputA = createRef<HTMLInputElement>()
  inputB = createRef<HTMLInputElement>()
  inputResult = createRef<HTMLInputElement>()
  componentRef = createRef<MyInput>()
  funcRef = createRef<HTMLInputElement>()

  render() {
    const { inputA, inputB, inputResult } = this
    console.log(` ================== render 方法执行 ================= `)
    return (
      <div>
        <input ref={inputA}></input>
        <input ref={inputB}></input>
        <button onClick={this.handleClick}>=</button>
        <input ref={inputResult}></input>
        <button onClick={this.focus1}>focus1</button>
        <MyInput ref={this.componentRef} />
        <button onClick={this.focus2}>focus2</button>
        <ForwardedInput ref={this.funcRef} />
        {/* QA 为什么这样也可以？ref 不是在 type: MyFunc 这个 vdom 上的吗 */}
        {/* A 函数式组件会将组件上的 props 继续向下传递给 renderVdom, 所以有 */}
        {/* <button onClick={this.focus2}>focus2</button>
        <MyFunc ref={this.funcRef}></MyFunc> */}
      </div>
    )
  }

  // 处理原生 DOM ref
  handleClick = () => {
    this.inputResult.current!.value =
      this.inputA.current!.value + this.inputB.current!.value
  }

  // 父组件调用子组件方法
  focus1 = () => {
    this.componentRef.current?.inputRef.current?.focus()
  }

  // 引用函数式子组件 DOM
  focus2 = () => {
    this.funcRef.current?.focus()
  }
}

class MyInput extends Component {
  inputRef = createRef<HTMLInputElement>()
  context = null
  refs = {}
  render() {
    return <input ref={this.inputRef}></input>
  }
}

function MyFunc(
  props: Props,
  ref: ReturnType<typeof createRef<HTMLInputElement>>
) {
  return <input ref={ref}></input>
}

const ForwardedInput: any = forwardRef(MyFunc)

// QA 明明这样也可以, 就是为了将 ref 提到 props 之外所以去套一层？
// function MyFunc(props: Props) {
//   return <input ref={props.ref}></input>
// }


const element = React.createElement(Counter, null)

ReactDOM.render(element, document.getElementById('root')!)
