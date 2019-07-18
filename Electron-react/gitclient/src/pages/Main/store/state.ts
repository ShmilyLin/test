
import AddTabMenuState, { AddTabMenuInterface } from './AddTabMenu/state';
import TabsState, { TabsInterface } from './Tabs/state';
import RepositoriesState, { RepositoriesInterface } from './Repositories/state';
import UserState, { UserInterface } from './User/state';
import SettingsState, { SettingsInterface } from './Settings/state';
import CommonState, { CommonInterface } from './Common/state';

export interface GlobalInterface {
    AddTabMenu: AddTabMenuInterface;
    Tabs: TabsInterface,
    Repositories: RepositoriesInterface,
    User: UserInterface,
    Settings: SettingsInterface,
    Common: CommonInterface,
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
