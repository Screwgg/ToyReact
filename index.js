import { createElement, Component, render } from './toy-react'

class MyComponent extends Component {
  constructor() {
    super()

    this.state = {
      a: 888
    }
  }

  render() {
    return (
      <div>
        test component
        {this.state.a}
        <button onclick={() => this.setState({ a: this.state.a + 1 })}>add</button>
        {this.children}
      </div>
    )
  }
}

const content = (
  <MyComponent class="a" id="b">
    123
    <span>567</span>
    <span>89</span>
  </MyComponent>
)

content.appendChild(<div>extra</div>)

render(content, document.body)
