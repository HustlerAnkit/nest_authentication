import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { Follower } from './follower.entity';
import { Post } from './post.entiry';
import { PostComment } from './post-comment.entity';
import { PostLike } from './post-like.entity';
import { PostReport } from './post-report.entity';
import { UserProfile } from './user-profile.entity';
@Entity({ name: 'users' })
export class User{
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column({ unique: true })
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    password: string;

    @Column({ nullable: true })
    refreshToken?: string;

    @Column({ type: 'timestamp', nullable: true })
    emailVerifiedAt?: Date;

    @CreateDateColumn({ type: "timestamp"})
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp"})
    updatedAt: Date

    // @OneToMany(type => Follower, follower => follower.user_id)
    // followers: Follower[]

    @OneToOne(() => UserProfile)
    @JoinColumn()
    profile: UserProfile

    @OneToMany(() => Follower, (followers: Follower) => followers.following, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    followers: Follower[]

    @OneToMany(() => Follower, (followers: Follower) => followers.follower, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    following: Follower[]

    @OneToMany(() => Post, (posts: Post) => posts.user, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    posts: Post[]

    @OneToMany(() => PostComment, (postComments: PostComment) => postComments.user, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    postComments: PostComment[]

    @OneToMany(() => PostLike, (PostLikes: PostLike) => PostLikes.user, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    PostLikes: PostLike[]

    @OneToMany(() => PostReport, (PostReports: PostReport) => PostReports.user, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
    })
    PostReports: PostReport[]
}