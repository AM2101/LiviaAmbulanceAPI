import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { CommonService } from './common.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AccessInterceptor implements NestInterceptor {
  constructor(
    private readonly commonService: CommonService,
    private readonly jwtService: JwtService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];
    const token = authHeader?.split(' ')[1];
    const user = this.jwtService.decode(token);

    const module = context.getClass().name;
    const hasAccess = this.commonService.controllerReadAccess(module, user);
    
    if (!hasAccess) {
        throw new UnauthorizedException('Access denied');
    }

    return next.handle();
  }
}
