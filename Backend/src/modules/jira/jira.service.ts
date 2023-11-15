import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import JiraCloudService, {
  IssueData,
  UsersSearchResponse,
} from 'src/services/jira-cloud.service';
import {
  UserParamsDto,
  type DateDto,
  AgentStatusRequestDto,
  AgentStatusDto,
} from './jira.dto';
import JiraServicedeskService, {
  RequestTypeData,
} from 'src/services/jira-servicedesk.service';
import { format, toDate, utcToZonedTime } from 'date-fns-tz';
import { AGENT_STATUS_REPOSITORY } from 'src/constants/repository.constants';
import { AgentStatus } from 'src/entities/agent.entity';
import { Transaction } from 'sequelize';
import { startOfDay } from 'date-fns';
import {
  START_STATUS_OF_EACH_WORKFLOW,
  SUPPORT_PERCENTAGE_ENUM,
  THRESHOLD,
} from 'src/constants';

type UserData = {
  accountId: string;
  displayName: string;
};

export type AverageData = UserData & {
  average: number;
  jiraLink: string;
};

export type AverageDataByDate = {
  date: string;
  average: number;
  jiraLink: string;
};

export type CountData = UserData & {
  totalBreached: number;
  totalCompleted: number;
  jiraLink: string;
};

type DateDtoWithTZ = DateDto & {
  jiraTZ?: string;
  clientTZ?: string;
};

export type CountDataByDate = {
  date: string;
  totalBreached: number;
  totalCompleted: number;
  jiraLink: string;
};

type ListSLAParams = DateDtoWithTZ & {
  slaFieldName: string;
  slaFieldKey: string;
};

type ListIssuesParams = DateDtoWithTZ;

export type AgentStatusResponse = {
  agentId: string;
  agentName: string;
  supportPercentage: SUPPORT_PERCENTAGE_ENUM | null;
  projectPercentage: number | null;
  projectEndDate?: Date | null;
  defaultToSupport?: boolean | null;
  includeInReport?: boolean | null;
};

export type TicketThroughputData = UserData & {
  scale: number;
  totalIssues: number;
  totalOpenIssues: number;
  countOfDaysUnderThreshold: number;
  totalCompleteIssues: number;
  jiraLink: string;
};

@Injectable()
export class JiraService {
  private readonly jiraCloudService: JiraCloudService;
  private readonly jiraServiceDeskService: JiraServicedeskService;
  constructor(
    private readonly configService: ConfigService,
    @Inject(AGENT_STATUS_REPOSITORY)
    private readonly agentStatusRepository: typeof AgentStatus,
  ) {
    this.jiraCloudService = new JiraCloudService(
      configService.get<string>('app.jiraHost'),
      configService.get<string>('app.jiraEmail'),
      configService.get<string>('app.jiraApiToken'),
    );

    this.jiraServiceDeskService = new JiraServicedeskService(
      configService.get<string>('app.jiraHost'),
      configService.get<string>('app.jiraEmail'),
      configService.get<string>('app.jiraApiToken'),
    );
  }

  handleDateClientToJira(
    value: string,
    jiraTZ?: string,
    clientTZ?: string,
  ): string {
    const utcDate = toDate(value, { timeZone: clientTZ });
    const jiraDate = utcToZonedTime(utcDate, jiraTZ);

    return format(jiraDate, 'yyyy-MM-dd HH:mm', { timeZone: jiraTZ });
  }

  handleDateJiraToClient(
    value: string,
    jiraTZ?: string,
    clientTZ?: string,
  ): string {
    const utcDate = toDate(value, { timeZone: jiraTZ });
    const jiraDate = utcToZonedTime(utcDate, clientTZ);
    return format(jiraDate, 'yyyy-MM-dd HH:mm', { timeZone: clientTZ });
  }

  private buildJiraLink(jql: string): string {
    return `https://hcice.atlassian.net/issues/?jql=${decodeURIComponent(jql)}`;
  }

  private async getAllIssues(
    jql: string,
    fields?: string,
  ): Promise<IssueData[]> {
    let startAt = 0;
    let maxResults = 100;
    const expectedData: IssueData[] = [];
    while (true) {
      const result = await this.jiraCloudService.searchIssues({
        jql,
        fields,
        startAt,
      });
      const issues = result.issues;
      if (!issues || !issues.length) {
        break;
      }
      expectedData.push(...issues);
      maxResults = result.maxResults;
      startAt += maxResults;
    }

    return expectedData;
  }

