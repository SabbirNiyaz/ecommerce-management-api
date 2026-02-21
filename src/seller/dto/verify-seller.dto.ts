import { IsNotEmpty, Matches, MinLength } from 'class-validator';

export class VerifySellerDto {

    // Name must not contain special characters
    @IsNotEmpty()
    @Matches(/^[A-Za-z0-9 ]+$/, {
        message: 'Name must not contain special characters',
    })
    name: string;

    // Password: minimum 6 characters & at least one lowercase letter
    @IsNotEmpty()
    @MinLength(6, {
        message: 'Password must be at least 6 characters long',
    })
    @Matches(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter',
    })
    password: string;

    // Phone must start with 01
    @IsNotEmpty()
    @Matches(/^01[0-9]{9}$/, {
        message: 'Phone number must start with 01 and be valid',
    })
    phone: string;
}