import { RepositoryItem } from '../Repositories/state';

export interface TabsInterface {
    fixedList: RepositoryItem[];
    openList: RepositoryItem[];
};

const TabsState: TabsInterface = {
    fixedList: [],
    openList: [],
}

export default TabsState;
