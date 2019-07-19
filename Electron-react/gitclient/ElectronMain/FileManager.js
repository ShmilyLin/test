const fs = require('fs');

class FileManagerControl {
    constructor() {

    }

    checkSettingsFile() {
        fs.stat('./data/config', fs.constants.F_OK, (accessError, dStats) => {
            if (accessError) {
                fs.mkdir('./data/config',{
                    recursive: true
                }, (mkdirError) => {
                    if (!mkdirError) {

                    }
                });
            } else {
                if (dStats.isFile()) {
                    fs.mkdir('./data/config',{
                        recursive: true
                    }, (mkdirError) => {
                        if (!mkdirError) {
    
                        }
                    });
                } else {

                }
            }
        })
    }
}

let FileManager = new FileManagerControl();

module.exports = FileManager;
