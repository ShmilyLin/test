import React from 'react';
import { connect } from 'react-redux';
import { AnyAction } from 'redux';
// import logo from '../../assets/logo.svg';
import './App.css';
import Navigation from './components/Navigation/Navigation';
// import { GlobalInterface } from './store/state';
import AddTabMenu from './components/AddTabMenu/AddTabMenu';


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
        <AddTabMenu />
      </div>
    );
  }
}

export default connect()(App);
