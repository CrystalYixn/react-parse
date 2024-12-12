// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component, PureComponent } from './Component'
import ReactDOM from './react-dom'

function SubCounter({
  data,
  handleClick,
}: {
  data: { count: number }
  handleClick?: () => void
}) {
  console.log(` ================== SubCounter ================= `)
  return (
    <div>
      SubCounter: {data.count}
      <button onClick={handleClick}>+</button>
    </div>
  )
}

const MemoSubCounter = React.memo(SubCounter)

function Counter() {
  console.log(` ================== count ================= `)
  // 为了对比仅父组件更新和父子都更新
  const [count, setCount] = React.useState(0)
  // 为了触发父组件重新渲染
  const [name, setName] = React.useState('')
  const handleClick = () => {
    if (name === 'a') {
      setCount(1)
    } else {
      setCount(2)
    }
  }
  // 不使用 useMemo 时，每次都是一个新对象，导致子组件更新
  // const data = { count }
  const memoData = React.useMemo(() => ({ count }), [count])
  const memoClick = React.useCallback(handleClick, [name])

  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      {/* @ts-ignore */}
      <MemoSubCounter data={memoData} handleClick={memoClick} />
    </div>
  )
}
// @ts-ignore
ReactDOM.render(<Counter />, document.getElementById('root')!)
