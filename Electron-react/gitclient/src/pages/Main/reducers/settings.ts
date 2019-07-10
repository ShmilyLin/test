export interface SettingsStateInterface {

}

const settings = (state: SettingsStateInterface = {}, action: any) => {
    switch (action.type) {
      case 'ADD_TODO':
        break;
      case 'TOGGLE_TODO':
        break;
      default:
        break;
    }

    return state;
};
  
export default settings;