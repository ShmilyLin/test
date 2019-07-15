export const AddTabMenuActionsKeys = {
    ShowAddTabMenu: 'AddTabMenu',
    HideAddTabMenu: 'HideAddTabMenu',
}

const AddTabMenuActions = {
    ShowAddTabMenu: () => ({
        type: AddTabMenuActionsKeys.ShowAddTabMenu,
    }),
    HideAddTabMenu: () => ({
        type: AddTabMenuActionsKeys.HideAddTabMenu,
    })
}

export default AddTabMenuActions;
