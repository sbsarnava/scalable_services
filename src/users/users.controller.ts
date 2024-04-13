import { Controller, Post, Body, UseInterceptors, ClassSerializerInterceptor, Get, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/guards/auth/auth.guard';
import { IsstaffGuard } from 'src/guards/isstaff/isstaff.guard';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('login')
    async login(@Body() loginUserDto: LoginUserDto) {
        return await this.usersService.login(loginUserDto);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDto) {
        return await this.usersService.create(createUserDto);
    }

    @Post('logout')
    logout() {}

    @Get('who-am-i')
    @UseGuards(AuthGuard)
    whoAmI(@Request() request: any) {
        return request.user;
    }

    @Get('am-i-staff')
    @UseGuards(IsstaffGuard)
    amIStaff(@Request() request: any) {
        return request.user;
    }
}
