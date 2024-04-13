import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { IsstaffGuard } from 'src/guards/isstaff/isstaff.guard';
import { AuthGuard } from 'src/guards/auth/auth.guard';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    controllers: [UsersController],
    providers: [UsersService, IsstaffGuard, AuthGuard],
    exports: [UsersService]
})
export class UsersModule {}
