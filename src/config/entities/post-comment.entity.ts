import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entiry";
import { User } from "./user.entity";

@Entity({ name: 'post_comments' })
export class PostComment {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column()
    postId: number

    @Column()
    userId: number

    @Column()
    comment: string

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date

    @ManyToOne(() => Post, (post: Post) => post.comments)
    post: Post

    @ManyToOne(() => User, (user: User) => user.postComments)
    user: User
}
