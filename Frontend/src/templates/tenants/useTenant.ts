import { useSelector } from 'react-redux';

import { tenantConfig } from '@/configs/templates/tenant';
import { RootState } from '@/templates/states/store';
import { TenantConfig } from '@/templates/tenants/tenant';

export const useTenant = () => {
  const tenantId = useSelector((state: RootState) => state.tenant.tenantId);
  return { tenantId, config: getTenantConfig(tenantId || '') };
};

export const getTenantConfig = (tenantId: string): TenantConfig => {
  return tenantConfig[tenantId];
};
