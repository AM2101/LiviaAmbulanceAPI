// export enum Status {
//   ACTIVE = 'ACTIVE',
//   INACTIVE = 'INACTIVE',
// }

// export enum Gender {
//   ALL = 'ALL',
//   MALE = 'MALE',
//   FEMALE = 'FEMALE',
//   OTHER = 'OTHER',
// }

// export enum RelationshipType {
//   SELF = 'SELF',
//   SPOUSE = 'SPOUSE',
//   CHILD = 'CHILD',
//   DEPENDENT = 'DEPENDENT',
// }

// export enum PolicyStatus {
//   ACTIVE = 'ACTIVE',
//   HOLD = 'HOLD',
//   EXPIRED = 'EXPIRED',
//   TERMINATED = 'TERMINATED',
// }

// export enum PolicyType {
//   CORPORATE = 'CORPORATE',
//   INDIVIDUAL = 'INDIVIDUAL',
//   ENTERPRISE = 'ENTERPRISE',
// }

// export enum BenefitType {
//   INPATIENT = 'INPATIENT',
//   OUTPATIENT = 'OUTPATIENT',
//   ALL = 'ALL',
// }

// export enum BenefitStatus {
//   ACTIVE = 'ACTIVE',
//   INACTIVE = 'INACTIVE',
// }

// export enum BenefitShared {
//   INDIVIDUAL = 'INDIVIDUAL',
//   'FAMILY SHARED' = 'FAMILY SHARED',
// }

// export enum BenefitRelation {
//   SELF = 'SELF',
//   SPOUSE = 'SPOUSE',
//   CHILD = 'CHILD',
//   DEPENDENT = 'DEPENDENT',
// }

// export enum SubBenefitType {
//   INPATIENT = 'INPATIENT',
//   OUTPATIENT = 'OUTPATIENT',
//   ALL = 'ALL',
// }

// export enum SubBenefitShared {
//   INDIVIDUAL = 'INDIVIDUAL',
//   'FAMILY SHARED' = 'FAMILY SHARED',
// }

// export enum SubBenefitRelation {
//   SELF = 'SELF',
//   SPOUSE = 'SPOUSE',
//   CHILD = 'CHILD',
//   DEPENDENT = 'DEPENDENT',
// }

// export enum InvoiceStatus {
//   'Loaded' = 'Loaded',
//   'QA' = 'QA',
//   'Paid' = 'Paid',
//   'Declined' = 'Declined',
//   'Paid to Zero' = 'Paid to Zero',
//   'Partial Paid' = 'Partial Paid',
//   'Duplicate' = 'Duplicate',
// }

// export enum USER_TYPE {
//   ADMIN = 'ADMIN',
//   INSURER = 'INSURER',
// }

// export enum ACCESS_TYPE {
//   PARTIAL = 'PARTIAL',
//   FULL = 'FULL',
// }

// export enum ROLE_TYPE_LIVIA_ADMIN {
//   MANAGE_USERS = 'MANAGE_USERS',
//   MANAGE_INSURANCE_MEMBERS = 'MANAGE_INSURANCE_MEMBERS',
//   MANAGE_BUSINESS_PARTNERS = 'MANAGE_BUSINESS_PARTNERS',
//   MANAGE_PROVIDERS = 'MANAGE_PROVIDERS',
//   MANAGE_SCHEMES = 'MANAGE_SCHEMES',
//   MANAGE_POLICIES = 'MANAGE_POLICIES',
//   MANAGE_MEMBER_POLICIES = 'MANAGE_MEMBER_POLICIES',
//   MANAGE_EXTENDED_BENEFITS = 'MANAGE_EXTENDED_BENEFITS',
//   MANAGE_BENEFITS_SUB_BENEFITS = 'MANAGE_BENEFITS_SUB_BENEFITS',
//   MANAGE_CLAIMS = 'MANAGE_CLAIMS',
//   MANAGE_REPORTS = 'MANAGE_REPORTS',
//   MANAGE_SETTINGS = 'MANAGE_SETTINGS',
//   MANAGE_SUPPORT = 'MANAGE_SUPPORT',
//   MANAGE_LOGS = 'MANAGE_LOGS',
// }

// export enum ROLE_TYPE_BUSINESS_PARTNER {
//   MANAGE_USERS = 'MANAGE_USERS',
//   MANAGE_INSURANCE_MEMBERS = 'MANAGE_INSURANCE_MEMBERS',
//   MANAGE_SCHEMES = 'MANAGE_SCHEMES',
//   MANAGE_POLICIES = 'MANAGE_POLICIES',
//   MANAGE_MEMBER_POLICIES = 'MANAGE_MEMBER_POLICIES',
//   MANAGE_CLAIMS = 'MANAGE_CLAIMS',
// }

// export enum LINE_ITEMS_TYPE {
//   'Prescription' = 'Prescription',
//   'Procedure' = 'Procedure',
//   'Lab Test' = 'Lab Test',
//   'Imaging' = 'Imaging',
//   'Consultation' = 'Consultation',
//   'Optical' = 'Optical',
//   'Other Charges' = 'Other Charges',
// }

export enum OTP_MODE {
  ALL = 'ALL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
}

export enum OTP_TYPE {
  LOGIN = 'LOGIN',
  FORGOT = 'FORGOT',
}
