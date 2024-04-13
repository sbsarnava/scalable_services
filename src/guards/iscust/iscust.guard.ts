import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { UtilService } from 'src/util/util.service';
import { USER_ROLE } from 'src/models/user-jwt.model';

@Injectable()
export class IsCustGuard implements CanActivate {
    constructor(private authGuard: AuthGuard, private utilService: UtilService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isAuthenticated = await this.authGuard.canActivate(context);
        if (!isAuthenticated) {
            throw new UnauthorizedException('User not authorized 1');
        }
        const user = this.utilService.getUserFromContext(context);
        if (!user) {
            throw new UnauthorizedException('User not authorized 2');
        }
        const isCustomer = user.role && user.role === USER_ROLE.customer ? true : false;
        if (isCustomer) {
            return true;
        } else {
            throw new UnauthorizedException();
        }
    }
}
