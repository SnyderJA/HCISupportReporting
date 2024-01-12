import baseAxios, { AxiosInstance } from 'axios';

interface BaseAxios extends AxiosInstance {
  setToken?: (data: any) => void;
}

const axios: BaseAxios = baseAxios.create({
  // baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  paramsSerializer: (params) => new URLSearchParams(params).toString(),
});

export { axios };
