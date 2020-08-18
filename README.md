# toy-react
为了了解react原理造的实验性质的轮子

## 安装环境
yarn init

yarn add -D webpack webpack-cli

yarn add -D babel-loader @babel/core @babel/preset-env

## 创建配置文件
### webpack
主要是babel部分，需要配置指定jsx插件

## 运行与调试
npx webpack

npx webpack --watch

## 替换 React.createElement 
jsx loader 会将 js文件中的 html 语法解析为 React.createElement；

webpack 配置中显示将 React.createElement 替换为自定义的方法：

```js
plugins: [['@babel/plugin-transform-react-jsx', { pragma: 'createElement'}]]
```
* pragma 是 jsx 插件中允许的参数，可以指定替代 React.createElement 为自定义的渲染方法


