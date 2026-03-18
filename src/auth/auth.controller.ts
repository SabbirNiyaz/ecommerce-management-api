import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './DTOs/signup.dto';
import { SignInDto } from './DTOs/signin.dto';

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
}
