import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Param, ParseIntPipe, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './DTOs/signup.dto';
import { SignInDto } from './DTOs/signin.dto';
import { CreateProfileDto } from './DTOs/create-profile.dto';
import { ProfileEntity } from './UserEntity/profile.entity';
import { UpdateProfileDto } from './DTOs/update-profile.dto';
import { JwtGuard } from './jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    //! Sign Up
    @Post('signup')
    async signUp(@Body() body: SignUpDto) {
        const result = await this.authService.signUp(body);
        return {
            success: true,
            message: 'User registered successfully',
            data: result
        }
    }

    //! Sign In
    @Post('signin')
    @HttpCode(HttpStatus.OK)
    async signIn(@Body() body: SignInDto) {
        const result = await this.authService.signIn(body.email, body.password);
        return {
            success: true,
            message: 'Login Successful',
            data: result,
        };
    }

    //! Get User Profile
    @Get('profile')
    @UseGuards(JwtGuard)
    async getUserProfile(@Req() req) {
        const userId = req.user.id;
        return this.authService.getUserProfile(userId);
    }

    //! Create Profile
    @Post('profile')
    async createProfile(@Body() body: CreateProfileDto) {
        return this.authService.createProfile(body);
    }

    //! Update Profile
    @Put('profile/:id')
    async updateProfile(@Param('id', ParseIntPipe) profileId: number,
        @Body() body: UpdateProfileDto) {
        return this.authService.updateProfile(profileId, body);
    }
}
