import { ExecutionContext, Injectable } from '@nestjs/common';
import { UserJWT } from 'src/models/user-jwt.model';

@Injectable()
export class UtilService {
    getUserFromContext(context: ExecutionContext): UserJWT {
        return context.switchToHttp().getRequest().user ? context.switchToHttp().getRequest().user : null;
    }

    getUserFromRequest(request: any | Request) {
        return request.user ? request.user : null;
    }
}
