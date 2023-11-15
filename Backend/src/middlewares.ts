import { Injectable, NestMiddleware } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request, Response, NextFunction } from 'express';
import JiraCloudService from './services/jira-cloud.service';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  private readonly jiraCloudService: JiraCloudService;
  constructor(private readonly configService: ConfigService) {
    this.jiraCloudService = new JiraCloudService(
      configService.get<string>('app.jiraHost'),
      configService.get<string>('app.jiraEmail'),
      configService.get<string>('app.jiraApiToken'),
    );
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const user = await this.jiraCloudService.getCurrentUser();
    req.user = user;
    next();
  }
}
