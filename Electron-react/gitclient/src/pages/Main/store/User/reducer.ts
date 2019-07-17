// import { UserActionsKeys } from './actions';
import { UserInterface } from './state';
import { Reducer } from 'redux';

const User: Reducer = (state: UserInterface, action: any): UserInterface => {
    if (!state) {
        state = {
            github: {
                loggedin: false,
            }
        };
    }

    switch (action.type) {
        // case UserActionsKeys.AddTabItem: 
            
        default:
            return state;
    }
}

export default User;
