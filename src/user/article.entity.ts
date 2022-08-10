import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sections } from "src/types/user.type";
import { FotoEntity } from "./foto.entity";

@Entity()
export class ArticleEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    section: Sections;

    @Column()
    title: string;

    @Column()
    text: string;

    @OneToMany(() => FotoEntity, (foto) => foto.article)
    fotos: FotoEntity[];

    @Column()
    date: string;
}