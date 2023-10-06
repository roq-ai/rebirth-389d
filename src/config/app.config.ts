interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
  ownerAbilities: string[];
  customerAbilities: string[];
  getQuoteUrl: string;
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['HOSPITAL ADMIN'],
  customerRoles: [],
  tenantRoles: [
    'HOSPITAL ADMIN',
    'MEDICAL STAFF',
    'NURSE STAFF',
    'GENERAL PRACTITIONER',
    'SUPER ADMIN',
    'CAREGIVER',
    'MONITORING',
    'Patient',
  ],
  tenantName: 'Hospital',
  applicationName: 'Rebirth',
  addOns: ['file upload', 'chat', 'notifications', 'file'],
  customerAbilities: [],
  ownerAbilities: [
    'Manage patient records',
    'Manage hospital information',
    'Manage healthcare meetings',
    'Manage notifications',
  ],
  getQuoteUrl: 'https://app.roq.ai/proposal/204cc5cf-99b4-49b1-96f2-aa9ffef54fe4',
};
