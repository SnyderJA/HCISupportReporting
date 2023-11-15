import axios, {
  AxiosBasicCredentials,
  AxiosHeaders,
  AxiosRequestConfig,
} from 'axios';
import { AxiosError } from 'axios';
import { AxiosResponse } from 'axios';
import { RawAxiosRequestHeaders } from 'axios';
import { InternalServerErrorException } from 'src/exceptions';

export default class BaseService {
  headers: RawAxiosRequestHeaders | AxiosHeaders;
  auth?: AxiosBasicCredentials;

  constructor() {
    this.headers = {};
  }

  handleResponseSuccess<T = any>(resp: AxiosResponse<T>): T {
    return resp.data;
  }

  handleResponseFailed(resp: AxiosError) {
    const response = resp.response;
    console.log(response.status, response.data);
    throw new InternalServerErrorException();
  }

  async request<T>(
    config: Omit<AxiosRequestConfig<T>, 'headers' | 'auth'>,
  ): Promise<T> {
    config['headers'] = this.headers;
    if (this.auth) config['auth'] = this.auth;
    try {
      const resp = await axios.request<T>(config);

      return this.handleResponseSuccess<T>(resp);
    } catch (e: unknown) {
      const error = e as AxiosError;
      this.handleResponseFailed(error);
    }
  }

  get<T = any>(
    config: Omit<AxiosRequestConfig<T>, 'headers' | 'method'>,
  ): Promise<T> {
    return this.request({ ...config, method: 'GET' });
  }
}
