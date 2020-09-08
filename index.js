import { createElement, Component, render } from './toy-react'

class MyComponent extends Component {
  render() {
    return (
      <div>
        test component
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
