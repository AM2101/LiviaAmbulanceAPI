export enum USER_TYPE {
  ADMIN = 'ADMIN',
  INSURER = 'INSURER',
}

export enum ACCESS_TYPE {
  PARTIAL = 'PARTIAL',
  FULL = 'FULL',
}

export enum ROLE_TYPE_LIVIA_ADMIN {
  MANAGE_USERS = 'MANAGE_USERS',
  MANAGE_INSURANCE_MEMBERS = 'MANAGE_INSURANCE_MEMBERS',
  MANAGE_BUSINESS_PARTNERS = 'MANAGE_BUSINESS_PARTNERS',
  MANAGE_PROVIDERS = 'MANAGE_PROVIDERS',
  MANAGE_SCHEMES = 'MANAGE_SCHEMES',
  MANAGE_POLICIES = 'MANAGE_POLICIES',
  MANAGE_MEMBER_POLICIES = 'MANAGE_MEMBER_POLICIES',
  MANAGE_EXTENDED_BENEFITS = 'MANAGE_EXTENDED_BENEFITS',
  MANAGE_BENEFITS_SUB_BENEFITS = 'MANAGE_BENEFITS_SUB_BENEFITS',
  MANAGE_CLAIMS = 'MANAGE_CLAIMS',
  MANAGE_REPORTS = 'MANAGE_REPORTS',
  MANAGE_SETTINGS = 'MANAGE_SETTINGS',
  MANAGE_SUPPORT = 'MANAGE_SUPPORT',
  MANAGE_LOGS = 'MANAGE_LOGS',
}

// export enum ROLE_TYPE_BUSINESS_PARTNER {
//   MANAGE_USERS = 'MANAGE_USERS',
//   MANAGE_INSURANCE_MEMBERS = 'MANAGE_INSURANCE_MEMBERS',
//   MANAGE_EXTENDED_BENEFITS = 'MANAGE_EXTENDED_BENEFITS',
//   MANAGE_SCHEMES = 'MANAGE_SCHEMES',
//   MANAGE_POLICIES = 'MANAGE_POLICIES',
//   MANAGE_MEMBER_POLICIES = 'MANAGE_MEMBER_POLICIES',
//   MANAGE_CLAIMS = 'MANAGE_CLAIMS',
// }

// export enum LIST_SORT_BY_FIELDS {
//   firstName = 'firstName',
//   lastName = 'lastName',
//   email = 'email',
//   phoneCode = 'phoneCode',
//   phoneNumber = 'phoneNumber',
//   access = 'access',
//   isActive = 'isActive',
//   lastLoginAt = 'lastLoginAt',
//   createdAt = 'createdAt',
//   createdBy = 'createdBy',
//   insuranceCompanyName = 'insuranceCompanyName',
// }

// export enum LIST_SORT_BY_FIELDS_PROVIDER {
//   firstName = 'firstName',
//   lastName = 'lastName',
//   companyName = 'companyName',
//   email = 'email',
//   phoneNumber = 'phoneNumber',
//   addressLine1 = 'addressLine1',
//   addressLine2 = 'addressLine2',
//   state = 'state',
//   city = 'city',
//   postalCode = 'postalCode',
//   country = 'country',
//   createdBy = 'createdBy',
//   createdAt = 'createdAt',
//   totalInsuranceCompaniesLinked = 'totalInsuranceCompaniesLinked',
//   totalIPAllowed = 'totalIPAllowed',
// }

// export enum LIST_SORT_ORDER_TYPE {
//   asc = 'asc',
//   desc = 'desc',
// }

export enum CONFIG_CODE {
  otp = 'otp',
}
