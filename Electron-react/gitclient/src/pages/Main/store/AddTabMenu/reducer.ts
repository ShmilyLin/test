import { AddTabMenuActionsKeys } from './actions';
import { AddTabMenuInterface } from './state';
import { Reducer } from 'redux';

const AddTabMenu: Reducer = (state: AddTabMenuInterface, action: any): AddTabMenuInterface => {
    if (!state) {
        state = {
            isShow: false,
        };
    }

    switch (action.type) {
        case AddTabMenuActionsKeys.ShowAddTabMenu: 
            return {
                ...state,
                isShow: true,
            };
        case AddTabMenuActionsKeys.HideAddTabMenu:
            return {
                ...state,
                isShow: false,
            };
        default:
            return state;
    }
}

export default AddTabMenu;
