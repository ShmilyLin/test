import FileManager from "../../utils/FileManager";

export interface UserGitHubInfoSelf {
    login?: string; // 名字
    id?: number;
    node_id?: string;
    avatar_url?: string; // 头像
    gravatar_id?: string; // 
    url?: string; // 用户信息地址
    html_url?: string; // 用户首页
    followers_url?: string; // 获取粉丝列表
    following_url?: string; // 
    gists_url?: string; // 
    starred_url?: string; // 
    subscriptions_url?: string; // 
    organizations_url?: string; // 
    repos_url?: string; // 仓库列表
    events_url?: string; // 
    received_events_url?: string; // 
    type?: string; // 用户类型
    site_admin?: boolean; // 是否是网站管理
    name?: string;
    company?: string;
    blog?: string; // 
    location?: string;
    email?: string;
    hireable?: null,
    bio?: null,
    public_repos?: number; // 开源仓库数量
    public_gists?: number; // 0,
    followers?: number; // 粉丝数量
    following?: number; // 关注数量
    created_at?: string; // 账号创建时间
    updated_at?: string; // 最近更新时间
    private_gists?: number; // 0,
    total_private_repos?: number; // 0,
    owned_private_repos?: number; // 0,
    disk_usage?: number; // 容量使用大小
    collaborators?: number; // 0,
    two_factor_authentication?: boolean; // false,
    plan?: {
        name?: string; // 用户消费级别
        space?: number; // 总容量大小
        collaborators?: number; // 0,
        private_repos?: number; // 可用私有仓库数量
    }
}

export interface UserGitHubInfo {
    loggedin: boolean;

    token: string|undefined;

    info: UserGitHubInfoSelf|undefined;
}

export interface UserInterface {
    github: UserGitHubInfo;
};

const UserState: UserInterface = {
    github: {
        loggedin: false,

        token: FileManager.getTokenSync(),

        info: undefined,
    }
}

export default UserState;
