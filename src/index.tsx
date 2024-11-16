// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

const ThemeContext = React.createContext<null | {
  color: string
  changeColor: (color: string) => void
}>(null)

type Props = {}
type State = {
  color: string
}

class Header extends Component {
  // 固定写法，写死 contextType 变量名称
  static contextType = ThemeContext
  render() {
    return (
      <div
        style={{
          margin: '10px',
          padding: '5px',
          border: `5px solid ${(this.context as any).color}`,
        }}
      >
        头部
        <Title />
      </div>
    )
  }
}

class Title extends Component {
  static contextType = ThemeContext
  render() {
    return (
      <div
        style={{
          margin: '10px',
          padding: '5px',
          border: `5px solid ${(this.context as any).color}`,
        }}
      >
        标题
      </div>
    )
  }
}

class Main extends Component {
  static contextType = ThemeContext
  render() {
    return (
      <div
        style={{
          margin: '10px',
          padding: '5px',
          border: `5px solid ${(this.context as any).color}`,
        }}
      >
        主体
        <Content />
      </div>
    )
  }
}

class Content extends Component {
  static contextType = ThemeContext
  render() {
    return (
      <div
        style={{
          margin: '10px',
          padding: '5px',
          border: `5px solid ${(this.context as any).color}`,
        }}
      >
        内容
        <button onClick={() => (this.context as any).changeColor('red')}>red</button>
        <button onClick={() => (this.context as any).changeColor('blue')}>blue</button>
      </div>
    )
  }
}

class ScrollList extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { color: 'red' }
  }
  changeColor = (color: string) => {
    this.setState({ color })
  }

  render() {
    let value = { color: this.state.color, changeColor: this.changeColor }
    return (
      // @ts-ignore
      <ThemeContext.Provider value={value}>
        <div
          style={{
            margin: '10px',
            padding: '5px',
            border: `5px solid ${this.state.color}`,
            width: '200px',
          }}
        >
          <Header />
          <Main />
        </div>
      </ThemeContext.Provider>
    )
  }
}

const element = React.createElement(ScrollList, null)
ReactDOM.render(element, document.getElementById('root')!)
