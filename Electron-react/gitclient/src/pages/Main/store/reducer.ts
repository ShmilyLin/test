import { combineReducers } from 'redux';
import AddTabMenu from './AddTabMenu/reducer';
import Tabs from './Tabs/reducer';
import Repositories from './Repositories/reducer';

export default combineReducers({
    AddTabMenu,
    Tabs,
    Repositories,
});
