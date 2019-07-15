// import { TabsActionsKeys } from './actions';
import { TabsInterface } from './state';
import { Reducer } from 'redux';

const Tabs: Reducer = (state: TabsInterface, action: any): TabsInterface => {
    if (!state) {
        state = {
            fixedList: [],
            openList: [],
        };
    }

    switch (action.type) {
        // case AddTabMenuActionsKeys.ShowAddTabMenu: 
        //     return {
        //         ...state,
        //         isShow: true,
        //     };
        // case AddTabMenuActionsKeys.HideAddTabMenu:
        //     return {
        //         ...state,
        //         isShow: false,
        //     };
        default:
            return state;
    }
}

export default Tabs;
