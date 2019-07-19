const fs = window.require('fs');

class FileManagerControl {
    public defaultSettings = {
        common: {

        },
        github: {
            history: false,
        }
    };
    // constructor() {

    // }

    public checkSettingsFile() {
        if (this.checkConfigDirectorySync()) {
            try {
                let settingsData = fs.readFileSync('./data/config/settings', 'utf8');
                console.log('【File Manager】 读取文件夹成功', settingsData);
                try {
                    let settings = JSON.parse(settingsData);
                    console.log('【File Manager】 解析配置成功');
                    return {
                        ...this.defaultSettings,
                        ...settings,
                    };
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
