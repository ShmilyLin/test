class GitHubRouteItem {
    public createTime: number;
    public name: string;

    public sourceOptions: any|undefined;

    constructor(name: string, options: any|undefined = undefined) {
        this.createTime = (new Date()).getTime();
        this.name = name;
        this.sourceOptions = options;
    }
}

export default GitHubRouteItem;
