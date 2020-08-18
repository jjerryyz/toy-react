import { createElement, render, Component } from '../toy-react'

class MyComponent extends Component{
  render() {
    return <div>
        <div>{this.children}</div>
        <h1>MyComponent</h1>
      </div>
  }
}

render(<MyComponent id="my-component" class="myclass">
  <h2>123</h2>
  <div></div>
  <div></div>
  <div></div>
</MyComponent>, document.body);