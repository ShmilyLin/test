import { combineReducers } from 'redux';
import User from '../../../store/User/reducer';
import Settings from '../../../store/Settings/reducer';
import Common from '../../../store/Common/reducer';

export default combineReducers({
    User,
    Settings,
    Common,
});
