import { Entity, Column, PrimaryColumn } from 'typeorm'

@Entity()
export class UserEntity {

    @PrimaryColumn({
        name: 'id'
    })
    key: string;

    @Column()
    title: string;
}