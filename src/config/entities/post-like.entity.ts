import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Post } from "./post.entiry";
import { User } from "./user.entity";

@Entity({ name: 'post_likes' })
export class PostLike {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column()
    postId: number

    @Column()
    userId: number

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date

    @ManyToOne(() => Post, (post: Post) => post.likes)
    post: Post

    @ManyToOne(() => User, (user: User) => user.PostLikes)
    user: User
}

