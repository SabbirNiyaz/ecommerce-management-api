import { IsEmail, IsString, IsOptional, MinLength, IsIn } from 'class-validator';

export class SignUpDto {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsOptional()
    @IsString()
    @IsIn(['seller', 'admin'], {
        message: 'Status must be either seller or admin',
    })
    role?: string;
}