import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Follower } from './follower.entity';
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

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    // @OneToMany(type => Follower, follower => follower.user_id)
    // followers: Follower[]

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
}