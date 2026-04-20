import { useAuth } from './useAuth';
import { useConfig } from './useConfig';

export const usePermissions = () => {
  const { user, isAdmin } = useAuth();
  const { config } = useConfig();

  const hasPermission = (permission) => {
    if (!user) return false;
    if (isAdmin) return true;
    const perms = config.rolePermissions[user.role] || [];
    return perms.includes(permission);
  };

  return { hasPermission, isAdmin, userRole: user?.role };
};