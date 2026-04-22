export const isAdminUser = (user) => {
  if (!user || !user.email) return false;
  return user.email.toLowerCase() === 'jameswurdy@gmail.com';
};

export const requireAdminAccess = (user) => {
  if (!isAdminUser(user)) {
    console.warn(`Access Denied: User ${user?.email || 'Anonymous'} attempted to access admin area.`);
    return false;
  }
  return true;
};