import { ArticleEntity } from "src/user/article.entity";

interface ArticleResponse {
    section: Sections;
    title: string;
    text: string;
    fotos: string[];
    date: string;
}

export interface Code {
    coded: string;
    iv: string
}

export enum Sections {
    'programming',
    'automation',
    'welding',
    'glass'
}

export interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

export interface StandardResponse {
    actionStatus: boolean;
    message: string | ArticleResponse;
}
