import React from 'react';
import './App.scss';
import Header from './components/Header/Header.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }

  // 重新渲染前被触发
  // shouldComponentUpdate(nextProps, nextState) {
  //   return true;
  // }

  // 组件已经被渲染到 DOM 中
  componentDidMount() {

  }

  componentWillUnmount() {

  }

  // 如果一个 class 组件中定义了 static getDerivedStateFromError() 或 componentDidCatch() 这两个生命周期方法中的任意一个（或两个）时，那么它就变成一个错误边界。
  // 错误边界仅可以捕获其子组件的错误，它无法捕获其自身的错误。
  // 渲染发生错误时，该方法提供默认UI
  // static getDerivedStateFromError(error) {
  //   return { hasError: true };
  // }

  // 发生错误时触发
  componentDidCatch(error, info) {
    console.log(error, info);
  }

  render() {
    return (
      <div className="App">
        <Header></Header>
      </div>
    );
  }
}

export default App;
