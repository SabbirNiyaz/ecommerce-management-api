// auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService,
    ) { }

    //! Sign Up
    async signUp(payload: Partial<UserEntity>) {
        const { name, email, password, role } = payload;

        // Check if user already exists
        const existing = await this.userRepository.findOne({ where: { email } });
        if (existing) {
            throw new BadRequestException('Email already in exist');
        }

        // Generate salt and hash
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(password as string, salt)

        const user = this.userRepository.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        const saved = await this.userRepository.save(user);

        // Exclude password from response
        const { password: _, ...result } = saved;
        return result;
    }

    //! Sign In
    async signIn(email: string, password: string) {
        const user = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const isMatchPass = await bcrypt.compare(password, user.password);
        if (!isMatchPass) {
            throw new UnauthorizedException('Invalid email or password');
        }

        const token = this.jwtService.sign({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        });

        const { password: _, ...userWithoutPassword } = user;
        return { token, user: userWithoutPassword };
    }
}