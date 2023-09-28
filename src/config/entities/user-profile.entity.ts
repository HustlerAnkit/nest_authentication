import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({ name: 'user_profiles' })
export class UserProfile {
    @PrimaryGeneratedColumn({ type: 'bigint' })
    id: number

    @Column()
    address: string
    
    @Column()
    city: string

    @Column({ nullable: true })
    state?: string

    @Column()
    country: string

    @Column({ nullable: true })
    profileSource?: string

    @Column({ nullable: true })
    coverSource?: string

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date

    @OneToOne(() => User)
    @JoinColumn()
    user: User
}