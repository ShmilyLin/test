import { UserActionsKeys } from './actions';
import { UserInterface } from './state';
import { Reducer } from 'redux';

const User: Reducer = (state: UserInterface, action: any): UserInterface => {
    if (!state) {
        state = {
            github: {
                loggedin: false,

                token: undefined,

                info: undefined,
            }
        };
    }

    switch (action.type) {
        case UserActionsKeys.SaveToken: 
            
            return state;
        default:
            return state;
    }
}

export default User;
