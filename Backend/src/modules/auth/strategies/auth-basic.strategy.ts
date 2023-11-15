import { BasicStrategy as Strategy } from 'passport-http';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import JiraCloudService, { UserData } from 'src/services/jira-cloud.service';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  private readonly jiraCloudService: JiraCloudService;
  constructor(private readonly configService: ConfigService) {
    super({
      passReqToCallback: false,
    });

    this.jiraCloudService = new JiraCloudService(
      configService.get<string>('app.jiraHost'),
      configService.get<string>('app.jiraEmail'),
      configService.get<string>('app.jiraApiToken'),
    );
  }

  public validate = async (req): Promise<UserData> => {
    const user = await this.jiraCloudService.getCurrentUser();
    return user;
  };
}
