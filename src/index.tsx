// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component, PureComponent } from './Component'
import ReactDOM from './react-dom'

const CounterContext = React.createContext<{
  count: number
  dispatch: (action: 'add' | 'minus') => void
} | null>(null)

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

function ChildCounter() {
  const { count, dispatch } = React.useContext(CounterContext)!
  return (
    <div>
      <button onClick={() => dispatch('add')}>+</button>
      <button onClick={() => dispatch('minus')}>-</button>
      <p>{count}</p>
    </div>
  )
}

function Counter() {
  const [count, dispatch] = React.useReducer(reducer, 0)

  return (
    // @ts-ignore
    <CounterContext.Provider value={{ count, dispatch }}>
      <ChildCounter />
    </CounterContext.Provider>
  )
}

ReactDOM.render(React.createElement(Counter, null), document.getElementById('root')!)
