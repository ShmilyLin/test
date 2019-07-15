
import AddTabMenuState, { AddTabMenuInterface } from './AddTabMenu/state';
import TabsState, { TabsInterface } from './Tabs/state';
import RepositoriesState, { RepositoriesInterface } from './Repositories/state';

export interface GlobalInterface {
    AddTabMenu: AddTabMenuInterface;
    Tabs: TabsInterface,
    Repositories: RepositoriesInterface,
};

const Global: GlobalInterface = {
    AddTabMenu: AddTabMenuState,
    Tabs: TabsState,
    Repositories: RepositoriesState,
};

export default Global;
