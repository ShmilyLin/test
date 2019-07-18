

export const CommonActionsKeys = {
    ShowLoading: 'ShowLoading',
    HideLoading: 'HideLoading',
    ShowModal: 'ShowModal',
    HideModal: 'HideModal',
}

const CommonActions = {
    ShowLoading: (text: string|undefined) => ({
        type: CommonActionsKeys.ShowLoading,
        text,
    }),
    HideLoading: () => ({
        type: CommonActionsKeys.HideLoading,
    }),
    ShowModal: (modal: {
        title: string;
        content?: string|undefined;
        showCancel?: boolean;
        cancelText?: string;
        confirmText?: string;
        success?: ((res: {
            confirm: boolean;
            cancel: boolean;
        }) => void)|undefined;
    }) => ({
        type: CommonActionsKeys.ShowModal,
        modal: {
            title: modal.title,
            content: modal.content ? modal.content : undefined,
            showCancel: modal.showCancel ? modal.showCancel : false,
            cancelText: modal.cancelText ? modal.cancelText : '取消',
            confirmText: modal.confirmText ? modal.confirmText: '确定',
            success: modal.success ? modal.success : undefined,
        },
    }),
    HideModal: () => ({
        type: CommonActionsKeys.HideModal,
    })
}

export default CommonActions;
