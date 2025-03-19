import { Injectable } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { UserDocument } from '../schema/user.schema';
@Injectable()
export class UserService extends BaseService<UserDocument>{}