  private listSLACompleted({
    slaFieldName,
    slaFieldKey,
    startDate,
    endDate,
    accountId,
    requestTypeName,
    jiraTZ,
    clientTZ,
  }: ListSLAParams): Promise<IssueData[]> {
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    const newStartDate = this.handleDateClientToJira(
      startDate,
      jiraTZ,
      clientTZ,
    );
    const newEndDate = this.handleDateClientToJira(endDate, jiraTZ, clientTZ);
    let jql = `project = ${projectKey} and "${slaFieldName}" = completed() and createdDate >= "${newStartDate}" and createdDate <= "${newEndDate}"`;
    if (accountId) {
      jql += ` and assignee = "${accountId}"`;
    }
    if (requestTypeName) {
      jql += ` and "Request Type" in ('${requestTypeName.join("','")}')`;
    }

    jql += ' order by created ASC';

    const fields = `${slaFieldKey},assignee,created`;
    return this.getAllIssues(jql, fields);
  }

  private listSLACompletedOrBreached({
    slaFieldName,
    slaFieldKey,
    startDate,
    endDate,
    accountId,
    requestTypeName,
    jiraTZ,
    clientTZ,
  }: ListSLAParams): Promise<IssueData[]> {
    const newStartDate = this.handleDateClientToJira(
      startDate,
      jiraTZ,
      clientTZ,
    );
    const newEndDate = this.handleDateClientToJira(endDate, jiraTZ, clientTZ);
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    let jql = `project = ${projectKey} and ("${slaFieldName}" = completed() or "${slaFieldName}" = breached() ) and createdDate >= "${newStartDate}" and createdDate <= "${newEndDate}"`;
    if (accountId) {
      jql += ` and assignee = "${accountId}"`;
    }
    if (requestTypeName) {
      jql += ` and "Request Type" in ('${requestTypeName.join("','")}')`;
    }
    jql += ' order by created ASC';

    const fields = `${slaFieldKey},assignee,created`;
    return this.getAllIssues(jql, fields);
  }

  private listIssues({
    startDate,
    endDate,
    accountId,
    requestTypeName,
    jiraTZ,
    clientTZ,
  }: ListIssuesParams): Promise<IssueData[]> {
    const newStartDate = this.handleDateClientToJira(
      startDate,
      jiraTZ,
      clientTZ,
    );
    const newEndDate = this.handleDateClientToJira(endDate, jiraTZ, clientTZ);
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    let jql = `project = ${projectKey} and createdDate >= "${newStartDate}" and createdDate <= "${newEndDate}"`;
    if (accountId) {
      jql += ` and assignee = "${accountId}"`;
    }
    if (requestTypeName) {
      jql += ` and "Request Type" in ('${requestTypeName.join("','")}')`;
    }

    jql += ' order by created ASC';

    const fields = `assignee,created,resolution,status`;
    return this.getAllIssues(jql, fields);
  }

  private async averageSLATime(params: ListSLAParams): Promise<AverageData[]> {
    const { slaFieldKey } = params;
    const issues = await this.listSLACompleted(params);
    const expectedData = {};
    issues.map((item) => {
      const fields = item.fields;
      const assignee = fields.assignee;
      if (!assignee) return;
      const accountId = assignee.accountId;

      if (!expectedData[accountId]) {
        expectedData[accountId] = {
          accountId,
          displayName: assignee.displayName,
          totalTime: 0,
          total: 0,
        };
      }
      const sla = fields[slaFieldKey];

      const completedCycles = sla.completedCycles[0];
      const elapsedTime = completedCycles.elapsedTime;
      const millis = elapsedTime.millis as number;

      expectedData[accountId].totalTime += millis;
      expectedData[accountId].total += 1;
    });

    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    return Object.keys(expectedData).map((item): AverageData => {
      const average = expectedData[item].totalTime / expectedData[item].total;

      const accountId = expectedData[item].accountId;
      let jql = `project = ${projectKey} and "${params.slaFieldName}" = completed() and assignee = ${accountId} and createdDate >= "${params.startDate}" and createdDate <= "${params.endDate}"`;
      if (params.requestTypeName) {
        jql += ` and "Request Type" in ('${params.requestTypeName.join(
          "','",
        )}')`;
      }
      return {
        accountId: accountId,
        displayName: expectedData[item].displayName,
        average,
        jiraLink: this.buildJiraLink(jql),
      };
    });
  }

