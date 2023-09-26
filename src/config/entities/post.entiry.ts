import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";
import { PostComment } from "./post-comment.entity";
import { PostLike } from "./post-like.entity";
import { PostReport } from "./post-report.entity";

export enum STATUS {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}

@Entity({ name: 'posts' })
export class Post {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column()
    userId: number

    @Column()
    title: string

    @Column({ nullable: true, type: "longtext" })
    description?: string

    @Column({ type: "enum", enum: STATUS, default: STATUS.ACTIVE })
    status?: STATUS

    @CreateDateColumn({ type: "timestamp"})
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp"})
    updatedAt: Date

    @ManyToOne(() => User, (users) => users.posts)
    user: User

    @OneToMany(() => PostComment, (comment: PostComment) => comment.post, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    comments: PostComment[]

    @OneToMany(() => PostLike, (like: PostLike) => like.post, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    likes: PostLike[]

    @OneToMany(() => PostReport, (report: PostReport) => report.post, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    reports: PostLike[]


}