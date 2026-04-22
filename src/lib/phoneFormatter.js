export const formatPhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return '';
  const cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})?(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    const intlCode = match[1] ? `+${match[1]} ` : '';
    return [intlCode, '(', match[2], ') ', match[3], '-', match[4]].join('');
  }
  return phoneNumberString;
};

export const getPhoneLink = (phoneNumberString) => {
  if (!phoneNumberString) return '#';
  const cleaned = ('' + phoneNumberString).replace(/[^\d+]/g, '');
  return `tel:${cleaned}`;
};

export const getWhatsAppLink = (phoneNumberString) => {
  if (!phoneNumberString) return '#';
  const cleaned = ('' + phoneNumberString).replace(/[^\d]/g, '');
  return `https://wa.me/${cleaned}`;
};

export const validatePhoneNumber = (phoneNumberString) => {
  if (!phoneNumberString) return false;
  const cleaned = ('' + phoneNumberString).replace(/[^\d+]/g, '');
  // Basic validation: at least 10 digits, optional + at start
  return /^\+?\d{10,15}$/.test(cleaned);
};