  private async averageSLATimeByDate(
    params: ListSLAParams,
  ): Promise<AverageDataByDate[]> {
    const { slaFieldKey } = params;
    const issues = await this.listSLACompleted(params);

    const expectedData = {};
    issues.map((item) => {
      const fields = item.fields;
      const created = fields.created;
      const newCreated = this.handleDateJiraToClient(
        created,
        params.jiraTZ,
        params.clientTZ,
      );
      const createdDate = newCreated.split(' ')[0];
      if (!expectedData[createdDate]) {
        expectedData[createdDate] = {
          totalTime: 0,
          total: 0,
        };
      }
      const sla = fields[slaFieldKey];

      const completedCycles = sla.completedCycles[0];
      const elapsedTime = completedCycles.elapsedTime;
      const millis = elapsedTime.millis as number;

      expectedData[createdDate].totalTime += millis;
      expectedData[createdDate].total += 1;
    });
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    return Object.keys(expectedData).map((item): AverageDataByDate => {
      const average = expectedData[item].totalTime / expectedData[item].total;
      const nextDate = new Date(item);
      nextDate.setDate(nextDate.getDate() + 1);

      let jql = `project = ${projectKey} and "${
        params.slaFieldName
      }" = completed() and createdDate >= "${item}" and createdDate <= "${format(
        nextDate,
        'yyyy-MM-dd',
      )}"`;
      if (params.requestTypeName) {
        jql += ` and "Request Type" in ('${params.requestTypeName.join(
          "','",
        )}')`;
      }
      if (params.accountId) {
        jql += ` and assignee = "${params.accountId}"`;
      }
      return {
        date: item,
        average,
        jiraLink: this.buildJiraLink(jql),
      };
    });
  }

  private async countSLABreachedAndCompleted(
    params: ListSLAParams,
  ): Promise<CountData[]> {
    const { slaFieldKey } = params;
    const issues = await this.listSLACompletedOrBreached(params);
    const expectedData: Record<string, CountData> = {};
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    issues.map((item) => {
      const fields = item.fields;
      const assignee = fields.assignee;
      if (!assignee) return;
      const accountId = assignee.accountId;
      if (!expectedData[accountId]) {
        let jql = `project = ${projectKey} and ("${params.slaFieldName}" = completed() or "${params.slaFieldName}" = breached() ) and assignee = ${accountId} and createdDate >= "${params.startDate}" and createdDate <= "${params.endDate}"`;
        if (params.requestTypeName) {
          jql += ` and "Request Type" in ('${params.requestTypeName.join(
            "','",
          )}')`;
        }
        expectedData[accountId] = {
          accountId,
          displayName: assignee.displayName,
          totalBreached: 0,
          totalCompleted: 0,
          jiraLink: this.buildJiraLink(jql),
        };
      }
      const sla = fields[slaFieldKey];

      const completedCycles = sla.completedCycles[0];
      const ongoingCycle = sla.ongoingCycle;
      const breached = completedCycles?.breached;
      if (ongoingCycle || breached) {
        expectedData[accountId].totalBreached += 1;
      } else {
        expectedData[accountId].totalCompleted += 1;
      }
    });

    return Object.values(expectedData);
  }

