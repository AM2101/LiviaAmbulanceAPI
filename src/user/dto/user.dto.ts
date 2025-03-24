import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsAlphanumeric,
  IsArray,
  IsBoolean,
  IsEmail,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  Length,
  Matches,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ACCESS_TYPE,
  USER_TYPE,
  ROLE_TYPE_LIVIA_ADMIN,
  LIST_SORT_BY_FIELDS,
  LIST_SORT_ORDER_TYPE,
} from '../../constants/enum';

export class AccessSections {
  @ApiProperty()
  @IsEnum(ROLE_TYPE_LIVIA_ADMIN)
  @IsNotEmpty()
  role: ROLE_TYPE_LIVIA_ADMIN;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  readAccess: boolean;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  writeAccess: boolean;
}

export class AddUserDto {
  @ApiProperty({ example: 'Justin' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'firstName must be 1-50 in length' })
  @Matches(/^([^\d]*)$/, { message: 'firstName cannot contains a number' })
  firstName: string;

  @ApiProperty({ example: 'Hopkins' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'lastName must be 1-50 in length' })
  @Matches(/^([^\d]*)$/, { message: 'lastName cannot contains a number' })
  lastName: string;

  @ApiProperty({ example: '254' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'phoneCode must be equal to 3 in length' })
  phoneCode: string;

  @ApiProperty({ example: '700000000' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(1|7)([0-9]{8})$/, {
    message:
      'phone number must starts with 1 or 7 and must be equal to 9 in length',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'justin.hopkins@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @Length(6, 320, {
    message: 'email must be less than or equal to 320 in length {64}@{255}',
  })
  email: string;

  @ApiProperty({ example: 'Carnage@1' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, {
    message:
      "password's minimum length must be 8 and maximum length must be upto 20",
  })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'password must have atleast, one upper case, one lower case, one digit, one special character and minimum eight in length',
  })
  password: string;

  @ApiProperty({ enum: USER_TYPE, example: 'ADMIN | INSURER' })
  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  type: USER_TYPE;

  // @ApiPropertyOptional({ example: '644a3c17f4dc43367ac8964e' })
  // @IsString()
  // @IsOptional()
  // @IsAlphanumeric()
  // @Length(24, 24, {
  //   message:
  //     'ObjectId must be a single string of 12 bytes or a string of 24 hex characters',
  // })
  // insuranceCompanyId?: string;

  // @ApiPropertyOptional({ enum: ACCESS_TYPE, example: 'FULL | PARTIAL' })
  // @IsEnum(ACCESS_TYPE)
  // @IsOptional()
  // access?: ACCESS_TYPE;

  // @ApiProperty({
  //   type: [AccessSections],
  //   example: [
  //     {
  //       role: 'MANAGE_USERS',
  //       readAccess: true,
  //       writeAccess: true,
  //     },
  //     // {
  //     //   role: 'MANAGE_BENEFITS_SUB_BENEFITS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_BUSINESS_PARTNERS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_INSURANCE_MEMBERS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_SCHEMES',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_POLICIES',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_MEMBER_POLICIES',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_EXTENDED_BENEFITS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_REPORTS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_CLAIMS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_PROVIDERS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_SETTINGS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_SUPPORT',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //     // {
  //     //   role: 'MANAGE_LOGS',
  //     //   readAccess: true,
  //     //   writeAccess: true,
  //     // },
  //   ],
  // })
  // @IsNotEmpty()
  // @IsArray()
  // @ArrayMinSize(1)
  // @ArrayMaxSize(14)
  // @ValidateNested({ each: true })
  // @Type(() => AccessSections)
  // accessSections: AccessSections[];
}

export class AddLiviaAdminSuperUserDto {
  @ApiProperty({ example: 'Super' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'firstName must be 1-50 in length' })
  @Matches(/^([^\d]*)$/, { message: 'firstName cannot contains a number' })
  firstName: string;

  @ApiProperty({ example: 'Admin' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 50, { message: 'lastName must be 1-50 in length' })
  @Matches(/^([^\d]*)$/, { message: 'lastName cannot contains a number' })
  lastName: string;

  @ApiProperty({ example: '254' })
  @IsString()
  @IsNotEmpty()
  @Length(3, 3, { message: 'phoneCode must be equal to 3 in length' })
  phoneCode: string;

  @ApiProperty({ example: '123456789' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(1|7)([0-9]{8})$/, {
    message:
      'phone number must starts with 1 or 7 and must be equal to 9 in length',
  })
  phoneNumber: string;

  @ApiProperty({ example: 'superadmin@bms.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @Length(6, 320, {
    message: 'email must be less than or equal to 320 in length {64}@{255}',
  })
  email: string;

  @ApiProperty({ example: 'Superadmin@1' })
  @IsString()
  @IsNotEmpty()
  @Length(8, 20, {
    message:
      "password's minimum length must be 8 and maximum length must be upto 20",
  })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'password must have atleast, one upper case, one lower case, one digit, one special character and minimum eight in length',
  })
  password: string;

