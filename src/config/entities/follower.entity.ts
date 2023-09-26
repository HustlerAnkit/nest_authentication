import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'followers' })
export class Follower {
    @PrimaryGeneratedColumn({ type: 'bigint'})
    id: number;

    @Column()
    followingId: number

    @Column()
    followerId: number

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @ManyToOne(() => User, (user) => user.followers)
    follower: User

    @ManyToOne(() => User, (user) => user.following)
    following: User
}