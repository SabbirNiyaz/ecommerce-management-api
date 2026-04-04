import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('profiles')
export class ProfileEntity {
    @PrimaryGeneratedColumn()
    id?: number;

    @Column({ nullable: true })
    profileImage?: string;

    @Column({ nullable: true })
    bio?: string;

    @Column({ nullable: true })
    address?: string;

    @Column({ nullable: true })
    phone?: string;

    @Column({ default: true })
    isActive?: boolean;

    @OneToOne(() => UserEntity, user => user.profile, { onDelete: 'CASCADE' })
    @JoinColumn()
    user?: UserEntity;
}