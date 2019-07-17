
import AddTabMenuState, { AddTabMenuInterface } from './AddTabMenu/state';
import TabsState, { TabsInterface } from './Tabs/state';
import RepositoriesState, { RepositoriesInterface } from './Repositories/state';
import UserState, { UserInterface } from './User/state';
import SettingsState, { SettingsInterface } from './Settings/state';

export interface GlobalInterface {
    AddTabMenu: AddTabMenuInterface;
    Tabs: TabsInterface,
    Repositories: RepositoriesInterface,
    User: UserInterface,
    Settings: SettingsInterface,
};

const Global: GlobalInterface = {
    AddTabMenu: AddTabMenuState,
    Tabs: TabsState,
    Repositories: RepositoriesState,
    User: UserState,
    Settings: SettingsState
};

export default Global;
