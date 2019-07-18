import GitHubRouteItem from './GitHubRouteItem';
import GitHubRouteList from '../data/GitHubRouteList';

class GitHubItem {
    public routeList: GitHubRouteItem[];
    // public currentRoute: GitHubRouteItem;

    constructor() {
        console.log('GitHubRouteItem constructor', window.$store.getState());
        if (window.$store.getState().User.loggedin) {
            this.routeList = [];
        } else {
            this.routeList = [new GitHubRouteItem(GitHubRouteList.SignIn)];
        }
    }

    public replace(name: string, options: any|undefined = undefined, canRepeat: boolean = true) {
        let newRouteItem = new GitHubRouteItem(name, options);
        if (this.routeList.length <= 0) {
            this.routeList = [newRouteItem];
        } else {
            if (canRepeat) {
                this.routeList.splice(this.routeList.length - 1, 1, newRouteItem);
            } else {
                let hasIndex = -1;
                for (let i = 0; i < this.routeList.length; i++) {
                    if (this.routeList[i].name === newRouteItem.name) {
                        hasIndex = i;
                        break;
                    }
                }

                if (hasIndex >= 0) {
                    this.routeList.splice(hasIndex, this.routeList.length - hasIndex, newRouteItem);
                } else {
                    this.routeList.splice(this.routeList.length - 1, 1, newRouteItem);
                }
            }
        }
    }

    public relaunch(name: string, options: any|undefined = undefined)  {
        let newRouteItem = new GitHubRouteItem(name, options);
        this.routeList = [newRouteItem];
    }

    public push(name: string, options: any|undefined = undefined, canRepeat: boolean = true) {
        let newRouteItem = new GitHubRouteItem(name, options);
        if (this.routeList.length <= 0) {
            this.routeList = [newRouteItem];
        } else {
            if (canRepeat) {
                this.routeList.push(newRouteItem);
            } else {
                let hasIndex = -1;
                for (let i = 0; i < this.routeList.length; i++) {
                    if (this.routeList[i].name === newRouteItem.name) {
                        hasIndex = i;
                        break;
                    }
                }

                if (hasIndex >= 0) {
                    this.routeList.splice(hasIndex, this.routeList.length - hasIndex, newRouteItem);
                } else {
                    this.routeList.splice(this.routeList.length - 1, 1, newRouteItem);
                }
            }
        }
    }

    public back(delta: number = 1, options: any|undefined = undefined) {
        if (this.routeList.length > delta) {
            this.routeList.splice(this.routeList.length - delta, delta);
        }
    }
}

export default GitHubItem;
