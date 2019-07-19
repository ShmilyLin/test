import UserState from '../../../store/User/state';
import SettingsState from '../../../store/Settings/state';
import CommonState from '../../../store/Common/state';
import { GlobalInterfaceBase } from '../../../store/state';

export interface GlobalInterface extends GlobalInterfaceBase {
    
};

const Global: GlobalInterface = {
    User: UserState,
    Settings: SettingsState,
    Common: CommonState,
};

export default Global;
