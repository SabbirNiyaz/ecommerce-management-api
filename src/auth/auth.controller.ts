import { Controller, Post, Body, HttpCode, HttpStatus, Get, Put, Param, ParseIntPipe, UseGuards, Req, HttpException, Delete } from '@nestjs/common';
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
    //------------------------- Authentication Routes -------------------------//
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

    //------------------------- Profile Routes -------------------------//
    //! Get User Profile
    @Get('profile')
    @UseGuards(JwtGuard)
    async getUserProfile(@Req() req) {
        const userId = req.user.id;
        return this.authService.getUserProfile(userId);
    }

    //! Create Profile
    @Post('profile')
    @UseGuards(JwtGuard)
    async createProfile(@Req() req,
        @Body() body: CreateProfileDto) {
        const userId = req.user.id as number;
        return this.authService.createProfile(userId, body);
    }

    //! Update Profile
    @Put('profile-update')
    @UseGuards(JwtGuard)
    async updateProfile(@Req() req,
        @Body() body: UpdateProfileDto) {
        const userId = req.user.id as number;
        return this.authService.updateProfile(userId, body);
    }

    //------------------------- User Routes -------------------------//
    //! Delete User (Admin Only)
    @Delete('/delete/user/:id')
    @UseGuards(JwtGuard)
    async deleteUser(@Param('id', ParseIntPipe) id: number, @Req() req) {
        if (req.user.role !== 'admin') {
            throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
        }
        return this.authService.deleteUser(id);
    }
}
