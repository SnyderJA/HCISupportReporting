import { AuthUser } from '@/templates/auth/auth';
import { TenantConfig } from '@/templates/tenants/tenant';
import { request } from '@/templates/utils/request.util';

export const tenantConfig: { [key: string]: TenantConfig } = {
  TENANT_CONFIG: {
    MENU_DRAWER: {
      TITLE: 'Admin',
      LOGO: 'https://cdn.pixabay.com/photo/2016/11/30/17/10/web-1873373_1280.png',
      MENU_DATA: [],
    },
    API: {
      BASE_URL: 'https://hcice.agileops.vn',
      SERVICES: {
        setHeaders: () => {
          return '';
          // let ssToken = '';
          // if (typeof window !== 'undefined') {
          //   ssToken = localStorage.getItem('ss_token') || '';
          // }
          // return {
          //   Authorization: `Basic ${ssToken}`,
          // };
        },
      },
    },
    AUTH: {
      TYPE: 'AUTH_UI',
      AUTH_UI: {
        URL: '/login',
      },
      PUBLIC_PATH_NAMES: ['/login'],
      SERVICES: {
        verifyAuth: async (): Promise<AuthUser> => {
          // const [err]: any = await request({ method: 'POST', url: '/api/auth/verify' });
          // if (err) {
          //   throw err;
          // }
          return {
            id: 0,
            email: 'admin',
            name: 'admin',
            avatar: 'https://cdn-icons-png.flaticon.com/512/1077/1077114.png',
            roles: [],
          };
        },
      },
    },
    CRUD_CARD: {
      SERVICES: {
        tableConvertDataResponse: (res: any): any => {
          const [, data] = res;
          return {
            content: data.data.data.content,
            total: data.data.data.totalElements,
          };
        },
        tableConvertPaginationParam: (page, pageSize): any => {
          const offset = (page - 1) * pageSize || 0;
          return {
            offset,
            limit: pageSize,
          };
        },
      },
    },
    COMPONENTS: {
      DEFAULT_PROPS: {
        UploadSingleFileAjax: {
          service: async (file: any) => {
            var formData = new FormData();
            formData.append('file', file);
            const [err, res] = await request({
              url: '/v3/storage/upload',
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: formData,
            });
            return res.data.data.content.key;
          },
        },
        UploadMultipleFileAjax: {
          service: async (file: any) => {
            var formData = new FormData();
            formData.append('file', file);
            const [err, res] = await request({
              url: '/v3/storage/upload',
              method: 'POST',
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              data: formData,
            });
            return res.data.data.content.key;
          },
        },
      },
    },
  },
};
