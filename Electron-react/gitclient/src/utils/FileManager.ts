import { SettingsInterface } from "../store/Settings/state";
import _ from 'lodash';

const fs = window.require('fs');

class FileManagerControl {
    public defaultSettings: SettingsInterface = {
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
    // constructor() {

    // }

    // 【同步】从文件读取设置
    public checkSettingsFile() {
        if (this.checkConfigDirectorySync()) {
            try {
                let settingsData = fs.readFileSync('./data/config/settings', 'utf8');
                console.log('【File Manager】 读取文件夹成功', settingsData);
                try {
                    let settings = JSON.parse(settingsData);
                    console.log('【File Manager】 解析配置成功');
                    return _.merge(this.defaultSettings, settings); // this.merageSettings(settings);
                } catch (jsonError) {
                    console.log('【File Manager】 解析配置失败', jsonError);
                    return this.defaultSettings;
                }
            } catch (readError) {
                console.log('【File Manager】 读取文件夹失败', readError);
                try {
                    try {
                        fs.accessSync('./data/config/settings', fs.constants.F_OK)
                        fs.unlinkSync('./data/config/settings');
                        console.log('【File Manager】 删除文件成功');
                    } catch (accessError) {
                        console.log('【File Manager】 删除文件失败', accessError);
                    }
                    
                    fs.writeFileSync('./data/config/settings', JSON.stringify(this.defaultSettings), 'utf8');
                    console.log('【File Manager】 写入文件成功');
                } catch (writeError) {
                    console.log('【File Manager】 写入文件失败', writeError);
                }

                return this.defaultSettings;
            }
        }
    }

    // 【同步】保存设置
    public saveSettingsSync(settings: SettingsInterface) {
        if (this.checkConfigDirectorySync()) {
            try {
                fs.writeFileSync('./data/config/settings', JSON.stringify(settings), 'utf8');
                console.log('【File Manager】 写入文件成功');
                return true;
            } catch (writeError) {
                console.log('【File Manager】 写入文件失败', writeError);
            }
        }

        return false;
    }

    // 【同步】获取Token
    public getTokenSync(): string|undefined {
        if (this.checkConfigDirectorySync()) {
            try {
                let tokenData = fs.readFileSync('./data/config/info', 'utf8');
                console.log('【File Manager】 读取文件成功', tokenData);
                return window.atob(tokenData).split('').reverse().join('');
            } catch (readError) {
                console.log('【File Manager】 读取文件失败', readError);
            }
        }

        return undefined;
    }

    // 【同步】保存Token
    public saveTokenSync(token: string) {
        if (this.checkConfigDirectorySync()) {
            try {
                let tempToken = token.split('').reverse().join('');
                fs.writeFileSync('./data/config/info', window.btoa(tempToken), 'utf8');
                console.log('【File Manager】 写入文件成功');
                return true;
            } catch (writeError) {
                console.log('【File Manager】 写入文件失败', writeError);
            }
        }

        return false;
    }

    // 【异步】检查配置文件夹是否存在
    public checkConfigDirectory(callback: (success: boolean) => void) {
        fs.stat('./data/config', fs.constants.F_OK, (accessError: any, dStats: any) => {
            if (accessError) {
                fs.mkdir('./data/config',{
                    recursive: true
                }, (mkdirError: any) => {
                    if (!mkdirError) {
                        callback(true);
                    }else {
                        callback(false);
                    }
                });
            } else {
                if (dStats.isFile()) {
                    fs.mkdir('./data/config',{
                        recursive: true
                    }, (mkdirError: any) => {
                        if (!mkdirError) {
                            callback(true);
                        }else {
                            callback(false);
                        }
                    });
                } else {
                    callback(true);
                }
            }
        });
    }

    // 【同步】检查配置文件夹是否存在
    public checkConfigDirectorySync() {
        try {
            let dStats = fs.statSync('./data/config', fs.constants.F_OK);
            console.log('【File Manager】 查询文件夹信息成功');
            if (dStats.isFile()) {
                console.log('【File Manager】 是文件');
                try {
                    fs.mkdirSync('./data/config',{
                        recursive: true
                    });
                    console.log('【File Manager】 创建文件夹成功');
                    return true;
                } catch (mkdirError) {
                    console.log('【File Manager】 创建文件夹失败', mkdirError);
                    return false;
                }
            } else {
                console.log('【File Manager】 是文件夹');
                return true;
            }
        } catch (accessError) {
            console.log('【File Manager】 查询文件夹信息失败', accessError);
            try {
                fs.mkdirSync('./data/config',{
                    recursive: true
                });
                console.log('【File Manager】 创建文件夹成功');
                return true;
            } catch (mkdirError) {
                console.log('【File Manager】 创建文件夹失败', mkdirError);
                return false;
            }
        }
    }
}
const FileManager = new FileManagerControl();

export default FileManager;
