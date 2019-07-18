

export interface CommonInterface {
    loading: {
        show: boolean;
        text: string|undefined;
    };

    modal: {
        show: boolean;
        title: string;
        content: string|undefined;
        showCancel: boolean;
        cancelText: string;
        confirmText: string;
        success: ((res: {
            confirm: boolean;
            cancel: boolean;
        }) => void)|undefined;
    }
};

const CommonState: CommonInterface = {
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
}

export default CommonState;
