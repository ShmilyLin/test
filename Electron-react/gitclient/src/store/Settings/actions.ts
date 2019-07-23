

export const SettingsActionsKeys = {
    Common: {
        AddTabMenuWidthChange: 'Common_AddTabMenuWidthChange',
    },
    GitHub: {
        HistoryModeChange: 'GitHub_HistoryModeChange',
    }
}

const SettingsActions = {
    HistoryModeChange: (history: boolean) => ({
        type: SettingsActionsKeys.GitHub.HistoryModeChange,
        history,
    }),
    AddTabMenuWidthChange: (width: number) => ({
        type: SettingsActionsKeys.Common.AddTabMenuWidthChange,
        width,
    }),
}

export default SettingsActions;
