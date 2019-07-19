import FileManager from '../../utils/FileManager';

export interface SettingsInterface {
    common: {

    };
    github: {
        history: boolean;
    };
};

let tempSettings = FileManager.checkSettingsFile();

console.log('------ settings', tempSettings);

const SettingsState: SettingsInterface = tempSettings;

export default SettingsState;
