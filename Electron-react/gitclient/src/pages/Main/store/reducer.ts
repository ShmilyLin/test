import { combineReducers } from 'redux';
import AddTabMenu from './AddTabMenu/reducer';
import Tabs from './Tabs/reducer';
import Repositories from './Repositories/reducer';
import User from '../../../store/User/reducer';
import Settings from '../../../store/Settings/reducer';
import Common from '../../../store/Common/reducer';

export default combineReducers({
    AddTabMenu,
    Tabs,
    Repositories,
    User,
    Settings,
    Common,
});
