// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

class Counter extends Component {
  state = { number: 0 }
  constructor(props: {}) {
    super(props)
  }

  render() {
    // const x = React.createElement(
    //   'div',
    //   null,
    //   React.createElement('button', { onClick: this.handleClick }, '+1')
    // )
    // return x
    return (<div>
      { this.state.number }
      <button onClick={this.handleClick}>+1</button>
    </div> as unknown as VDOM)
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
  }
}

const element = React.createElement(Counter, null)

ReactDOM.render(element, document.getElementById('root')!)
