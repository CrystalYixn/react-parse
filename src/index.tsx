// import React, { Component } from 'react'
// import ReactDOM from 'react-dom'
import React from './react'
import { Component } from './Component'
import ReactDOM from './react-dom'

type Props = {
  title: string
  name: string
}
type State = {
  color: string
}

// 属性代理，反向继承
class AntDesignButton extends Component<Props> {
  state = { name: 'zs' }
  componentDidMount(): void {
    console.log('AntDesignButton componentDidMount')
  }
  componentWillMount(): void {
    console.log('AntDesignButton componentWillMount')
  }
  render() {
    console.log('AntDesignButton render', this.props)
    return <button name={this.state.name}>{this.props.title}</button>
  }
}

const wrapper = (OldComponent: typeof Component<any, any>) => {
  return class extends OldComponent {
    constructor(props: Props) {
      super(props)
      this.state = { ...this.state, number: 0 }
    }
    componentDidMount() {
      // QAA 为什么执行逻辑是先子后父，不是子 willMount -> 子 render -> 父 render -> 子 didMount 顺序吗？谁调用了父的 willMount 和 didMount
      // A 没错，因为子组件的生命周期中调用了父组件的生命周期
      console.log('wrapper componentDidMount')
      super.componentDidMount!()
    }
    componentWillMount() {
      // 先子后父
      console.log('wrapper componentWillMount')
      super.componentWillMount!()
    }
    handleClick = () => {
      this.setState({ number: this.state.number + 1 })
    }
    render() {
      console.log('wrapper render')
      // let renderElement = super.render() as React.ReactElement<Props>
      let renderElement = super.render() as VDOM
      let newProps = { ...renderElement.props, onClick: this.handleClick }
      // 等同于 renderElement.props = newProps, renderElement.children = this.state.number
      // 劫持父类渲染 children 为数字，修改父类最外层元素 props
      let clonedElement = React.cloneElement(renderElement, newProps, this.state.number)
      return clonedElement
    }
  }
}

let WrappedAntDesignButton = wrapper(AntDesignButton)
// @ts-ignore
ReactDOM.render(<WrappedAntDesignButton title="按钮" />, document.getElementById('root')!)
