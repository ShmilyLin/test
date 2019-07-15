import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import GlobalReducer from './store/reducer';
import Global from './store/state';

const store = createStore(GlobalReducer, Global);

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('root')
);

declare global {
    interface Window {
        require: (name: string) => any;
    }
}