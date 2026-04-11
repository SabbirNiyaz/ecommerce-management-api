// auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './UserEntity/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ProfileEntity } from './UserEntity/profile.entity';
import { MailerService } from '@nestjs-modules/mailer';
import { getWelcomeEmail, Role } from './mail/email-templates';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,

        @InjectRepository(ProfileEntity)
        private readonly profileRepository: Repository<ProfileEntity>,

        private readonly jwtService: JwtService,

        private readonly mailerService: MailerService,
    ) { }
    //------------------------- Authentication Routes -------------------------//
    //! Sign Up
    async signUp(payload: Partial<UserEntity>) {
        try {
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

            // Send Welcome Email
            const template = getWelcomeEmail(saved.name, saved.role as Role);
            if (!template) throw new BadRequestException(`No email template for role: ${saved.role}`);

            await this.mailerService.sendMail({ to: saved.email, ...template });

            // Exclude password from response
            const { password: _, ...result } = saved;
            return result;

        } catch (error: any | string) {
            throw new HttpException(`Error: ${error.message}`, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //! Sign In
    async signIn(email: string, password: string) {
        try {
            const user = await this.userRepository.findOne({ where: { email } });

            if (!user || !user.password) {
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

        } catch (error: any | string) {
            throw new HttpException(`Error: ${error.message}`, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //------------------------- Profile Routes -------------------------//
    //! Get User Profile
    async getUserProfile(userId: number): Promise<ProfileEntity> {
        try {
            const user = await this.profileRepository.findOne({
                where: { id: userId },
                relations: ['user'],
                select: {
                    id: true,
                    profileImage: true,
                    bio: true,
                    address: true,
                    phone: true,
                    isActive: true,
                    user: {
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            });

            if (!user) {
                throw new HttpException('User not found', HttpStatus.NOT_FOUND);
            }
            return user;

        } catch (error: any | string) {
            throw new HttpException(`Error: ${error.message}`, error.status ? error.status : HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    //! Create Profile
    async createProfile(payload: Partial<ProfileEntity>) {
        const { profileImage, bio, address, phone, isActive, userId } = payload as any;

        const user = await this.userRepository.findOne({
            where: {
                id: userId
            },
            relations: ['profile']
        });

        // Verify Existing
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        if (user.profile) {
            throw new HttpException('User already has a profile', HttpStatus.BAD_REQUEST);
        }

        // Create and save profile in DB 
        const userProfile = this.profileRepository.create({
            profileImage: profileImage,
            bio: bio,
            address: address,
            phone: phone,
            isActive: isActive,
            user: user
        });
        const result = await this.profileRepository.save(userProfile);
        // remove password
        const { password: _, profile: __, ...userWithoutPassword } = result.user || {};

        return {
            success: true,
            data: {
                ...result,
                user: userWithoutPassword,
            },
        }
    }

    //! Update Profile
    async updateProfile(userId: number, payload: Partial<ProfileEntity>) {
        const { profileImage, bio, address, phone, isActive } = payload as any;
        // Find profile
        const profile = await this.profileRepository.findOne({
            where: { id: userId },
            relations: ['user'],
        });

        // Verify Existing
        if (!profile) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        // Check if any changes were made
        if (profileImage === profile.profileImage &&
            bio === profile.bio &&
            address === profile.address &&
            phone === profile.phone &&
            isActive === profile.isActive) {
            throw new HttpException('No changes detected', HttpStatus.BAD_REQUEST);
        }

        // Update fields
        if (profileImage !== undefined) profile.profileImage = profileImage;
        if (bio !== undefined) profile.bio = bio;
        if (address !== undefined) profile.address = address;
        if (phone !== undefined) profile.phone = phone;
        if (isActive !== undefined) profile.isActive = isActive;

        // Save updated profile
        const result = await this.profileRepository.save(profile);
        // remove password
        const { password: _, ...userWithoutPassword } = result.user || {};

        return {
            success: true,
            data: {
                ...result,
                user: userWithoutPassword,
            },
        }
    }

    //------------------------- User Routes -------------------------//
    //! Delete User (Admin Only)
    async deleteUser(id: number,) {
        const user = await this.userRepository.findOne({ where: { id } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
        await this.userRepository.remove(user);
        return {
            success: true,
            message: `User Id:${id} deleted successfully`,
        };

    }
}