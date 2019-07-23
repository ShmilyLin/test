import FileManager from '../../utils/FileManager';

export interface SettingsInterface {
    BuildNumber: number;
    common: {
        addTabMenuWidth: number; // 【私有】添加Tab页面内容宽度
        saveWindowSize: boolean; // 是否恢复上次退出时窗口的大小
        lastWindowWidth: number; // 【私有】上次退出时窗口的宽度
        lastWindowHeight: number; // 【私有】上次退出时窗口的高度
        windowDefaultWidth: number; // 窗口默认宽度
        windowDefaultHeight: number; // 窗口默认高度
        language: string; // 语言
    };
    git: {
        useGlobalAccount: boolean; // 是否使用全局用户名
        globalAccount: string; // 全局用户名
        globalEmail: string; // 全局邮箱
    };
    github: {
        history: boolean; // GitHub页面是否使用历史模式
    };
};

let tempSettings = FileManager.checkSettingsFile();

console.log('------ settings', tempSettings);

const SettingsState: SettingsInterface = tempSettings;

export default SettingsState;
