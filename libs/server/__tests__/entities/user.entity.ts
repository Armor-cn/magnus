import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm'

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

    @OneToMany(() => Post, post => post.user)
    posts: Post[];
}

@Entity({
    name: 'post'
})
export class Post {

    @PrimaryGeneratedColumn()
    id: number;

    @PrimaryColumn()
    key: string;

    @Column()
    title: string;

    @ManyToOne(() => User, user => user.posts)
    @JoinColumn()
    user: User;
}