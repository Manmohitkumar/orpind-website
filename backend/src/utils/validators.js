const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPhone = (phone, country = 'IN') => {
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  if (country === 'IN') {
    const indianPhoneRegex = /^[6-9]\d{9}$/;
    return indianPhoneRegex.test(cleaned);
  }
  if (country === 'US') {
    const usPhoneRegex = /^1?[2-9]\d{9}$/;
    return usPhoneRegex.test(cleaned);
  }
  const generalPhoneRegex = /^\+?[1-9]\d{6,14}$/;
  return generalPhoneRegex.test(cleaned);
};

const isValidPincode = (pincode) => {
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  return pincodeRegex.test(String(pincode));
};

const isValidGSTIN = (gstin) => {
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  return gstinRegex.test(gstin);
};

const isValidPAN = (pan) => {
  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  return panRegex.test(pan);
};

const sanitizeString = (str) => {
  if (typeof str !== 'string') return '';
  return str.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, '').trim();
};

const truncate = (str, length) => {
  if (!str || typeof str !== 'string') return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
};

export { isValidEmail, isValidPhone, isValidPincode, isValidGSTIN, isValidPAN, sanitizeString, truncate };
