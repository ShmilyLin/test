interface GitHubTopicsItemRes {
    created_at?: string; // "2016-11-18T06:26:09Z"
    created_by?: string; // null
    curated?: boolean; // true
    description?: string; // "A help desk is a resource intended to provide the customer or end user with information and support related to a company's or institution's products and services."
    display_name?: string; // "Support"
    featured?: boolean; // true
    name?: string; // "support"
    released?: boolean; // null
    score?: number; // 1
    short_description?: string; // "Get your team and customers the help they need."
    updated_at?: string; // "2019-07-16T17:25:14Z"
}

class GitHubTopicsItem {
    public created_at?: string; // "2016-11-18T06:26:09Z"
    public created_by?: string; // null
    public curated?: boolean; // true
    public description?: string; // "A help desk is a resource intended to provide the customer or end user with information and support related to a company's or institution's products and services."
    public display_name?: string; // "Support"
    public featured?: boolean; // true
    public name?: string; // "support"
    public released?: boolean; // null
    public score?: number; // 1
    public short_description?: string; // "Get your team and customers the help they need."
    public updated_at?: string; // "2019-07-16T17:25:14Z"

    constructor(item: GitHubTopicsItemRes) {
        this.name = item.name;
        this.display_name = item.display_name;
        this.short_description = item.short_description;
    }
}

export default GitHubTopicsItem;
