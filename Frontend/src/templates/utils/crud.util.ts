import { request as requestUtil } from '@/templates/utils/request.util';
import { Method } from 'axios';
// import swaggerJson from './swagger-json.json';

export type Options = {
  convertRequestData?: any;
  convertResponseData?: any;
};

export const request = (method: Method, path: string, options?: Options) => {
  return async (input: any) => {
    if (options && options.convertRequestData) {
      input = options.convertRequestData(input);
    }

    let params = {};
    let data = {};

    if (method.toUpperCase() === 'GET') {
      params = input;
    } else {
      data = input;
    }

    const res = await requestUtil({
      url: path,
      method: method,
      params,
      data,
    });

    if (options && options.convertResponseData) {
      return options.convertResponseData(res[1].data.data);
    }
    return res;
  };
};
