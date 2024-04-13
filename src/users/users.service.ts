import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
    constructor(private jwtService: JwtService, @InjectRepository(User) private userRepo: Repository<User>) {}

    findOne(id: number): Promise<User> | null {
        return this.userRepo.findOne({ where: { id } });
    }

    findByEmail(email: string): Promise<User> | null {
        return this.userRepo.findOne({ where: { email }, select: { email: true, id: true, name: true, password: true, role: true } });
    }

    async login(loginUserDto: LoginUserDto) {
        if (!loginUserDto) {
            throw new BadRequestException('Please enter email and password');
        }
        const user = await this.findByEmail(loginUserDto.email);
        if (!user) {
            throw new UnauthorizedException('Either user not found or wrong password');
        }
        return bcrypt.compare(loginUserDto.password, user.password).then(async (isValid) => {
            if (!isValid) {
                throw new UnauthorizedException('Either user not found or wrong password');
            }
            return {
                token: await this.jwtService.signAsync({ userId: user.id, email: user.email, role: user.role }),
            };
        });
    }

    async create(createUserDto: CreateUserDto) {
        let user = await this.findByEmail(createUserDto.email);
        if (user) {
            throw new BadRequestException('User already present');
        }
        return bcrypt.genSalt(SALT_ROUNDS).then((salt) => {
            return bcrypt.hash(createUserDto.password, salt).then(async (hashedPassword) => {
                user = await this.findByEmail(createUserDto.email);
                createUserDto.password = hashedPassword;
                user = this.userRepo.create(createUserDto);
                if (!user) {
                    throw new BadRequestException('Cannot reate user');
                }
                return await this.userRepo.save(user);
            });
        });
    }
}
