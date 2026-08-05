const SYSTEM_TEMPLATES = {
  welcome: {
    title: 'Welcome to Orpind!',
    message: 'Welcome aboard, {{firstName}}! Your account has been created successfully. Explore our collection of finest organic spices.',
  },
  emailVerification: {
    title: 'Verify Your Email',
    message: 'Hi {{firstName}}, please verify your email address to activate your Orpind account.',
  },
  passwordReset: {
    title: 'Password Reset Request',
    message: 'Hi {{firstName}}, we received a request to reset your password. The link will expire in 1 hour.',
  },
  passwordChanged: {
    title: 'Password Changed',
    message: 'Your password has been updated successfully. If you did not make this change, please contact support immediately.',
  },
  accountDeactivated: {
    title: 'Account Deactivated',
    message: 'Your Orpind account has been deactivated. Contact support if you would like to reactivate.',
  },
  profileUpdated: {
    title: 'Profile Updated',
    message: 'Your profile information has been updated successfully.',
  },
  securityAlert: {
    title: 'Security Alert',
    message: 'A new login was detected on your Orpind account from {{device}}. If this was not you, please change your password immediately.',
  },
  maintenance: {
    title: 'Scheduled Maintenance',
    message: 'Orpind will undergo scheduled maintenance on {{maintenanceDate}}. Some services may be temporarily unavailable.',
  },
};

const DEFAULT_SYSTEM_TEMPLATE = {
  title: 'System Notification',
  message: '{{message}}',
};

export function getSystemTemplate(type = 'general', data = {}) {
  const template = SYSTEM_TEMPLATES[type] || DEFAULT_SYSTEM_TEMPLATE;
  let title = template.title;
  let message = template.message;

  const allData = { ...data };

  for (const [key, value] of Object.entries(allData)) {
    const placeholder = `{{${key}}}`;
    const safeValue = value === null || value === undefined ? '' : String(value);
    title = title.replaceAll(placeholder, safeValue);
    message = message.replaceAll(placeholder, safeValue);
  }

  const remainingPlaceholders = /\{\{[^}]+\}\}/g;
  title = title.replace(remainingPlaceholders, '');
  message = message.replace(remainingPlaceholders, '');

  return { title, message };
}

export default getSystemTemplate;
