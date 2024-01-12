import { TenantConfig } from '../tenants/tenant';

const toQuery = (params: any, delimiter = '&'): string => {
  const keys = Object.keys(params);
  return keys.reduce((str, key, index) => {
    let query = `${str}${key}=${params[key]}`;
    if (index < keys.length - 1) {
      query += delimiter;
    }
    return query;
  }, '');
};

export const openAuthUI = (tenantConfig: TenantConfig): void => {
  if (typeof window === 'undefined') return;
  const authConfig = tenantConfig.AUTH;
  const config = {
    COGNITO: () => {
      const { COGNITO_DOMAIN, COGNITO_CLIENT_ID, COGNITO_SCOPE, COGNITO_RESPONSE_TYPE } =
        tenantConfig.AUTH.COGNITO || {};
      const search = toQuery({
        client_id: COGNITO_CLIENT_ID,
        scope: COGNITO_SCOPE,
        redirect_uri: encodeURIComponent(`${window.location.origin}/`),
        response_type: COGNITO_RESPONSE_TYPE,
      });
      return `https://${COGNITO_DOMAIN}/login?${search}`;
    },
    AUTH_UI: () => {
      return authConfig.AUTH_UI?.URL;
    },
  };
  const authPageUrl = config[authConfig.TYPE]() || '';
  window.location.href = authPageUrl;
};
