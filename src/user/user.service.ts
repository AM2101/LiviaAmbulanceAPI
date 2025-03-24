import { BadRequestException, ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseService } from '../common/base.service';
import { USER_MODEL, UserDocument } from '../schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { USER_TYPE } from 'src/constants/enum';
import * as bcrypt from 'bcrypt';
import { CommonService } from 'src/common/common.service';
import { ROLE_MODEL, RoleDocument } from 'src/schema/Role.schema';

@Injectable()
export class UserService extends BaseService<UserDocument>{

   constructor(
       @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
       @InjectModel(ROLE_MODEL) private roleModel: Model<RoleDocument>,
        private readonly commonService: CommonService,
   ) {
    super(userModel);
}

async addUser(addUserDto, request: Request) {
    const accessTokenData = request['accessTokenData'];
    if (
      accessTokenData.type === USER_TYPE.SUPERADMIN &&  
      accessTokenData.type === USER_TYPE.ADMIN
    ) {
      throw new BadRequestException(
        'Sorry, you are not allowed to do this operation.',
      );
    }

    const userWithEmail = await this.userModel.findOne(
      {
        email: addUserDto.email,
      },
      { _id: 1 },
    );
    if (userWithEmail) {
      throw new ConflictException(
        'Sorry, the email address is already registered with us. Please use a different email address.',
      );
    }

    const userWithPhoneNumber = await this.userModel.findOne(
      { phoneCode: addUserDto.phoneCode, phoneNumber: addUserDto.phoneNumber },
      { _id: 1 },
    );

    if (userWithPhoneNumber) {
      throw new ConflictException(
        'Sorry, the phone number is already registered with us. Please use a different phone number.',
      );
    }

    const countryCodes = await this.commonService.getCountryCodes();
    const isAllowedPhoneCode =
      countryCodes.filter((obj) => obj.phoneCode === addUserDto.phoneCode)
        .length > 0;
    const allowedPhoneCodeList = countryCodes.map((obj) => obj.phoneCode);
    if (!isAllowedPhoneCode) {
      throw new BadRequestException(
        `Invalid phone code. Please select the correct phone code from list ${allowedPhoneCodeList}.`,
      );
    }

    // const _id = new Types.ObjectId(accessTokenData._id);
    // const user_profile = await this.commonService.getUserDataWithAccessSections(
    //   _id,
    // );

    // let createdBy;
    // if (user_profile.length > 0) {
    //   createdBy = user_profile[0]?.firstName + ' ' + user_profile[0]?.lastName;
    // }
    // addUserDto['createdBy'] = createdBy;

    const hashPassword = await bcrypt.hash(addUserDto.password, 10);
    const roleId = await this.roleModel.findOne({ 
        roleName: addUserDto.type });
    addUserDto['roleId'] = roleId._id;
    addUserDto.password = hashPassword;
    if (addUserDto.type === USER_TYPE.ADMIN && addUserDto?.insuranceCompanyId) {
      throw new BadRequestException('Invalid request. Please try again.');
    }

    // if (
    //   addUserDto.type === USER_TYPE.INSURER &&
    //   !addUserDto?.insuranceCompanyId &&
    //   !addUserDto.insuranceCompanyId
    // ) {
    //   throw new BadRequestException(
    //     'Please select Business partner for the user.',
    //   );
    // } else if (
    //   addUserDto.type === USER_TYPE.INSURER &&
    //   addUserDto.insuranceCompanyId
    // ) {
    //   if (accessTokenData.type === USER_TYPE.INSURER) {
    //     if (
    //       accessTokenData.insuranceCompanyId !== addUserDto.insuranceCompanyId
    //     ) {
    //       throw new BadRequestException(
    //         'Invalid Business partner selected for this user.',
    //       );
    //     }
    //   }

    //   const insuranceCompanyObjectId = new Types.ObjectId(
    //     addUserDto.insuranceCompanyId,
    //   );
    //   const insuranceCompany = await this.insuranceCompanyModel.findOne(
    //     {
    //       _id: insuranceCompanyObjectId,
    //     },
    //     { name: 1 },
    //   );
    //   if (!insuranceCompany) {
    //     throw new NotFoundException(
    //       'Sorry, Business partner details not found in our records.',
    //     );
    //   }
    //   if (insuranceCompany) {
    //     addUserDto['insuranceCompanyName'] = insuranceCompany.name;
    //     addUserDto['insuranceCompanyId'] = new Types.ObjectId(
    //       addUserDto.insuranceCompanyId,
    //     );
    //   }
    // }

    addUserDto['isActive'] = true;

    const registered_user = await this.createUser(addUserDto);

    const logPayload = {
        userId: accessTokenData?._id.toString(),
        affectedEntity: registered_user?.email,
        originalCollectionName: USER_MODEL,
        collectionId: registered_user?._id.toString(),
        dataUpdated: registered_user.toJSON?.() || registered_user, // convert Mongoose doc if needed
        status: true,
      };
      
    return logPayload;

    // this.logsService.createApiLogs(logPayload);

    // await this.insertDefaultUserRoles(registered_user._id, addUserDto.type);

    // return await this.updateUserRolesInDB(
    //   registered_user._id,
    //   addUserDto.accessSections,
    //   addUserDto.type,
    // );
  }

  async createUser(addUserDto) {
    try {
      const createUser = new this.userModel(addUserDto);
      const newUser = await createUser.save();

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

}
