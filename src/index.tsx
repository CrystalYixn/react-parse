// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

type Props = {
  onShow: () => void
  onHide: () => void
}
type State = {
  color: string
}

const withLoading = (OldComponent: typeof Component<any, any>) => {
  return class extends Component {
    show = () => {
      let div = document.createElement('div')
      div.innerHTML = '<p id="loading" style="position: absolute;top:100px;z-index:10;background-color:gray">loading...</p>'
      document.body.appendChild(div)
    }
    hide = () => {
      let div = document.querySelector('#loading')
      div?.remove()
    }
    render() {
      // @ts-ignore
      return <OldComponent {...this.props} onShow={this.show} onHide={this.hide} />
    }
  }
}

// 属性代理，反向继承
class Panel extends Component<Props, State> {
  render() {
    return (
      <div>
        <button onClick={this.props.onShow}>显示</button>
        <button onClick={this.props.onHide}>隐藏</button>
      </div>
    )
  }
}

// const element = React.createElement(withLoading(Panel), null)
const LoadingPanel = withLoading(Panel)
ReactDOM.render(<LoadingPanel />, document.getElementById('root')!)
