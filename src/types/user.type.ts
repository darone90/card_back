import { ArticleEntity } from "src/user/article.entity";

export interface Code {
    coded: string;
    iv: string
}

export enum Sections {
    programming = 'programming',
    automation = 'automation',
    welding = 'welding',
    glass = 'glass'
}

export interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export interface StandardResponse {
    actionStatus: boolean;
    message: string | ArticleEntity | ArticleEntity[];
}
