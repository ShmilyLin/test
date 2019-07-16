import TabItem from '../../models/TabItem';

export const TabsActionsKeys = {
    AddTabItem: 'AddTabItem',
    ChangeCurrentIndex: 'ChangeCurrentIndex',
    DeleteTabItem: 'DeleteTabItem',
}

const TabsActions = {
    AddTabItem: (item: TabItem) => ({
        type: TabsActionsKeys.AddTabItem,
        item,
    }),
    ChangeCurrentIndex: (index: number) => ({
        type: TabsActionsKeys.ChangeCurrentIndex,
        index,
    }),
    DeleteTabItem: (index: number) => ({
        type: TabsActionsKeys.DeleteTabItem,
        index,
    })
}

export default TabsActions;
