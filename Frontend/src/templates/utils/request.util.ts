import { axios } from '@/templates/utils/axios.util';
import { AxiosRequestConfig } from 'axios';
import qs from 'qs';

export type RequestParams = AxiosRequestConfig;

export const request = async ({
  url = '',
  method = 'get',
  params = {},
  data,
  headers = {},
  ...props
}: RequestParams) => {
  const fixedParams = Object.keys(params).reduce((obj, key) => {
    if (params[key] !== undefined) {
      obj[key] = params[key];
    }
    return obj;
  }, {} as any);
  try {
    const result = await axios({
      url,
      method,
      data,
      params: fixedParams,
      headers: {
        // Accept: 'application/json',
        // 'Content-Type': 'application/json',
        ...headers,
      },
      ...props,
      paramsSerializer: (params) => {
        return qs.stringify(params, { indices: false });
      },
    });
    return [undefined, result];
  } catch (err: any) {
    const { response } = err;
    return [err, null];
  }
};
