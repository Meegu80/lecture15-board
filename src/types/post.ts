import type { Timestamp } from "firebase/firestore";

export type PostType = {
    id: string;
    title: string;
    content: string;
    userId: string;
    username?: string;
    createdAt: Timestamp;
    views: number;
};
