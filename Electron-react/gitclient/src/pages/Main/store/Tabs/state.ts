import { RepositoryItem } from '../Repositories/state';
import TabItem from '../../models/TabItem';

export interface TabsInterface {
    fixedList: TabItem[];
    openList: TabItem[];

    currentShowIndex: number;
};

const TabsState: TabsInterface = {
    fixedList: [],
    openList: [],

    currentShowIndex: -1,
}

export default TabsState;
