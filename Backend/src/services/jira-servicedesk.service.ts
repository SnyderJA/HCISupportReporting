import BaseService from './base.service';

type PaginationData = {
  start?: number;
  limit?: number;
};

type PaginationResponse = {
  size: number;
  start: number;
  limit: number;
  isLastPage?: boolean;
  _links: {
    next?: string;
    prev?: string;
  };
};

type RequestTypeSearchData = PaginationData & {
  searchQuery?: string;
};

export type RequestTypeData = {
  id: string;
  name: string;
  description: string;
  helpText: string;
};

export type RequestTypeSearchResponse = PaginationResponse & {
  values: RequestTypeData[];
};

export default class JiraServicedeskService extends BaseService {
  private host: string;
  constructor(host: string, email: string, token: string) {
    super();
    this.auth = {
      username: email,
      password: token,
    };
    this.host = host;
  }

  private buildUrl(route: string): string {
    return `${this.host}/rest/servicedeskapi/${route}`;
  }

  listRequestTypes(
    serviceDeskId: string,
    params: RequestTypeSearchData,
  ): Promise<RequestTypeSearchResponse> {
    const url = this.buildUrl(`servicedesk/${serviceDeskId}/requesttype`);
    return this.get({ url, params });
  }
}
