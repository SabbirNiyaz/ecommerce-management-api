import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { ProfileEntity } from './profile.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ default: 'seller' })
  role?: string;

  @OneToOne(() => ProfileEntity, profile => profile.user)
  profile?: ProfileEntity;
}