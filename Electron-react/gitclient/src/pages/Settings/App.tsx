import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import Listener, { ListenerKeys } from '../../utils/Listener';

// Components
import Common from './components/Common/Common';
import GitHub from './components/GitHub/GitHub';

// SCSS
import './App.scss';

// Store
import { GlobalInterface } from './store/state';
import { CommonInterface } from '../../store/Common/state';

// Components
import Modal from '../../components/Modal/Modal';


interface AppProps {
  state: {
    Common: CommonInterface,
  };
  dispatch: (action: AnyAction) => void;
}

interface AppState {
  tabsIndex: number;
}

class App extends React.Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);

    console.log('App', props);
    this.state = {
      tabsIndex: 0,
    };

    document.onclick = (e) => {
      Listener.done(ListenerKeys.DocumentClick, e);
    };

    this.tabsItemClick = this.tabsItemClick.bind(this);
  }

  public tabsItemClick(index: number) {
    if (index !== this.state.tabsIndex) {
      this.setState({
        tabsIndex: index,
      })
    }
  }

  public render() {
    return (
      <div className="App">
        <div className="app-bar"></div>
        <div className="app-tabs">
          <div className={"app-tabs-item" + (this.state.tabsIndex === 0 ? ' app-tabs-item-selected' : '')} 
            onClick={() => this.tabsItemClick(0)}>
            <div className="app-tabs-item-icon app-tabs-item-icon-common"></div>
            <div className="app-tabs-item-text">常规</div>
          </div>
          <div className={"app-tabs-item" + (this.state.tabsIndex === 1 ? ' app-tabs-item-selected' : '')} 
            onClick={() => this.tabsItemClick(1)}>
            <div className="app-tabs-item-icon app-tabs-item-icon-github"></div>
            <div className="app-tabs-item-text">GitHub</div>
          </div>
        </div>
        <div className="app-content">
          <Common show={this.state.tabsIndex === 0} />
          <GitHub show={this.state.tabsIndex === 1} />
        </div>
        <Modal />
      </div>
    );
  }
}

const mapStateToProps = (state: GlobalInterface) => ({
  state: {
    Common: state.Common,
  }
});

export default connect(mapStateToProps)(App);
