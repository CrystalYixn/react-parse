// import React from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

class ClassComponent extends Component<{ name: string }> {
  render() {
    // return <h1>FunctionComponent, { this.props.name }</h1>
    return React.createElement('h1', null, 'FunctionComponent, ', this.props.name)
  }
}

const element = React.createElement(ClassComponent, {
  name: 'hello',
})

ReactDOM.render(element, document.getElementById('root')!)
