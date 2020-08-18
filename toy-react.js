
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
  get root() {
    if (!this._root) {
      this._root = this.render().root;
    }
    return this._root;
  }
}

/**
 * 代理处理 DOM 节点请求
 */
class ElementWrapper{
  constructor(type) {
    this.root = document.createElement(type);
  }
  setAttribute (name, value) {
    document.setAttribute(name, value)
  }
  appendChild(child) {
    this.root.appendChild(child.root)
  }
}

class TextWrapper {
  constructor(content) {
    this.root = document.createTextNode(content)
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
  parentElement.appendChild(component.root);
}