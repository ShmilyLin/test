import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import Listener, { ListenerKeys } from '../../utils/Listener';

// SCSS
import './App.scss';

// Store
import { GlobalInterface } from './store/state';
import { CommonInterface } from '../../store/Common/state';

// Components
import Navigation from './components/Navigation/Navigation';
import AddTabMenu from './components/AddTabMenu/AddTabMenu';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';
import Modal from '../../components/Modal/Modal';


interface AppProps {
  state: {
    Common: CommonInterface,
  };
  dispatch: (action: AnyAction) => void;
}

class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);

    console.log('App', props);

    document.onclick = (e) => {
      Listener.done(ListenerKeys.DocumentClick, e);
    };
  }

  public render() {
    console.log('【App】 render', this.props.state);

    return (
      <div className="App">
        <Navigation />
        <Content />
        <Footer />
        <AddTabMenu />
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
