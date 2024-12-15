// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component, PureComponent } from './Component'
import ReactDOM from './react-dom'

function Counter() {
  const [count, setCount] = React.useState(0)
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCount(count + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [count])

  return (
    <div>
      <p>{count}</p>
    </div>
  )
}

ReactDOM.render(
  React.createElement(Counter, null),
  document.getElementById('root')!
)
