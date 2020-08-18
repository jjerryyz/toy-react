const RENDER_TO_DOM = Symbol('render to dom');

export class Component {
  constructor () {
    this.props = Object.create(null); // 没有挂到 Object 原型上的空对象
    this.children = [];
    this._root = null; // TODO: 有更好的方法限定访问
    this._range = null;
  }
  setAttribute (name, value) {
    this.props[name] = value;
  }
  appendChild (child) {
    this.children.push(child)
  }
  // rerender () {
  //   this._range.deleteContents();
  //   this[RENDER_TO_DOM](this._range)
  // }
  get vdom () {
    return this.render().vdom;
  }


  [RENDER_TO_DOM] (range) {
    this._range = range;
    this._vdom = this.vdom;
    this.vdom[RENDER_TO_DOM](range)
  }


  update () {

  }
  setState (newState) {
    if (this.state === null && typeof this.state !== 'object') {
      this.state = newState;
      this.rerender();
      return;
    }

    let merge = (oldState, newState) => {
      for (let n in newState) {
        if (n !== null && typeof n !== 'object') {
          oldState[n] = newState[n]
        } else {
          merge(oldstate[n], newState[n])
        }
      }
    }
    merge(this.state, newState);

    this.update();
  }
}

function replaceContent () {

}


/**
 * 代理处理 DOM 节点请求
 */
class ElementWrapper extends Component {
  constructor (type) {
    super();
    this.type = type;
    // this.root = document.createElement(type);
  }
  // setAttribute (name, value) {
  //   // 绑定函数
  //   if (name.match(/^on([\s\S]+)$/)) {
  //     let event = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
  //     this.root.addEventListener(event, value)
  //   } else {
  //     if (name === 'className') {
  //       this.root.setAttribute('class', value)
  //     } else {
  //       this.root.setAttribute(name, value)
  //     }
  //   }
  // }
  // appendChild (component) {
  //   let range = document.createRange();
  //   range.setStart(this.root, this.root.childNodes.length)
  //   range.setEnd(this.root, this.root.childNodes.length)
  //   component[RENDER_TO_DOM](range)
  // }

  [RENDER_TO_DOM] (range) {
    // 将 vdom 转为 真实 dom
    let root = document.createElement(this.type);

    for (let name in this.props) {
      if (name.match(/^on([\s\S]+)$/)) {
        let event = RegExp.$1.replace(/^[\s\S]/, c => c.toLowerCase());
        root.addEventListener(event, value)
      } else {
        if (name === 'className') {
          root.setAttribute('class', value)
        } else {
          root.setAttribute(name, value)
        }
      }
    }

    if (!this.vchildren)
      this.vchildren = this.children.map(child=>child.vdom)

    for (let child of this.vchildren) {
      let childRange = document.createRange();
      childRange.setStart(root, root.childNodes.length)
      childRange.setEnd(root, root.childNodes.length)
      child[RENDER_TO_DOM](childRange)
    }

    replaceContent(range, root)
    
  }
  get vdom () {
    this.vchildren = this.children.map(child => child.vdom)
    return this;
  }
}

class TextWrapper extends Component {
  constructor (content) {
    super();
    this.type = '#text'
    // this.root = document.createTextNode(content)
  }
  [RENDER_TO_DOM] (range) {
    range.deleteContents();
    range.insertNode(this.root);
  }
  get vdom () {
    return this;
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