import { getTenantConfig } from '@/templates/tenants/useTenant';
import { TenantConfig } from '@/templates/tenants/tenant';
import { createModel } from '@rematch/core';
import produce from 'immer';

import { RootModel } from '@/templates/states/models';

export const storeName = 'tenant';

export interface TenantStateType {
  tenantId: string | null;
  tenantConfig: TenantConfig | null;
}

export const initialState: TenantStateType = {
  tenantId: null,
  tenantConfig: null,
};

export const tenant = createModel<RootModel>()({
  name: storeName,
  state: initialState,
  reducers: {
    setTenantId: produce((state, tenantId: string | null) => {
      state.tenantId = tenantId;
      state.tenantConfig = tenantId ? getTenantConfig(tenantId) : null;
    }),
  },
});
