import { Models } from '@rematch/core';

import { storeName as tenantStoreName, tenant } from '@/templates/tenants/tenant.model';
import { storeName as authStoreName, auth } from '@/templates/auth/auth.model';

export interface RootModel extends Models<RootModel> {
  [authStoreName]: typeof auth;
  [tenantStoreName]: typeof tenant;
}

export const models: RootModel = { auth, tenant };
