export declare type Comment = {
    id: string;
    url: string;
    replies_count: number;
    reblogs_count: number;
    favourites_count: number;
    content: string;
    account: Account;
    created_at: string;
};
export declare type CommentsResponse = {
    descendants: Comment[];
};
export declare type Account = {
    id: string;
    username: string;
    display_name: string;
    url: string;
    avatar: string;
};
