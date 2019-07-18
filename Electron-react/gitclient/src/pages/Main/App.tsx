import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
import Listener, { ListenerKeys } from './utils/Listener';

// SCSS
import './App.scss';

// Store
import { GlobalInterface } from './store/state';
import { CommonInterface } from './store/Common/state';
import CommonActions from './store/Common/actions';

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

    this.modalOnHideEvent = this.modalOnHideEvent.bind(this);
  }

  public modalOnHideEvent(res: {
    confirm: boolean;
    cancel: boolean;
  }) {
    if (this.props.state.Common.modal.success) {
      this.props.state.Common.modal.success(res);
    }

    this.props.dispatch(CommonActions.HideModal());
  }

  public render() {
    console.log('【App】 render', this.props.state);

    return (
      <div className="App">
        <Navigation />
        <Content />
        <Footer />
        <AddTabMenu />
        {this.props.state.Common.modal.show &&
          <Modal title={this.props.state.Common.modal.title} 
            content={this.props.state.Common.modal.content} 
            showCancel={this.props.state.Common.modal.showCancel} 
            cancelText={this.props.state.Common.modal.cancelText} 
            confirmText={this.props.state.Common.modal.confirmText} onHide={this.modalOnHideEvent}/>
        }
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
