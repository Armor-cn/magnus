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

    @Column({
        type: 'varchar',
        transformer: {
            from: (str: string) => {
                return JSON.parse(str)
            },
            to: (str: string[]) => {
                return JSON.stringify(str)
            }
        }
    })
    item: string[];
}