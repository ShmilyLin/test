import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
// import logo from '../../assets/logo.svg';
import './App.scss';
import Navigation from './components/Navigation/Navigation';
// import { GlobalInterface } from './store/state';
import AddTabMenu from './components/AddTabMenu/AddTabMenu';
import Content from './components/Content/Content';
import Footer from './components/Footer/Footer';


interface AppProps {
  // state: GlobalInterface;
  dispatch: (action: AnyAction) => void;
}

// const App: React.FC<AppProps> = (props) => {
//   console.log('App', props);

//   return (
//     <div className="App">
//       <Navigation />
//       <AddTabMenu />
//     </div>
//   );
// }

// const mapStateToProps = (state: GlobalInterface) => ({
//   state
// });

class App extends React.Component<AppProps> {
  constructor(props: AppProps) {
    super(props);

    this.state = {

    }

    console.log('App', props);
  }

  public render() {
    console.log('【App】 render');

    return (
      <div className="App">
        <Navigation />
        <Content />
        <Footer />
        <AddTabMenu />
      </div>
    );
  }
}

export default connect()(App);
