import { Sections } from "./user.type";

export interface UploadeFileMulter {
    [fieldname: string]: {
        filename: string;
        size: number;
        mimetype: string;
        originalname: string;
        fieldname: string;
        encoding: string;
    }[] | undefined
}

export interface UploadeArticleMulter {
    [fieldname: string]: string;
}

export interface AfterParseData {
    text: string;
    title: string;
    section: Sections;
    date: string;
}