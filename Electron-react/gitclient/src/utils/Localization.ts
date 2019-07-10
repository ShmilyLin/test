import { 
    remote,
} from 'electron';

const { app } = remote;




class Localization {
    protected currentLanguage: LanguageType;

    constructor() {
        
        let tempSystempLanguage = app.getLocale();
        console.log(tempSystempLanguage);
        if (['en', 'en-AU', 'en-US', 'en-NZ', 'en-GB', 'en-CA', 'en-ZA'].indexOf(tempSystempLanguage)) {
            this.currentLanguage = LanguageType.EN;
        }else {
            this.currentLanguage = LanguageType.CN;
        }
    }

    public text(tag: string) {

    }
}

export default Localization;

export enum LanguageType {
    CN,
    EN,
};
