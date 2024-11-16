// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

type Props = {}
type State = {
  messages: string[]
}

class ScrollList extends Component<Props, State> {
  wrapper: React.RefObject<HTMLDivElement>
  timer: NodeJS.Timeout | null = null
  constructor(props: Props) {
    super(props)
    this.state = { messages: ['3', '2', '1', '0'] }
    this.wrapper = React.createRef()
  }
  addMessage = () => {
    this.setState({ messages: [`${this.state.messages.length}`, ...this.state.messages] })
  }
  componentDidMount() {
    this.timer = setInterval(() => {
      this.addMessage()
    }, 1000)
  }
  componentWillUnmount() {
    clearInterval(this.timer!)
  }
  getSnapshotBeforeUpdate() {
    return {
      prevScrollHeight: this.wrapper.current!.scrollHeight,
      prevScrollTop: this.wrapper.current!.scrollTop
    }
  }
  componentDidUpdate(prevProps: Props, prevState: State, snapshot: { prevScrollHeight: number; prevScrollTop: number }) {
    const currentHeight = this.wrapper.current!.scrollHeight
    const prevHeight = snapshot.prevScrollHeight
    const prevTop = snapshot.prevScrollTop
    this.wrapper.current!.scrollTop = currentHeight - prevHeight + prevTop
  }

  render() {
    let style = {
      height: '100px',
      width: '200px',
      border: '1px solid red',
      overflow: 'auto'
    }
    return (
      <div ref={this.wrapper} style={style}>
        {this.state.messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
    )
  }
}

const element = React.createElement(ScrollList, null)
ReactDOM.render(element, document.getElementById('root')!)
