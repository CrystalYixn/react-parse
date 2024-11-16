// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

type ChildProps = {
  count: number
}

type Props = {}
type State = {
  number: number
}

class ChildCounter extends Component<ChildProps> {
  state = {
    count: 0
  }
  componentWillMount() {
    console.log(`ChildCounter 1.componentWillMount`, )
  }
  render() {
    console.log(`ChildCounter 2.render`, )
    return <div>ChildCounter:{this.state.count}</div>
  }
  componentDidMount() {
    console.log(`ChildCounter 3.componentDidMount`, )
  }
  static getDerivedStateFromProps(nextProps: ChildProps, prevState: any) {
    
    const { count } = nextProps
    console.log('=============== getDerivedStateFromProps ===============', count);
    return {...prevState, count:count*2}
  }
  componentWillUnmount() {
    console.log(`ChildCounter 6.componentWillUnmount`, )
  }
}

class Counter extends Component<Props, State> {
  constructor(props: Props) {
    console.log('Counter 1.constructor')
    super(props)
    this.state = { number: 0 }
  }
  componentWillMount() {
    console.log('Counter 2.componentWillMount')
  }
  componentDidMount() {
    console.log('Counter 4.componentDidMount')
  }
  componentWillUpdate() {
    console.log('Counter 6.componentWillUpdate')
  }
  componentDidUpdate() {
    console.log('Counter 7.componentDidUpdate')
  }

  handleClick = () => {
    this.setState({ number: this.state.number + 1 })
  }

  render() {
    console.log('Counter 3.render')
    return (
      <div>
        <p>Counter:{this.state.number}</p>
        <ChildCounter count={this.state.number}/>
        {/* {React.createElement(ChildCounter, { count: this.state.number })} */}
        <button onClick={this.handleClick}>+</button>
      </div>
    )
  }
}

const element = React.createElement(Counter, null)
console.log(` ================== React ================= `, React)

ReactDOM.render(element, document.getElementById('root')!)
