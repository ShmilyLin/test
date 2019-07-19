import { Subject, Subscription } from 'rxjs';

export const ListenerKeys = {
    DocumentClick: 'DocumentClick',
    ShowAddTabMenu: 'ShowAddTabMenu',
    AddATab: 'AddATab',
}

class ListenerManager {
    protected list: {
        [key: string]: Subject<any>;
    } = {};

    // constructor() {

    // }

    public on(key: string, callback: (value: any) => void): Subscription {
        if (!this.list[key]) {
            this.list[key] = new Subject();
        }

        return this.list[key].subscribe(callback);
    }

    public done(key: string, params?: any) {
        if (key in this.list && this.list[key]) {
            this.list[key].next(params);
        }
    }
}

const Listener = new ListenerManager();

export default Listener;
