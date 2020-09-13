const RENDER_TO_DOM = Symbol('render to dom')

// 元素节点
class ElementWrap {
  constructor(type) {
    this.root = document.createElement(type)
  }
  setAttribute(name, value) {
    if (name.match(/^on([\s\S]+)$/)) {
      this.root.addEventListener(RegExp.$1.replace(/^[\s\S]/, chr => chr.toLocaleLowerCase()), value)
    } else {
      this.root.setAttribute(name, value)
    }
  }
  appendChild(component) {
    const range = document.createRange()
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    component[RENDER_TO_DOM](range)
    // this.root.appendChild(element.root)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

// 文本节点
class TextWrap {
  constructor(content) {
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM](range) {
    range.deleteContents()
    range.insertNode(this.root)
  }
}

// 自定义组件类
export class Component {
  constructor() {
    this.props = Object.create(null)
    this.children = []
    this._root = null
    this._range = null
  }
  setAttribute(name, value) {
    this.props[name] = value
  }
  appendChild(element) {
    this.children.push(element)
  }
  setState(ns) {
    if (this.state === null || typeof this.state !== 'object') {
      this.state = new
      this.rerender()
      return
    }
    const merge = (os, ns) => {
      for (let item in ns) {
        if (os[item] === null || typeof os[item] !== 'object') {
          os[item] = ns[item]
        } else {
          merge(os[item], ns[item])
        }
      }
    }
    merge(this.state, ns)
    this.rerender()
  }
  [RENDER_TO_DOM](range) {
    this._range = range
    this.render()[RENDER_TO_DOM](range)
  }
  // get root() {
  //   if (!this._root && this.render()) {
  //     this._root = this.render().root
  //   }
  //   return this._root
  // }
  rerender() {
    this._range.deleteContents()
    this[RENDER_TO_DOM](this._range)
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
      if (['string', 'number'].includes(typeof j)) {
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

export function render(component, parentElement) {
  // parentElement.appendChild(element.root)
  const range = document.createRange()
  range.setStart(parentElement, 0)
  range.setEnd(parentElement, parentElement.childNodes.length)
  range.deleteContents()
  component[RENDER_TO_DOM](range)
}