  private async countSLABreachedAndCompletedByDate(
    params: ListSLAParams,
  ): Promise<CountDataByDate[]> {
    const { slaFieldKey } = params;
    const issues = await this.listSLACompletedOrBreached(params);
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    const expectedData: Record<string, CountDataByDate> = {};

    issues.map((item) => {
      const fields = item.fields;
      const created = fields.created;
      const newCreated = this.handleDateJiraToClient(
        created,
        params.jiraTZ,
        params.clientTZ,
      );
      const createdDate = newCreated.split(' ')[0];
      if (!expectedData[createdDate]) {
        const nextDate = new Date(createdDate);
        nextDate.setDate(nextDate.getDate() + 1);
        let jql = `project = ${projectKey} and ("${
          params.slaFieldName
        }" = completed() or "${
          params.slaFieldName
        }" = breached() ) and createdDate >= "${createdDate}" and createdDate <= "${format(
          nextDate,
          'yyyy-MM-dd',
        )}"`;

        if (params.requestTypeName) {
          jql += ` and "Request Type" in ('${params.requestTypeName.join(
            "','",
          )}')`;
        }
        if (params.accountId) {
          jql += ` and assignee = "${params.accountId}"`;
        }
        expectedData[createdDate] = {
          date: createdDate,
          totalBreached: 0,
          totalCompleted: 0,
          jiraLink: this.buildJiraLink(jql),
        };
      }
      const sla = fields[slaFieldKey];

      const completedCycles = sla.completedCycles[0];
      const ongoingCycle = sla.ongoingCycle;
      const breached = completedCycles?.breached;
      if (ongoingCycle || breached) {
        expectedData[createdDate].totalBreached += 1;
      } else {
        expectedData[createdDate].totalCompleted += 1;
      }
    });

    return Object.values(expectedData);
  }

