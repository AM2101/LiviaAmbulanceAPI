import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
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
  ) { }

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

  // async getAccessSectionsByUserId(userId,roleId) {
  //   const accessSections = await this.userModel
  //     .aggregate([
  //       {
  //         $match: {
  //           roleId: roleId,
  //         },
  //       },
  //       {
  //         $lookup: {
  //           from: 'RoleAccess',
  //           localField: '_id',
  //           foreignField: 'roleId',
  //           as: 'RoleAccess',
  //         },
  //       },
  //       {
  //         $project: {
  //           'RoleAccess.module': 1,
  //           'RoleAccess.readAccess': 1,
  //           'RoleAccess.writeAccess': 1,
  //         },
  //       },
  //     ])
  //     .exec();

  //   return accessSections.length > 0 && accessSections[0]?.UserRole
  //     ? accessSections[0].UserRole
  //     : [];
  // }
  // async getAccessSectionsByUserId(userId: any, roleId: any) {
  //   const accessSections = await this.userModel
  //     .aggregate([
  //       // Match the user by roleId
  //       {
  //         $match: {
  //           roleId: roleId, // Match the roleId passed as parameter
  //         },
  //       },
  //       // Lookup the RoleAccess collection based on roleId
  //       {
  //         $lookup: {
  //           from: 'RoleAccess', // The collection to join with
  //           localField: 'roleId', // Local field in user model to match
  //           foreignField: 'roleId', // Foreign field in RoleAccess collection
  //           as: 'RoleAccess', // Alias for the resulting array
  //         },
  //       },
  //       // Project the necessary fields (flatten the RoleAccess array and get only required fields)
  //       {
  //         $project: {
  //           'RoleAccess.module': 1,  // Include module from RoleAccess
  //           'RoleAccess.readAccess': 1,     // Include readAccess from RoleAccess
  //           'RoleAccess.writeAccess': 1,    // Include writeAccess from RoleAccess
  //         },
  //       },
  //       // Optionally, if you want to unwind the RoleAccess array (if you expect a single match)
  //       {
  //         $unwind: {
  //           path: '$RoleAccess',
  //           preserveNullAndEmptyArrays: true, // To ensure you don't get empty results
  //         },
  //       },
  //     ])
  //     .exec();

  //   // Return the relevant data from RoleAccess or an empty array if no access found
  //   return accessSections.length > 0 && accessSections[0]?.RoleAccess
  //     ? accessSections[0].RoleAccess
  //     : [];
  // }

  // async getAccessSectionsByUserId(userId: any, roleId: any) {
  //   const accessSections = await this.userModel
  //     .aggregate([
  //       // Match the user by roleId
  //       {
  //         $match: {
  //           roleId: roleId, // Match the roleId passed as parameter
  //         },
  //       },
  //       // Lookup the RoleAccess collection based on roleId
  //       {
  //         $lookup: {
  //           from: 'RoleAccess', // The collection to join with
  //           localField: 'roleId', // Local field in user model to match
  //           foreignField: 'roleId', // Foreign field in RoleAccess collection
  //           as: 'RoleAccess', // Alias for the resulting array
  //         },
  //       },
  //       // Project the necessary fields (flatten the RoleAccess array and get only required fields)
  //       {
  //         $project: {
  //           'RoleAccess.module': 1,  // Include module from RoleAccess
  //           'RoleAccess.readAccess': 1,     // Include readAccess from RoleAccess
  //           'RoleAccess.writeAccess': 1,    // Include writeAccess from RoleAccess
  //         },
  //       },
  //       // Unwind the RoleAccess array (if present)
  //       {
  //         $unwind: {
  //           path: '$RoleAccess',
  //           preserveNullAndEmptyArrays: true, // Ensures an empty array is returned if no RoleAccess found
  //         },
  //       },
  //       // Group the result back into an array (in case the unwind stage was used)
  //       {
  //         $group: {
  //           _id: null, // You can use _id to group if needed, or just set it to null
  //           RoleAccess: { $push: '$RoleAccess' }, // This will always return an array
  //         },
  //       },
  //     ])
  //     .exec();

  //   // Return the RoleAccess array, or an empty array if no access found
  //   return accessSections.length > 0 ? accessSections[0].RoleAccess : [];
  // }
  //   async getAccessSectionsByUserId(userId: any, roleId: any) {
  //     const accessSections = await this.userModel
  //         .aggregate([
  //             // Match the user by roleId
  //             {
  //                 $match: {
  //                     roleId: roleId, // Match the roleId passed as a parameter
  //                 },
  //             },
  //             // Lookup the RoleAccess collection based on roleId
  //             {
  //                 $lookup: {
  //                     from: 'RoleAccess', // The collection to join with
  //                     localField: 'roleId', // Local field in user model to match
  //                     foreignField: 'roleId', // Foreign field in RoleAccess collection
  //                     as: 'RoleAccess', // Alias for the resulting array
  //                 },
  //             },
  //             // Unwind the RoleAccess array (if present)
  //             {
  //                 $unwind: {
  //                     path: '$RoleAccess',
  //                     preserveNullAndEmptyArrays: true, // Ensures an empty array is returned if no RoleAccess found
  //                 },
  //             },
  //             // Lookup the modules collection based on RoleAccess.module field
  //             {
  //                 $lookup: {
  //                     from: 'modules', // The collection to join with
  //                     localField: 'RoleAccess.module', // Local field in RoleAccess
  //                     foreignField: '_id', // Foreign field in the modules collection
  //                     as: 'ModuleDetails', // Alias for the resulting array
  //                 },
  //             },
  //             // Unwind the ModuleDetails array
  //             {
  //                 $unwind: {
  //                     path: '$ModuleDetails',
  //                     preserveNullAndEmptyArrays: true, // Ensures an empty array is returned if no modules found
  //                 },
  //             },
  //             // Project the required fields
  //             {
  //                 $project: {
  //                     _id: 0, // Exclude _id field from the result
  //                     readAccess: '$RoleAccess.readAccess', // Include readAccess
  //                     writeAccess: '$RoleAccess.writeAccess', // Include writeAccess
  //                     module: '$ModuleDetails', // Include full module details
  //                 },
  //             },
  //             // Group the results into an array
  //             {
  //                 $group: {
  //                     _id: null,
  //                     accessSections: { $push: '$$ROOT' },
  //                 },
  //             },
  //         ])
  //         .exec();

  //     // Return the accessSections array or an empty array if no access found
  //     return accessSections.length > 0 ? accessSections[0].accessSections : [];
  // }

  async getAccessSectionsByUserId(userId: any, roleId: any) {


    const accessSections = await this.userModel
      .aggregate([
        {
          $match: {
            roleId: roleId,
          },
        },
        {
          $lookup: {
            from: 'RoleAccess',
            localField: 'roleId',
            foreignField: 'roleId',
            as: 'RoleAccess',
          },
        },
        {
          $unwind: {
            path: '$RoleAccess',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $set: {
            'RoleAccess.module': {
              $convert: {
                input: '$RoleAccess.module',
                to: 'objectId',
                onError: null,
                onNull: null,
              },
            },
          },
        },
        {
          $lookup: {
            from: 'Modules',
            localField: 'RoleAccess.module',
            foreignField: '_id',
            as: 'ModuleDetails',
          },
        },
        {
          $unwind: {
            path: '$ModuleDetails',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $project: {
            _id: 0,
            readAccess: '$RoleAccess.readAccess',
            writeAccess: '$RoleAccess.writeAccess',
            module: '$ModuleDetails',
          },
        },
        {
          $group: {
            _id: null,
            accessSections: { $push: '$$ROOT' },
          },
        },
      ])
      .exec();


    return accessSections.length > 0 ? accessSections[0].accessSections : [];
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

  async controllerReadAccess(module: string, user: any) {
    if (!user?.accessSections) {
      console.warn('No access sections found for user');
      return false;
    }

    return user.accessSections.some(
      (accessSection) => {
        if (accessSection?.module.name === module) {
          return true;
        }
        return false;
      }
    );
  }
}
