class ElementWrap {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    this.root.setAttribute(name, value)
  }
  appendChild(element) {
    this.root.appendChild(element.root)
  }
}

class TextWrap {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
}

export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(element) {
    this.children.push(element)
  }
  get root() {
    if (!this._root && this.render()) {
      this._root = this.render().root
    }
    return this._root
  }
}

// type: string | SomeComponent
// attributes: Record<string, any>
// children: HTMLElement[]
export function createElement(type, attributes, ...children) {
  let e
  if (typeof type === 'string') {
    e = new ElementWrap(type)
  } else {
    e = new type
  }
  for (let i in attributes) {
    e.setAttribute(i, attributes[i])
  }

  // 递归展开
  function loopChildren(children) {
    for (let j of children) {
      if (typeof j === 'string') {
        j = new TextWrap(j)
      }
      if (typeof j === 'object' && j instanceof Array) {
        loopChildren(j)
      } else {
        e.appendChild(j)
      }
    }
  }
  loopChildren(children)

  return e
}

export function render(element, parentElement) {
  parentElement.appendChild(element.root)
}
