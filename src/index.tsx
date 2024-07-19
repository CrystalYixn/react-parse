// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React, { createRef, forwardRef } from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

function TextInput(props: Props, ref: Ref<HTMLInputElement>) {
  return <input ref={ref} />
}

const ForwardedTextInput = forwardRef(TextInput)

class Counter extends Component {
  textInputRef = createRef<HTMLParagraphElement>()
  constructor(props: any) {
    super(props)
    this.state = { number: 0 }
  }
  componentWillMount() {
    console.log('componentWillMount')
  }
  componentDidMount() {
    console.log('componentDidMount')
  }
  shouldComponentUpdate(nextProps: any, nextState: { number: number }) {
    console.log('ShouldComponentUpdate')
    return nextState.number % 2 === 0
  }
  componentWillUpdate() {
    console.log('componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('componentDidUpdate')
  }

  handleClick = () => {
    // this.setState({ number: this.state.number + 1 })
    this.textInputRef.current?.focus()
  }

  render() {
    console.log('render')
    return (
      <div>
        <p>{this.state.number}</p>
        {/* @ts-ignore */}
        <ForwardedTextInput ref={this.textInputRef} />
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

const element = React.createElement(Counter, null)

ReactDOM.render(element, document.getElementById('root')!)
