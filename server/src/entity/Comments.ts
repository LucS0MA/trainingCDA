import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./Users"
import { Post } from "./Posts"

@Entity()
export class Comment {
    @PrimaryGeneratedColumn()
    id: number

    @Column({type: "varchar"})
    content: string

    @CreateDateColumn() 
    createdAt: Date

    @CreateDateColumn() 
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.comment)
    users: User

    @ManyToOne(() => Post, (post) => post.comment)
    posts: Post
}