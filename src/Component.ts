export class Component<P = Props> {
  static isReactComponent = {}
  props: P
  constructor(props: P) {
    this.props = props
  }
}