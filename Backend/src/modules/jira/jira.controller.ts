import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Put,
  Query,
  Request,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentStatusBodyDto, DateDto, UserParamsDto } from './jira.dto';
import {
  AgentStatusResponse,
  AverageData,
  AverageDataByDate,
  CountData,
  CountDataByDate,
  JiraService,
  TicketThroughputData,
} from './jira.service';
import { UsersSearchResponse } from 'src/services/jira-cloud.service';
import { RequestTypeData } from 'src/services/jira-servicedesk.service';
import { AgentStatus } from 'src/entities/agent.entity';

@ApiTags('Jira')
@Controller('jira')
export class JiraController {
  constructor(private jiraService: JiraService) {}

  @Get('users')
  @HttpCode(HttpStatus.OK)
  async listUsers(
    @Query() params: UserParamsDto,
  ): Promise<UsersSearchResponse> {
    return this.jiraService.listUsersOfProject(params);
  }

  @Get('request-types')
  @HttpCode(HttpStatus.OK)
  async listRequestTypes(): Promise<RequestTypeData[]> {
    return this.jiraService.listRequestTypesOfProject();
  }

  @Get('average-time-to-first-response')
  @HttpCode(HttpStatus.OK)
  async averageTimeToFirstRepsonse(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<AverageData[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.averageTimeToFirstResponse({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('average-time-to-resolution')
  @HttpCode(HttpStatus.OK)
  async averageTimeToResolution(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<AverageData[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.averageTimeToSolution({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('count-time-to-first-response')
  @HttpCode(HttpStatus.OK)
  async countTimeToFirstRepsonse(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<CountData[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.countTimeToFirstResponse({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('count-time-to-resolution')
  @HttpCode(HttpStatus.OK)
  async countTimeToResolution(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<CountData[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.countTimeToSolution({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('average-time-to-first-response-by-date')
  @HttpCode(HttpStatus.OK)
  async averageTimeToFirstRepsonseByDate(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<AverageDataByDate[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.averageTimeToFirstResponseByDate({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('average-time-to-resolution-by-date')
  @HttpCode(HttpStatus.OK)
  async averageTimeToResolutioByDate(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<AverageDataByDate[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.averageTimeToSolutionByDate({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('count-time-to-first-response-by-date')
  @HttpCode(HttpStatus.OK)
  async countTimeToFirstRepsonseByDate(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<CountDataByDate[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.countTimeToFirstResponseByDate({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('count-time-to-resolution-by-date')
  @HttpCode(HttpStatus.OK)
  async countTimeToResolutionByDate(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<CountDataByDate[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.countTimeToSolutionByDate({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('ticket-throughput')
  @HttpCode(HttpStatus.OK)
  async ticketThroughput(
    @Query() params: DateDto,
    @Request() req,
    @Headers() headers,
  ): Promise<TicketThroughputData[]> {
    const jiraTZ = req.user.timeZone;
    const clientTZ = headers['x-tz'];
    return this.jiraService.ticketThroughput({
      ...params,
      jiraTZ,
      clientTZ,
    });
  }

  @Get('agent-status')
  @HttpCode(HttpStatus.OK)
  async listAllAgentStatuses(): Promise<AgentStatusResponse[]> {
    const data = await this.jiraService.listAllAgentStatusIncludeJiraUser();
    return Object.values(data);
  }

  @Put('agent-status')
  @HttpCode(HttpStatus.OK)
  async updateAgentStatus(
    @Body() data: AgentStatusBodyDto,
  ): Promise<AgentStatusResponse[]> {
    const expectedData = [];
    for (const item of data.data) {
      const dataAgent = await this.jiraService.createOrUpdateAgentStatus(item);
      expectedData.push(dataAgent.dataValues);
    }
    return expectedData;
  }

  @Delete('agent-status/:agentId')
  @HttpCode(HttpStatus.OK)
  async deleteAgentStatus(@Param('agentId') agentId: string): Promise<any> {
    await this.jiraService.deleteAgentStatus(agentId);
    return {
      message: 'success',
    };
  }
}
