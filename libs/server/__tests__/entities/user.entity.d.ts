export declare class User {
    id: number;
    key: string;
    title: string;
    posts: Post[];
}
export declare class Post {
    id: number;
    key: string;
    title: string;
    user: User;
}
