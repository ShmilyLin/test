export interface RepositoryItem {
    title: string;
}

export interface RepositoriesInterface {
    repositoriesList: RepositoryItem[];
};

const RepositoriesState: RepositoriesInterface = {
    repositoriesList: [],
}

export default RepositoriesState;
