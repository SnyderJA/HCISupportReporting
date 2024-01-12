import { MenuDataItem } from '@ant-design/pro-layout';
import { AxiosRequestHeaders, HeadersDefaults } from 'axios';

export interface AuthConfig {
  TYPE: 'COGNITO' | 'AUTH_UI';
  PUBLIC_PATH_NAMES: string[];
  SERVICES: {
    verifyAuth: () => Promise<AuthUser>;
  };
  COGNITO?: {
    COGNITO_CLIENT_ID: string | undefined;
    COGNITO_SCOPE: string | undefined;
    COGNITO_DOMAIN: string | undefined;
    COGNITO_RESPONSE_TYPE: string | undefined;
  };
  AUTH_UI?: {
    URL: string;
  };
}

export interface MenuDrawerConfig {
  TITLE: string;
  LOGO: string;
  MENU_DATA: MenuDataItem[];
}

export interface APIConfig {
  BASE_URL: string | undefined;
  SERVICES?: {
    setHeaders?: () => any;
  };
}

export interface CrudCardConfig {
  SERVICES?: {
    tableConvertDataResponse: (res: any) => any;
    tableConvertPaginationParam?: (page: number, pageSize: number) => any;
  };
}

interface ComponentsConfig {
  DEFAULT_PROPS: {
    UploadSingleFileAjax: {
      service: any;
    };
    UploadMultipleFileAjax: {
      service: any;
    };
    UploadFileAjax?: {
      service: any;
    };
  };
}

export interface TenantConfig {
  MENU_DRAWER: MenuDrawerConfig;
  API: APIConfig;
  AUTH: AuthConfig;
  CRUD_CARD: CrudCardConfig;
  COMPONENTS: ComponentsConfig;
}
