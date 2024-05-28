// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React, { createRef, forwardRef } from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

class Counter extends Component {
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
    this.setState({ number: this.state.number + 1 })
  }

  render() {
    console.log('render')
    return (
      <div>
        <p>{this.state.number}</p>
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

const element = React.createElement(Counter, null)

ReactDOM.render(element, document.getElementById('root')!)
