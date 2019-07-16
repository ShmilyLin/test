import RepositoryItem from './RepositoryItem';
import GitHubItem from './GitHubItem';

export enum TabItemType {
    Repository = 0, // 仓库
    GitHub = 1, // GitHub
}

class TabItem {
    public createTime: number; // 创建时间
    public title: string; // 标题
    public desc?: string; // 简介
    public isFixed: boolean = false; // 是否固定
    public isShow: boolean = true; // 是否正在显示
    public lastShowTime: number = 0; // 上次显示时间
    public type: TabItemType; // 类型

    public repository?: RepositoryItem; // 仓库
    public github?: GitHubItem; // GitHub页面

    constructor(type: TabItemType, title: string) {
        this.createTime = (new Date()).getTime();
        this.type = type;
        this.title = title;
        this.lastShowTime = this.createTime;

        if (type === TabItemType.Repository) {

        }else if (type === TabItemType.GitHub) {
            this.github = new GitHubItem();
        }
    }
}

export default TabItem;
