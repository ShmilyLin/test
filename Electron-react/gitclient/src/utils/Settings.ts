import { LanguageType } from './Localization';

class SettingsManager {
    public NormalSettings: {
        accountName: string; // 全局用户名
        accountEmail: string; // 全局邮箱
    } = {
        accountName: '',
        accountEmail: '',
    };

    public UISettings: {
        theme: string; // 界面主题
        language: LanguageType; // 语言
    } = {
        theme: '',
        language: LanguageType.CN,
    };

    constructor() {
        
    }
}

export default SettingsManager;
