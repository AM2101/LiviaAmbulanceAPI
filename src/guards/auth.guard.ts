import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_MODEL, UserDocument } from 'src/schema/user.schema';
const jwt = require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = jwt;

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException(
        'Authentication failed: Access token not found',
      );
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        publicKey: this.configService.get('JWT_ACCESS_TOKEN_PUBLIC_KEY'),
      });

      request['accessTokenData'] = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException(
          'Authentication failed: Access token is expired',
        );
      } else if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException(
          'Authentication failed: Access token is invalid',
        );
      }
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }
}
