
import AddTabMenuState, { AddTabMenuInterface } from './AddTabMenu/state';
import TabsState, { TabsInterface } from './Tabs/state';
import RepositoriesState, { RepositoriesInterface } from './Repositories/state';
import UserState from '../../../store/User/state';
import SettingsState from '../../../store/Settings/state';
import CommonState from '../../../store/Common/state';
import { GlobalInterfaceBase } from '../../../store/state';

export interface GlobalInterface extends GlobalInterfaceBase {
    AddTabMenu: AddTabMenuInterface;
    Tabs: TabsInterface,
    Repositories: RepositoriesInterface,
};

const Global: GlobalInterface = {
    AddTabMenu: AddTabMenuState,
    Tabs: TabsState,
    Repositories: RepositoriesState,
    User: UserState,
    Settings: SettingsState,
    Common: CommonState,
};

export default Global;
