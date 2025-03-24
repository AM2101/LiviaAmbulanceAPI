import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  ValidateNested,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'firstName.lastName@domain.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;

  @ApiProperty({ example: 'Password' })
  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LogoutDto {
  @ApiProperty({ example: '644b5546be79cb77b16b746a' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDRhMzhlOTMyOTNhZmRlMTA3YjQxYmUiLCJlbWFpbCI6InN1cGVyQGFkbWluLmNvbSIsInR5cGUiOiJBRE1JTiIsImFjY2Vzc1NlY3Rpb25zIjpbeyJyb2xlIjoiTUFOQUdFX1VTRVJTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9CRU5FRklUU19TVUJfQkVORUZJVFMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX0seyJyb2xlIjoiTUFOQUdFX0lOU1VSQU5DRV9DT01QQU5JRVMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX0seyJyb2xlIjoiTUFOQUdFX1BPTElDWV9NRU1CRVJTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydV9LHsicm9sZSI6Ik1BTkFHRV9TQ0hFTUVTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9QT0xJQ0lFUyIsInJlYWRBY2Nlc3MiOnRydWUsIndyaXRlQWNjZXNzIjp0cnVlfSx7InJvbGUiOiJNQU5BR0VfTUVNQkVSX1BPTElDSUVTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9DTEFJTVMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX1dLCJpYXQiOjE2ODI2NjM3NjUsImV4cCI6MTcxNDE5OTc2NX0.Gmxz8BiPXzxPehv5s1R1pzgwi1eXbvGgEvjIJZ00n_cPWg59kJiB31Xvcwsl_vmhIpHKDl-iiReWGmHeEoaeepwtnXkGS74BQKp2SrCTVhgOAg59-BZhrK_asvv-YAVCodA1HfTCBvoG-6k3gAegeaNwFCZQjvWtv4_TxhAgNERYczYG6ovPlJZGQdcmCvahs8EFaFiBQklVnBQ21HHHelb6i20e-q_Mn8-AYS59z5UrHqiTCxvUicU_knR1XOqt4w9AKL9V8zamDutDpMUb46fJbyXAaCgb949-EQjHuWu6ewVNCzQ7hriiqrR1CoLECjAD-jpArNcatF4VeeQow',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}

export class NewTokensDto {
  @ApiProperty({
    example:
      'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDRhMzhlOTMyOTNhZmRlMTA3YjQxYmUiLCJlbWFpbCI6InN1cGVyQGFkbWluLmNvbSIsInR5cGUiOiJBRE1JTiIsImFjY2Vzc1NlY3Rpb25zIjpbeyJyb2xlIjoiTUFOQUdFX1VTRVJTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9CRU5FRklUU19TVUJfQkVORUZJVFMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX0seyJyb2xlIjoiTUFOQUdFX0lOU1VSQU5DRV9DT01QQU5JRVMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX0seyJyb2xlIjoiTUFOQUdFX1BPTElDWV9NRU1CRVJTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydV9LHsicm9sZSI6Ik1BTkFHRV9TQ0hFTUVTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9QT0xJQ0lFUyIsInJlYWRBY2Nlc3MiOnRydWUsIndyaXRlQWNjZXNzIjp0cnVlfSx7InJvbGUiOiJNQU5BR0VfTUVNQkVSX1BPTElDSUVTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9DTEFJTVMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX1dLCJpYXQiOjE2ODI2NjM3NjUsImV4cCI6MTcxNDE5OTc2NX0.Gmxz8BiPXzxPehv5s1R1pzgwi1eXbvGgEvjIJZ00n_cPWg59kJiB31Xvcwsl_vmhIpHKDl-iiReWGmHeEoaeepwtnXkGS74BQKp2SrCTVhgOAg59-BZhrK_asvv-YAVCodA1HfTCBvoG-6k3gAegeaNwFCZQjvWtv4_TxhAgNERYczYG6ovPlJZGQdcmCvahs8EFaFiBQklVnBQ21HHHelb6i20e-q_Mn8-AYS59z5UrHqiTCxvUicU_knR1XOqt4w9AKL9V8zamDutDpMUb46fJbyXAaCgb949-EQjHuWu6ewVNCzQ7hriiqrR1CoLECjAD-jpArNcatF4VeeQow',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;

  @ApiPropertyOptional({ description: 'Continue session' })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  continueSession?: boolean;
}

export class ChangePasswordDto {
  @ApiProperty({ example: 'Welcome@123' })
  @IsString()
  @IsNotEmpty()
  oldPassword: string;

  @ApiProperty({ example: 'Hello@123' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'password must have atleast, one upper case, one lower case, one digit, one special character and minimum eight in length',
  })
  newPassword: string;
}

export class CreateResetPasswordLinkDto {
  @ApiProperty({ example: 'justinjh.hopkinsjh@example.com' })
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value.toLowerCase())
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty({ example: 'Hello@123' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/, {
    message:
      'password must have atleast, one upper case, one lower case, one digit, one special character and minimum eight in length',
  })
  password: string;

  @ApiProperty({
    example:
      'eyJhbGciOiJSUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDRhMzhlOTMyOTNhZmRlMTA3YjQxYmUiLCJlbWFpbCI6InN1cGVyQGFkbWluLmNvbSIsInR5cGUiOiJBRE1JTiIsImFjY2Vzc1NlY3Rpb25zIjpbeyJyb2xlIjoiTUFOQUdFX1VTRVJTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9CRU5FRklUU19TVUJfQkVORUZJVFMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX0seyJyb2xlIjoiTUFOQUdFX0lOU1VSQU5DRV9DT01QQU5JRVMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX0seyJyb2xlIjoiTUFOQUdFX1BPTElDWV9NRU1CRVJTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydV9LHsicm9sZSI6Ik1BTkFHRV9TQ0hFTUVTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9QT0xJQ0lFUyIsInJlYWRBY2Nlc3MiOnRydWUsIndyaXRlQWNjZXNzIjp0cnVlfSx7InJvbGUiOiJNQU5BR0VfTUVNQkVSX1BPTElDSUVTIiwicmVhZEFjY2VzcyI6dHJ1ZSwid3JpdGVBY2Nlc3MiOnRydWV9LHsicm9sZSI6Ik1BTkFHRV9DTEFJTVMiLCJyZWFkQWNjZXNzIjp0cnVlLCJ3cml0ZUFjY2VzcyI6dHJ1ZX1dLCJpYXQiOjE2ODI2NjM3NjUsImV4cCI6MTcxNDE5OTc2NX0.Gmxz8BiPXzxPehv5s1R1pzgwi1eXbvGgEvjIJZ00n_cPWg59kJiB31Xvcwsl_vmhIpHKDl-iiReWGmHeEoaeepwtnXkGS74BQKp2SrCTVhgOAg59-BZhrK_asvv-YAVCodA1HfTCBvoG-6k3gAegeaNwFCZQjvWtv4_TxhAgNERYczYG6ovPlJZGQdcmCvahs8EFaFiBQklVnBQ21HHHelb6i20e-q_Mn8-AYS59z5UrHqiTCxvUicU_knR1XOqt4w9AKL9V8zamDutDpMUb46fJbyXAaCgb949-EQjHuWu6ewVNCzQ7hriiqrR1CoLECjAD-jpArNcatF4VeeQow',
  })
  @IsNotEmpty()
  @IsString()
  passwordToken: string;
}

export class ResendOtpDto {
  @ApiProperty({ example: '644b5546be79cb77b16b746a' })
  @IsNotEmpty()
  @IsString()
  userId: string;
}

export class VerifyOtpDto {
  @ApiProperty({ example: '644b5546be79cb77b16b746a' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ example: '1234' })
  @IsString()
  @IsNotEmpty()
  OTP: string;
}

export class RoleDto {
  @ApiProperty({ example: '67d17f8b158ea83b44b76b6d', description: 'Role ID' })
  @IsString()
  _id: string;

  @ApiProperty({ example: 'Super Admin', description: 'Name of the role' })
  @IsString()
  roleName: string;
}

export class CountryDto {

  @ApiProperty({ example: 'india', description: 'Name of the country' })
  @IsString()
  name: string;

  @ApiProperty({ example: '91', description: 'Phone code of the country' })
  @IsString()
  phoneCode: string;
}


export class ModuleDto {
  @ApiProperty({ example: '67d81eaf100c23377b5aee59', description: 'Unique identifier' })
  @IsString()
  _id: string;

  @ApiProperty({ example: 'AuthController', description: 'Name of the module/controller' })
  @IsString()
  name: string;
}

export class AccessDto {
  @ApiProperty({ example: '67d18a90158ea83b44b76b7b', description: 'Unique identifier for the access record' })
  @IsString()
  _id: string;

  @ApiProperty({ example: '67d17f8b158ea83b44b76b6d', description: 'Role ID associated with the access' })
  @IsString()
  roleId: string;

  @ApiProperty({ example: true, description: 'Read access permission' })
  @IsBoolean()
  readAccess: boolean;

  @ApiProperty({ example: true, description: 'Write access permission' })
  @IsBoolean()
  writeAccess: boolean;

  @ApiProperty({ example: '67d81eaf100c23377b5aee59', description: 'Module ID associated with the access' })
  @IsString()
  module: string;
}

export class ModuleandAccessDto {
  @ApiProperty({ type: ModuleDto, description: 'Module details' })
  module: ModuleDto;

  @ApiProperty({ type: AccessDto, description: 'Access details' })
  access: AccessDto;
}

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty()
  roleName: string;
}


class ModuleUpdateDto {
  @IsString()
  module: string;

  @IsBoolean()
  readAccess: boolean;

  @IsBoolean()
  writeAccess: boolean;
}

export class UpdateRoleAccessDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ModuleUpdateDto)
  updates: ModuleUpdateDto[];
}


class AccessItem {
  @IsString()
  @IsNotEmpty()
  module: string;

  @IsBoolean()
  @IsNotEmpty()
  readAccess: boolean;

  @IsBoolean()
  @IsNotEmpty()
  writeAccess: boolean;
}


export class UpdateAccessDto {
  @ApiProperty({ example: '67d17f8b158ea83b44b76b6d', description: 'Role ID' })
  @IsString()
  roleId: string;

  @ApiProperty({ type: [AccessItem] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccessItem)
  @IsNotEmpty()
  accesses: AccessItem[];

}
