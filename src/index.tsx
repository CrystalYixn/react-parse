// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component, PureComponent } from './Component'
import ReactDOM from './react-dom'

// function SubCounter() {
//   const [count, setCount] = React.useState(1)
//   console.log(` ================== SubCounter ================= `, )
//   setTimeout(() => {
//     setCount(count + 1)
//   }, 1500)
//   return <div>{count}</div>
// }

function Counter() {
  console.log(` ================== count ================= `, )
  const [count, setCount] = React.useState(0)
  const handleClick = () => {
    setCount(count + 1)
  }
  return <div>Counter: {count} <button onClick={handleClick}>+</button></div>
}
// @ts-ignore
ReactDOM.render(<Counter />, document.getElementById('root')!)

