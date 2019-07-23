export const UserActionsKeys = {
    SaveToken: 'SaveToken',
}

const UserActions = {
    SaveToken: (token: string) => ({
        type: UserActionsKeys.SaveToken,
        token,
    }),
}

export default UserActions;
