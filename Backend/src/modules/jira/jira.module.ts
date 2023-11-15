import { Module } from '@nestjs/common';
import { JiraController } from './jira.controller';
import { JiraService } from './jira.service';
import { jirasProviders } from './jira.providers';

@Module({
  providers: [JiraService, ...jirasProviders],
  controllers: [JiraController],
})
export class JiraModule {}
