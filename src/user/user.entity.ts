import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class UserEntity extends BaseEntity {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        length: 50
    })
    login: string;

    @Column()
    hash: string;

    @Column()
    iv: string;

    @Column()
    salt: string;

    @Column({
        nullable: true,
        default: null
    })
    status: string | null;


}