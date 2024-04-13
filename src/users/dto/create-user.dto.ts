import { IsString, IsEmail, IsOptional, IsEnum } from 'class-validator';
import { USER_ROLE } from 'src/models/user-jwt.model';

export class CreateUserDto {
    @IsString()
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    password: string;
    @IsOptional()
    @IsEnum(USER_ROLE)
    role: USER_ROLE;
}
