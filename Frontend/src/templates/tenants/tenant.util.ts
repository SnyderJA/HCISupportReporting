import { tenantConfig } from '@/configs/templates/tenant';
import { axios } from '../utils/axios.util';

export const initialTenantState = (pageProps: any) => {
  let tenantId: string = '';
  if (tenantConfig.TENANT_CONFIG) {
    tenantId = 'TENANT_CONFIG';
  } else {
    let host = pageProps.host;
    if (!host && typeof window !== 'undefined') {
      // Trying to get tenant on client side
      host = window.location.hostname;
    }
    if (host) {
      tenantId = host;
    }
  }
  const tenant = tenantConfig[tenantId];
  if (tenant && tenant.API) {
    axios.defaults.baseURL = tenant.API.BASE_URL;
    if (tenant.API.SERVICES?.setHeaders) {
      axios.defaults.headers = tenant.API.SERVICES.setHeaders();
    }
  }
  return { tenant, tenantId };
};
