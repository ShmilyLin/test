import { TabsActionsKeys } from './actions';
import { TabsInterface } from './state';
import { Reducer } from 'redux';

const Tabs: Reducer = (state: TabsInterface, action: any): TabsInterface => {
    if (!state) {
        state = {
            fixedList: [],
            openList: [],

            currentShowIndex: -1,
        };
    }

    switch (action.type) {
        case TabsActionsKeys.AddTabItem: 
            let tempFixedList = state.fixedList;
            let tempOpenList = state.openList;
            if (state.currentShowIndex >= 0 && state.currentShowIndex < tempFixedList.length) {
                tempFixedList[state.currentShowIndex].isShow = false;
            }

            let tempCurrentShowIndex = state.currentShowIndex - tempFixedList.length;
            if (tempCurrentShowIndex < 0) {
                tempOpenList.push(action.item);
                tempCurrentShowIndex = 0;
            } else {
                tempOpenList.splice(tempCurrentShowIndex, 0, action.item);
                tempCurrentShowIndex++;
            }

            return {
                ...state,
                fixedList: tempFixedList,
                openList: tempOpenList,
                currentShowIndex: tempCurrentShowIndex + tempFixedList.length,
            };
        case TabsActionsKeys.ChangeCurrentIndex:
            if (action.index < state.openList.length + state.fixedList.length && action.index !== state.currentShowIndex) {
                let tempFixedList = state.fixedList;
                let tempOpenList = state.openList;
                if (state.currentShowIndex < tempFixedList.length) {
                    tempFixedList[state.currentShowIndex].isShow = false;
                } else {
                    tempOpenList[state.currentShowIndex - tempFixedList.length].isShow = false;
                }

                if (action.index < state.fixedList.length) {
                    tempFixedList[action.index].isShow = true;
                } else {
                    tempOpenList[action.index - tempFixedList.length].isShow = true;
                }

                return {
                    ...state,
                    fixedList: tempFixedList,
                    openList: tempOpenList,
                    currentShowIndex: action.index,
                }
            }else {
                return state;
            }
        case TabsActionsKeys.DeleteTabItem:
            if (action.index >= 0 && action.index < state.openList.length + state.fixedList.length) {
                let tempFixedList = state.fixedList;
                let tempOpenList = state.openList;
                let tempCurrentIndex = state.currentShowIndex;

                if (action.index < tempFixedList.length) {
                    tempFixedList.splice(action.index, 1);
                } else {
                    tempOpenList.splice(action.index - tempFixedList.length, 1);
                }

                if (tempCurrentIndex >= tempOpenList.length + tempFixedList.length) {
                    tempCurrentIndex = tempOpenList.length + tempFixedList.length - 1;
                }

                return {
                    ...state,
                    fixedList: tempFixedList,
                    openList: tempOpenList,
                    currentShowIndex: tempCurrentIndex,
                }
            }

            return state;
        default:
            return state;
    }
}

export default Tabs;
