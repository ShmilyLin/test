import { combineReducers } from 'redux';
import AddTabMenu from './AddTabMenu/reducer';
import Tabs from './Tabs/reducer';
import Repositories from './Repositories/reducer';
import User from './User/reducer';
import Settings from './Settings/reducer';
import Common from './Common/reducer';

export default combineReducers({
    AddTabMenu,
    Tabs,
    Repositories,
    User,
    Settings,
    Common,
});
