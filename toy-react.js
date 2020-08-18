const RENDER_TO_DOM = Symbol('render to dom');

export class Component {
  constructor () {
    this.props = Object.create(null); // 没有挂到 Object 原型上的空对象
    this.children = [];
    this._root = null; // TODO: 有更好的方法限定访问
  }
  setAttribute (name, value) {
    this.props[name] = value;
  }
  appendChild (child) {
    this.children.push(child)
  }
  rerender () {
    this._range.deleteContents();
    this[RENDER_TO_DOM](this._range)
  }
  [RENDER_TO_DOM] (range) {
    this._range = range;
    this.render()[RENDER_TO_DOM](range)
  }
  setState(newState) {
    if (this.state === null && typeof this.state !== 'object') {
      this.state = newState;
      this.rerender();
      return;
    }

    let merge = (oldState, newState)=>{
      for (let n in newState) {
        if (n !== null && typeof n !== 'object') {
          oldState[n] = newState[n]
        } else {
          merge(oldstate[n], newState[n])
        }
      }
    }
    merge(this.state, newState);

    this.rerender();
  }
}

/**
 * 代理处理 DOM 节点请求
 */
class ElementWrapper {
  constructor (type) {
    this.root = document.createElement(type);
  }
  setAttribute (name, value) {
    // 绑定函数
    if (name.match(/^on([\s\S]+)$/)) {
      let event = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
      this.root.addEventListener(event, value)
    } else {
      if (name === 'className') {
        this.root.setAttribute('class', value)
      } else {
        this.root.setAttribute(name, value)
      }
    }
  }
  appendChild (component) {
    let range = document.createRange();
    range.setStart(this.root, this.root.childNodes.length)
    range.setEnd(this.root, this.root.childNodes.length)
    component[RENDER_TO_DOM](range)
  }
  [RENDER_TO_DOM] (range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

class TextWrapper {
  constructor (content) {
    this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM] (range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
}

export function createElement (type, attrs, ...children) {
  let e;
  if (typeof type === 'string') {
    e = new ElementWrapper(type)
  } else {
    e = new type;
  }

  for (let a in attrs) {
    e.setAttribute(a, attrs[a])
  }

  // 递归插入子节点
  let insertChildren = (children) => {
    for (let child of children) {
      if (typeof child === 'string') {
        child = new TextWrapper(child);
      }
      if (child === null) {
        continue;
      }
      if (typeof child === 'object' && (child instanceof Array)) {
        insertChildren(child);
      } else {
        e.appendChild(child)
      }
    }
  }
  insertChildren(children);

  return e;
}

export function render (component, parentElement) {
  let range = document.createRange();
  range.setStart(parentElement, 0);
  range.setEnd(parentElement, parentElement.childNodes.length)
  component[RENDER_TO_DOM](range)
}