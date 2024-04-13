import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { USER_ROLE, UserJWT } from 'src/models/user-jwt.model';

@Injectable()
export class IsstaffGuard implements CanActivate {
    constructor(private authGuard: AuthGuard) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = await this.authGuard.canActivate(context);
        if (!isAuthenticated) {
            throw new UnauthorizedException('User not authorized 1');
        }
        const user: UserJWT = context.switchToHttp().getRequest().user;
        if (!user) {
            throw new UnauthorizedException('User not authorized 2');
        }
        const isStaff = user.role && user.role === USER_ROLE.staff ? true : false;
        if (isStaff) {
            return true;
        } else {
            throw new UnauthorizedException();
        }
    }
}
