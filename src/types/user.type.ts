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
