import { UserInterface } from './User/state';
import { SettingsInterface } from './Settings/state';
import { CommonInterface } from './Common/state';

export interface GlobalInterfaceBase {
    User: UserInterface,
    Settings: SettingsInterface,
    Common: CommonInterface,
};
