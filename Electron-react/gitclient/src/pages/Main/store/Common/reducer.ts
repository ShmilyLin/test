import { CommonActionsKeys } from './actions';
import { CommonInterface } from './state';
import { Reducer } from 'redux';

const Common: Reducer = (state: CommonInterface, action: any): CommonInterface => {
    if (!state) {
        state = {
            loading: {
                show: false,
                text: undefined,
            },
        
            modal: {
                show: false,
                title: '',
                content: undefined,
                showCancel: false,
                cancelText: '取消',
                confirmText: '确定',
                success: undefined,
            },
        };
    }

    switch (action.type) {
        case CommonActionsKeys.ShowLoading: 
            return {
                ...state,
                loading: {
                    show: true,
                    text: action.text,
                },
            };
        case CommonActionsKeys.HideLoading:
            return {
                ...state,
                loading: {
                    show: false,
                    text: undefined,
                },
            };
        case CommonActionsKeys.ShowModal:
            return {
                ...state,
                modal: {
                    ...action.modal,
                    show: true,
                },
            };
        case CommonActionsKeys.HideModal:
            return {
                ...state,
                modal: {
                    show: false,
                    title: '',
                    content: undefined,
                    showCancel: false,
                    cancelText: '取消',
                    confirmText: '确定',
                    success: undefined,
                }
            };
        default:
            return state;
    }
}

export default Common;
