// import { TabsActionsKeys } from './actions';
import { RepositoriesInterface } from './state';
import { Reducer } from 'redux';

const Repositories: Reducer = (state: RepositoriesInterface, action: any): RepositoriesInterface => {
    if (!state) {
        state = {
            repositoriesList: [],
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

export default Repositories;
