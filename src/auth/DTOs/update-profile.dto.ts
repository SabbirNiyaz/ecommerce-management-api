import { Type } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, Matches } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString({ message: 'Profile image must be a string (URL or path)' })
    profileImage?: string;

    @IsOptional()
    @IsString({ message: 'Bio must be a string' })
    bio?: string;

    @IsOptional()
    @IsString({ message: 'Address must be a string' })
    address?: string;

    @IsOptional()
    @IsString()
    @Matches(/^01[0-9]{9}$/, {
        message: 'Phone number must start with 01 and be 11 digits',
    })
    phone?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive must be true or false' })
    @Type(() => Boolean)
    isActive?: boolean;
}