  @ApiProperty({ enum: USER_TYPE, example: 'ADMIN | User' })
  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  type: USER_TYPE;
}

export class EditUserDto {
  @ApiProperty({ example: '644b5546be79cb77b16b746a' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiPropertyOptional({ example: 'JustinJ' })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'first name must be 1-50 in length' })
  @Matches(/^([^\d]*)$/, { message: 'firstName cannot contains a number' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'HopkinsH' })
  @IsOptional()
  @IsString()
  @Length(1, 50, { message: 'last name must be 1-50 in length' })
  @Matches(/^([^\d]*)$/, { message: 'lastName cannot contains a number' })
  lastName?: string;

  @ApiPropertyOptional({ example: '700000000' })
  @IsOptional()
  @IsString()
  @Matches(/^(1|7)([0-9]{8})$/, {
    message:
      'phone number must starts with 1 or 7 and must be equal to 9 in length',
  })
  phoneNumber?: string;

  @ApiPropertyOptional({ example: 'justinjh.hopkinsjh@example.com' })
  @IsOptional()
  @IsString()
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase())
  @Length(6, 320, {
    message: 'email must be less than or equal to 320 in length {64}@{255}',
  })
  email?: string;

  @ApiPropertyOptional({ example: 'Carnage@1' })
  @IsString()
  @Length(8, 20, {
    message:
      "password's minimum length must be 8 and maximum length must be upto 20",
  })
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'password must have atleast, one upper case, one lower case, one digit, one special character and minimum eight in length',
  })
  @IsOptional()
  changedPassword?: string;

  @ApiPropertyOptional({
    type: [AccessSections],
    example: [
      {
        role: 'MANAGE_USERS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_BENEFITS_SUB_BENEFITS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_BUSINESS_PARTNERS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_INSURANCE_MEMBERS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_SCHEMES',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_POLICIES',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_MEMBER_POLICIES',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_CLAIMS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_PROVIDERS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_SETTINGS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_SUPPORT',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_SUPPORT',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_LOGS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_EXTENDED_BENEFITS',
        readAccess: true,
        writeAccess: true,
      },
      {
        role: 'MANAGE_REPORTS',
        readAccess: true,
        writeAccess: true,
      },
    ],
  })
  @IsArray()
  @IsOptional()
  @ArrayMinSize(1)
  @ArrayMaxSize(14)
  @ValidateNested({ each: true })
  @Type(() => AccessSections)
  accessSections?: AccessSections[];
}

export class GetAllUsersDto {
  @ApiProperty({ enum: USER_TYPE })
  @IsEnum(USER_TYPE)
  @IsNotEmpty()
  type: USER_TYPE;

  @ApiPropertyOptional({ example: 'super' })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({ enum: LIST_SORT_BY_FIELDS })
  @IsEnum(LIST_SORT_BY_FIELDS)
  @IsOptional()
  sortBy?: LIST_SORT_BY_FIELDS;

  @ApiPropertyOptional({ enum: LIST_SORT_ORDER_TYPE })
  @IsEnum(LIST_SORT_ORDER_TYPE)
  @IsOptional()
  sortOrder?: LIST_SORT_ORDER_TYPE;

  @ApiPropertyOptional({ description: 'Filter By isActive Boolean' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  isActive?: boolean;

  @ApiPropertyOptional({ enum: ACCESS_TYPE })
  @IsEnum(ACCESS_TYPE)
  @IsOptional()
  access?: ACCESS_TYPE;

  @ApiPropertyOptional({ description: 'filter by business partner object id' })
  @IsMongoId()
  @IsOptional()
  insuranceCompanyId?: string;

  @ApiProperty({ example: 1 })
  @IsNotEmpty()
  @Min(1, { message: 'page must be greater than 0' })
  @IsInt()
  @Type(() => Number)
  page: number;

  @ApiProperty({ example: 10 })
  @IsNotEmpty()
  @Min(1, { message: 'limit must be greater than 0' })
  @IsInt()
  @Type(() => Number)
  limit: number;
}

export class UpdateConfigDataDto {
  @ApiProperty({ type: Boolean, default: true })
  @IsBoolean()
  @IsNotEmpty()
  email: boolean;

  @ApiProperty({ type: Boolean, default: false })
  @IsBoolean()
  @IsNotEmpty()
  sms: boolean;
}

export class UpdateConfigDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsNotEmpty()
  configCode: string;

  @ApiProperty({ type: UpdateConfigDataDto })
  @IsNotEmptyObject()
  @IsObject()
  @Type(() => UpdateConfigDataDto)
  data: UpdateConfigDataDto;
}

export class FindOtpDto {
  @ApiProperty({ example: 'justin.hopkins@example.com' })
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  @Length(6, 320, {
    message: 'email must be less than or equal to 320 in length {64}@{255}',
  })
  email: string;
}
