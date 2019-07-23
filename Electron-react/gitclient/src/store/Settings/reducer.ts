import { SettingsActionsKeys } from './actions';
import { SettingsInterface } from './state';
import { Reducer } from 'redux';
import FileManager from '../../utils/FileManager';

const Settings: Reducer = (state: SettingsInterface, action: any): SettingsInterface => {
    if (!state) {
        state = {
            BuildNumber: 0,
            common: {
                addTabMenuWidth: 300, // 【私有】添加Tab页面内容宽度
                saveWindowSize: true, // 是否恢复上次退出时窗口的大小
                lastWindowWidth: 1000, // 【私有】上次退出时窗口的宽度
                lastWindowHeight: 700, // 【私有】上次退出时窗口的高度
                windowDefaultWidth: 1000, // 窗口默认宽度
                windowDefaultHeight: 700, // 窗口默认高度
                language: 'cn', // 语言
            },
            git: {
                useGlobalAccount: true, // 是否使用全局用户名
                globalAccount: '', // 全局用户名
                globalEmail: '', // 全局邮箱
            },
            github: {
                history: false,
            },
        };
    }

    switch (action.type) {
        case SettingsActionsKeys.GitHub.HistoryModeChange: 
            let tempGitHubSettings = state.github;
            tempGitHubSettings.history = action.history;
            let saveHistoryModeChangeSettings = {
                ...state,
                github: tempGitHubSettings,
            };

            if (FileManager.saveSettingsSync(saveHistoryModeChangeSettings)) {
                return saveHistoryModeChangeSettings;
            }
            
            return state;
        case SettingsActionsKeys.Common.AddTabMenuWidthChange:
            let tempCommonSettings = state.common;
            tempCommonSettings.addTabMenuWidth = action.width;
            let saveAddTabMenuWidthChangeSettings = {
                ...state,
                common: tempCommonSettings,
            };

            if (FileManager.saveSettingsSync(saveAddTabMenuWidthChangeSettings)) {
                return saveAddTabMenuWidthChangeSettings;
            }
            
            return state;
        default:
            return state;
    }
}

export default Settings;
