import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { USER_MODEL, UserDocument } from '../schema/user.schema';
// import {
//   INSURANCE_COMPANY_MODEL,
//   InsuranceCompanyDocument,
// } from '../schema/insurance_company.schema';
// import { Types } from 'mongoose';
// import { COUNTRY_MODEL, CountryDocument } from '../schema/country.schema';
// import { TRASH_MODEL, TrashDocument } from '../schema/trash.schema';
import * as bcrypt from 'bcrypt';


@Injectable()
export class CommonService {
  constructor(
    @InjectModel(USER_MODEL) private userModel: Model<UserDocument>,
    // @InjectModel(INSURANCE_COMPANY_MODEL)
    // private insuranceCompanyModel: Model<InsuranceCompanyDocument>,
    // @InjectModel(COUNTRY_MODEL) private countryModel: Model<CountryDocument>,
    // @InjectModel(TRASH_MODEL) private trashModel: Model<TrashDocument>,
  ) {}

  // async getCountryCodes() {
  //   try {
  //     return await this.countryModel.find({}, { _id: 0 });
  //   } catch (error) {
  //     throw new InternalServerErrorException(error.message);
  //   }
  // }

  async findOneAndUpdate(userId, editUserDto, fieldToUpdate, existing_user) {
    try {
      if (fieldToUpdate === 'email') {
        const user = await this.userModel.findOne(
          {
            email: editUserDto[fieldToUpdate],
          },
          { email: 1 },
        );
        if (user && existing_user.email !== user.email) {
          throw new ConflictException(
            'Sorry, the email address is already registered with us. Please use a different email address.',
          );
        }
        await this.userModel.updateOne(
          { _id: userId },
          { $set: { email: editUserDto[fieldToUpdate] } },
        );
      } else if (fieldToUpdate === 'changedPassword') {
        const hashPassword = await bcrypt.hash(editUserDto[fieldToUpdate], 10);
        await this.userModel.updateOne(
          { _id: userId },
          { $set: { password: hashPassword } },
        );
      } else {
        let update_object = {};
        update_object[fieldToUpdate] = editUserDto[fieldToUpdate];
        await this.userModel.updateOne(
          { _id: userId },
          { $set: update_object },
        );
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException(
          'A user is already registered with this email address',
        );
      } else {
        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async getAccessSectionsByUserId(userId) {
    const accessSections = await this.userModel
      .aggregate([
        {
          $match: {
            _id: userId,
          },
        },
        {
          $lookup: {
            from: 'UserRole',
            localField: '_id',
            foreignField: 'userId',
            as: 'UserRole',
          },
        },
        {
          $project: {
            'UserRole.role': 1,
            'UserRole.readAccess': 1,
            'UserRole.writeAccess': 1,
          },
        },
      ])
      .exec();

    return accessSections.length > 0 && accessSections[0]?.UserRole
      ? accessSections[0].UserRole
      : [];
  }

  async fetchUserParticularSectionWriteAccess(accessTokenData, role) {
    const hasWriteAccess =
      accessTokenData.accessSections.length > 0
        ? accessTokenData.accessSections.filter((obj) => {
            if (obj.role === role && obj.writeAccess === true) {
              return true;
            } else {
              return false;
            }
          }).length > 0
        : false;

    return hasWriteAccess;
  }

  async fetchUserParticularSectionAccess(accessTokenData, role) {
    const hasSectionAccess =
      accessTokenData.accessSections.length > 0
        ? accessTokenData.accessSections.filter((obj) => {
            if (
              obj.role === role &&
              (obj.writeAccess === true || obj.readAccess === true)
            ) {
              return true;
            } else {
              return false;
            }
          }).length > 0
        : false;

    return hasSectionAccess;
  }

  async getUserDataWithAccessSections(userId) {
    try {
      const user = await this.userModel
        .aggregate([
          {
            $match: {
              _id: userId,
            },
          },
          {
            $lookup: {
              from: 'UserRole',
              localField: '_id',
              foreignField: 'userId',
              as: 'accessSections',
            },
          },
        ])
        .exec();

      return user;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async trash<T>(
    model: Model<T>,
    originalId: Types.ObjectId,
    deletedBy: Types.ObjectId,
  ) {
    const originalCollection = model.collection.name;
    const data = await model.findById(originalId).lean().exec();

    // const trashItem = new this.trashModel({
    //   originalCollection,
    //   originalId,
    //   deletedBy,
    //   data,
    // });

    // return await trashItem.save();
  }
}
