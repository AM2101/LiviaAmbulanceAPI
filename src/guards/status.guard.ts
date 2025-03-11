import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { Model, Types } from 'mongoose';
const jwt = require('jsonwebtoken');
const { TokenExpiredError, JsonWebTokenError } = jwt;
import { CommonService } from '../common/common.service';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from '../schema/user.schema';

@Injectable()
export class StatusGuard implements CanActivate {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly commonService: CommonService,
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

      const userId = new Types.ObjectId(payload._id);

      const status = await this.findUserStatusById(userId);

      if (status) {
        return true;
      }
      return false
    } catch (error) {
      console.log('----------------ERROR---------------');
      console.log(error);
      console.log('----------------ERROR---------------');
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
    return false;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return type === 'Bearer' ? token : undefined;
  }

  async findUserStatusById(userId) {
    try {
      const user = await this.userModel.findById(userId, {
        _id: 0,
        isActive: 1,
      });

      return user?.isActive;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
