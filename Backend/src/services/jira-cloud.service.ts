import BaseService from './base.service';

type PaginationData = {
  startAt?: number;
  maxResults?: number;
};

type PaginationResponse = {
  startAt: number;
  maxResults: number;
  total: number;
};

type IssueSearchData = PaginationData & {
  jql: string;
  fields?: string;
};

type UserSearchData = PaginationData & {
  projectKeys: string;
  query?: string;
};

export type IssueData = {
  id: string;
  key: string;
  fields: Record<string, any>;
};

type IssueSearchResponse = PaginationResponse & {
  issues: IssueData[];
};

export type UserData = {
  accountId: string;
  displayName: string;
  timeZone: string;
};

export type UsersSearchResponse = UserData[];

export default class JiraCloudService extends BaseService {
  private host: string;
  constructor(host: string, email: string, token: string) {
    super();
    this.auth = {
      username: email,
      password: token,
    };
    this.host = host;
  }

  private buildUrl(route: string, version = 2): string {
    return `${this.host}/rest/api/${version}/${route}`;
  }

  searchIssues(data: IssueSearchData): Promise<IssueSearchResponse> {
    const url = this.buildUrl('search');
    const params = data;
    return this.get({ url, params });
  }

  listUsersAssignable(data: UserSearchData): Promise<UsersSearchResponse> {
    const url = this.buildUrl('user/assignable/multiProjectSearch');
    const params = data;
    return this.get({ url, params });
  }

  getCurrentUser(): Promise<UserData> {
    const url = this.buildUrl('myself', 3);

    return this.get({ url });
  }
}
