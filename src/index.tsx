// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component, PureComponent } from './Component'
import ReactDOM from './react-dom'



class SubCounter extends PureComponent<{ count: number }> {
  render() {
    console.log(` ================== SubCounter ================= `)
    return <div>{this.props.count}</div>
  }
}

class Counter extends PureComponent {
  state = { count: 0 }
  inputRef = React.createRef<HTMLInputElement>()
  handleClick = () => {
    const amount = +this.inputRef.current!.value
    this.setState({ count: this.state.count + amount })
  }
  render() {
    console.log(` ================== Counter ================= `, )
    return (
      <div>
        {this.state.count}
        <input ref={this.inputRef} />
        <button onClick={this.handleClick}>+</button>
        {/* @ts-ignore */}
        <SubCounter count={this.state.count} />
      </div>
    )
  }
}
// @ts-ignore
ReactDOM.render(<Counter />, document.getElementById('root')!)

