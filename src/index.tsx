// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component, PureComponent } from './Component'
import ReactDOM from './react-dom'

function reducer(state: number, action: 'add' | 'minus') {
  switch (action) {
    case 'add':
      return state + 1
    case 'minus':
      return state - 1
    default:
      return state
  }
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0)
  const [name, setName] = React.useState('')

  return (
    <div>
      <button onClick={() => dispatch('add')}>+</button>
      <button onClick={() => dispatch('minus')}>-</button>
      <p>{count}</p>
      <input value={name} onChange={e => setName(e.target.value)} />
      {name}
    </div>
  )
}
// @ts-ignore
ReactDOM.render(<Counter />, document.getElementById('root')!)
