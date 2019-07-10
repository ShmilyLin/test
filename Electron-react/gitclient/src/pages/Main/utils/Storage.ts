export interface repositoryItem {
    title: string;
}

export class StorageManager {
    public openList: repositoryItem[] = [];

    // constructor() {
    //     // TODO: 
    // }
}

const storage = new StorageManager();

export default storage;
