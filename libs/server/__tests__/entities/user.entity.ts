import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm'

@Entity({
    name: 'user'
})
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    key: string;

    @Column()
    title: string;
}