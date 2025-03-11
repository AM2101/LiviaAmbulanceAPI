import {
  CanActivate,
  ExecutionContext,
  Injectable,
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
import { USER_MODEL, UserDocument } from 'src/schema/user.schema';
import { ROLE_TYPE_LIVIA_ADMIN } from 'src/constants/enum';

@Injectable()
export class ManageSettingsGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private readonly commonService: CommonService,
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

      const userId = new Types.ObjectId(payload._id);

      const accessSections = await this.commonService.getAccessSectionsByUserId(
        userId,
      );

      const hasWriteAccess =
        accessSections.length > 0
          ? accessSections.filter((obj) => {
              if (
                obj.role === ROLE_TYPE_LIVIA_ADMIN.MANAGE_SETTINGS &&
                obj.writeAccess === true
              ) {
                return true;
              } else {
                return false;
              }
            }).length > 0
          : false;

      if (hasWriteAccess) {
        return true;
      }
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
}
