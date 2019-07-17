export interface UserGitHubInfo {
    loggedin: boolean;
}

export interface UserInterface {
    github: UserGitHubInfo;
};

const UserState: UserInterface = {
    github: {
        loggedin: false,
    }
}

export default UserState;
