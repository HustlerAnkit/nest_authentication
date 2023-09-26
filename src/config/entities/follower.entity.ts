import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'followers' })
export class Follower {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    followingId: number

    @Column()
    followerId: number

    @CreateDateColumn({ type: "timestamp"})
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp"})
    updatedAt: Date

    @ManyToOne(() => User, (user: User) => user.followers)
    follower: User

    @ManyToOne(() => User, (user: User) => user.following)
    following: User
}