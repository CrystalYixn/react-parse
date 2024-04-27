// import React from 'react'
// import ReactDOM from 'react-dom/client'
import React from './react'
import ReactDOM from './react-dom'

function FunctionComponent(props: { name: string }) {
  // 如果要使用 JSX 语法需要禁止新的 JSX Transform 转换, 使用 npm run dev
  // 新的 JSX Transform 不会转换为 React.createElement
  return <h1>FunctionComponent, { props.name }</h1>
  // return React.createElement('h1', null, 'FunctionComponent, ', props.name)
}

const element = React.createElement(FunctionComponent, {
  name: 'hello',
})

ReactDOM.render(element, document.getElementById('root')!)