  averageTimeToFirstResponse(params: DateDtoWithTZ): Promise<AverageData[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToFirstResponseKey',
    );
    const fieldName = 'Time to first response';
    return this.averageSLATime({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  averageTimeToSolution(params: DateDtoWithTZ): Promise<AverageData[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToSolutionKey',
    );
    const fieldName = 'Time to resolution';
    return this.averageSLATime({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  countTimeToFirstResponse(params: DateDtoWithTZ): Promise<CountData[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToFirstResponseKey',
    );
    const fieldName = 'Time to first response';
    return this.countSLABreachedAndCompleted({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  countTimeToSolution(params: DateDtoWithTZ): Promise<CountData[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToSolutionKey',
    );
    const fieldName = 'Time to resolution';
    return this.countSLABreachedAndCompleted({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  averageTimeToFirstResponseByDate(
    params: DateDtoWithTZ,
  ): Promise<AverageDataByDate[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToFirstResponseKey',
    );
    const fieldName = 'Time to first response';
    return this.averageSLATimeByDate({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  averageTimeToSolutionByDate(
    params: DateDtoWithTZ,
  ): Promise<AverageDataByDate[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToSolutionKey',
    );
    const fieldName = 'Time to resolution';
    return this.averageSLATimeByDate({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  countTimeToFirstResponseByDate(
    params: DateDtoWithTZ,
  ): Promise<CountDataByDate[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToFirstResponseKey',
    );
    const fieldName = 'Time to first response';
    return this.countSLABreachedAndCompletedByDate({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  countTimeToSolutionByDate(params: DateDtoWithTZ): Promise<CountDataByDate[]> {
    const fieldKey = this.configService.get<string>(
      'app.jiraTimeToSolutionKey',
    );
    const fieldName = 'Time to resolution';
    return this.countSLABreachedAndCompletedByDate({
      slaFieldName: fieldName,
      slaFieldKey: fieldKey,
      ...params,
    });
  }

  listUsersOfProject(params: UserParamsDto): Promise<UsersSearchResponse> {
    const projectKeys = this.configService.get<string>('app.jiraProjectKey');
    return this.jiraCloudService.listUsersAssignable({
      ...params,
      projectKeys,
    });
  }

  async listAllUsersOfProject(): Promise<UsersSearchResponse> {
    const projectKeys = this.configService.get<string>('app.jiraProjectKey');
    let startAt = 0;
    const maxResults = 50;
    const expectedData: UsersSearchResponse = [];
    while (true) {
      const result = await this.jiraCloudService.listUsersAssignable({
        startAt,
        maxResults,
        projectKeys,
      });

      if (!result || !result.length) {
        break;
      }
      expectedData.push(...result);

      startAt += maxResults;
    }

    return expectedData;
  }

  async listRequestTypesOfProject(): Promise<RequestTypeData[]> {
    const serviceDeskId = this.configService.get<string>(
      'app.jiraServiceDeskId',
    );
    const expectedData: RequestTypeData[] = [];
    const limit = 5;
    let nextUrl = null;
    while (true) {
      let result;
      if (nextUrl) {
        result = await this.jiraServiceDeskService.get({ url: nextUrl });
      } else {
        const params = {
          start: 0,
          limit,
        };
        result = await this.jiraServiceDeskService.listRequestTypes(
          serviceDeskId,
          params,
        );
      }
      const values = result.values;
      if (!values || !values.length) {
        break;
      }

      expectedData.push(
        ...values.filter((item) => item.name !== 'Application Support'),
      );
      const next = result._links?.next;
      if (!next) break;
      nextUrl = next;
    }
    return expectedData;
  }

  getExpectedTarget(percentage: SUPPORT_PERCENTAGE_ENUM) {
    if (percentage === SUPPORT_PERCENTAGE_ENUM['SEVENT-FIVE']) {
      return {
        high: 12,
        medium: 8,
        low: 4,
      };
    }
    if (percentage === SUPPORT_PERCENTAGE_ENUM['A-HALF']) {
      return {
        high: 9,
        medium: 5,
        low: 2,
      };
    }
    if (percentage === SUPPORT_PERCENTAGE_ENUM['TWO-FIVE']) {
      return {
        high: 5,
        medium: 3,
        low: 1,
      };
    }
    if (percentage === SUPPORT_PERCENTAGE_ENUM.FULL) {
      return {
        high: 16,
        medium: 12,
        low: 6,
      };
    }
    return null;
  }

  async ticketThroughput(
    params: DateDtoWithTZ,
  ): Promise<TicketThroughputData[]> {
    const agents = await this.listAllAgentStatus();

    const issues = await this.listIssues(params);
    const expectedData = {};
    const listDate: Record<string, string[]> = {};
    issues.map((item) => {
      const fields = item.fields;

      const assignee = fields.assignee;
      if (!assignee) return;
      const accountId = assignee.accountId;
      const created = fields.created;
      const newCreated = this.handleDateJiraToClient(
        created,
        params.jiraTZ,
        params.clientTZ,
      );
      const createdDate = newCreated.split(' ')[0];
      if (!expectedData[accountId]) {
        expectedData[accountId] = {
          accountId,
          displayName: assignee.displayName,
          total: 0,
          totalIssues: 0,
          totalOpenIssues: 0,
          totalCompleteIssue: 0,
          totalCompleteIssueByDate: {},
        };
      }
      expectedData[accountId].totalIssues += 1;
      if (fields.resolution?.name === 'Done') {
        expectedData[accountId].totalCompleteIssue += 1;
        if (!expectedData[accountId].totalCompleteIssueByDate?.[createdDate]) {
          expectedData[accountId].totalCompleteIssueByDate[createdDate] = 0;
        }
        expectedData[accountId].totalCompleteIssueByDate[createdDate] += 1;
      }
      if (START_STATUS_OF_EACH_WORKFLOW.includes(fields.status.name)) {
        expectedData[accountId].totalOpenIssues += 1;
      }
      if (!listDate[accountId]) {
        listDate[accountId] = [];
      }
      if (!listDate[accountId].includes(createdDate)) {
        expectedData[accountId].total += 1;
        listDate[accountId].push(createdDate);
      }
    });
    const projectKey = this.configService.get<string>('app.jiraProjectKey');
    const expected: TicketThroughputData[] = [];

    Object.keys(expectedData).map((item): TicketThroughputData => {
      const averageIssues =
        expectedData[item].totalIssues / expectedData[item].total;
      const averageCompleteIssues =
        expectedData[item].totalCompleteIssue / expectedData[item].total;
      const averageOpenIssues =
        expectedData[item].totalOpenIssues / expectedData[item].total;
      const accountId = expectedData[item].accountId;

      const countOfDaysUnderThreshold = Object.values(
        expectedData[item].totalCompleteIssueByDate,
      ).filter((value: number) => value < THRESHOLD).length;

      const agent = agents[accountId];

      if (agent && !agent.includeInReport) {
        return null;
      }
      const target = this.getExpectedTarget(agent?.supportPercentage);

      let scale = 0;
      if (target === null) {
        scale = 0;
      } else if (averageIssues <= 5) {
        if (averageIssues > 2) scale = 2;
        else scale = 3;
      } else {
        if (averageCompleteIssues >= target.high) scale = 3;
        else if (averageCompleteIssues >= target.medium) scale = 2;
        else if (averageCompleteIssues >= target.low) scale = 1;
      }
      let jql = `project = ${projectKey} and createdDate >= "${params.startDate}" and createdDate <= "${params.endDate}" and assignee = "${accountId}"`;

      if (params.requestTypeName) {
        jql += ` and "Request Type" in ('${params.requestTypeName.join(
          "','",
        )}')`;
      }
      expected.push({
        accountId: accountId,
        displayName: expectedData[item].displayName,
        scale,
        totalIssues: averageIssues,
        totalOpenIssues: averageOpenIssues,
        totalCompleteIssues: averageCompleteIssues,
        jiraLink: this.buildJiraLink(jql),
        countOfDaysUnderThreshold: countOfDaysUnderThreshold,
      });
    });
    return expected;
  }

  async listAllAgentStatus(): Promise<Record<string, AgentStatus>> {
    const data = await this.agentStatusRepository.findAll();
    const expectedData: Record<string, AgentStatus> = {};
    const startDate = startOfDay(new Date());
    for (const item of data) {
      let newItem = item;

      if (
        item.defaultToSupport &&
        startOfDay(new Date(item.projectEndDate)) <= startDate &&
        item.supportPercentage !== 100
      ) {
        newItem = await this.updateAgentStatus(item, {
          ...item,
          supportPercentage: 100,
          projectPercentage: 0,
        });
      }
      expectedData[newItem.agentId] = newItem.dataValues;
    }

    return expectedData;
  }

  async listAllAgentStatusIncludeJiraUser(): Promise<AgentStatusResponse[]> {
    const agentStatus = await this.listAllAgentStatus();
    const dataAgents = await this.listAllUsersOfProject();
    return dataAgents.map((item) => {
      const { accountId, displayName } = item;
      if (agentStatus[accountId]) return agentStatus[accountId];
      return {
        agentId: accountId,
        agentName: displayName,
        supportPercentage: SUPPORT_PERCENTAGE_ENUM.FULL,
        projectPercentage: 0,
        projectEndDate: null,
        includeInReport: true,
        defaultToSupport: false,
      };
    });
  }

  getAgentStatusByAgentId(agentId: string): Promise<AgentStatus | null> {
    return this.agentStatusRepository.findOne({
      where: {
        agentId,
      },
    });
  }

  createAgentStatus(
    data: AgentStatusDto,
    t?: Transaction,
  ): Promise<AgentStatus> {
    return this.agentStatusRepository.create(data, { transaction: t });
  }

  async updateAgentStatus(
    agentStatus: AgentStatus,
    data: AgentStatusDto,
    t?: Transaction,
  ): Promise<AgentStatus> {
    agentStatus.agentName = data.agentName ?? agentStatus.agentName;
    agentStatus.supportPercentage =
      data.supportPercentage ?? agentStatus.supportPercentage;
    agentStatus.projectPercentage =
      data.projectPercentage ?? agentStatus.projectPercentage;
    agentStatus.projectEndDate =
      data.projectEndDate ?? agentStatus.projectEndDate;
    agentStatus.defaultToSupport =
      data.defaultToSupport ?? agentStatus.defaultToSupport;
    agentStatus.includeInReport =
      data.includeInReport ?? agentStatus.includeInReport;

    await agentStatus.save({ transaction: t });
    return agentStatus;
  }

  async createOrUpdateAgentStatus(
    data: AgentStatusRequestDto,
    t?: Transaction,
  ): Promise<AgentStatus> {
    const dataExpected: AgentStatusDto = {
      ...data,
      projectPercentage: 100 - data.supportPercentage,
    };
    let agentStatus = await this.getAgentStatusByAgentId(data.agentId);
    if (!agentStatus) {
      agentStatus = await this.createAgentStatus(dataExpected, t);
    } else {
      agentStatus = await this.updateAgentStatus(agentStatus, dataExpected, t);
    }
    return agentStatus;
  }

  async deleteAgentStatus(agentId: string): Promise<void> {
    const agentStatus = await this.getAgentStatusByAgentId(agentId);
    if (!agentStatus) throw new NotFoundException('Agent not found');
    await agentStatus.destroy();
  }
}
