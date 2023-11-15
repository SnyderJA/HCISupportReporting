import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV,
  name: process.env.APP_NAME,
  workingDirectory: process.env.PWD || process.cwd(),
  port: parseInt(process.env.PORT || '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  jiraHost: process.env.JIRA_HOST,
  jiraEmail: process.env.JIRA_API_EMAIL,
  jiraApiToken: process.env.JIRA_API_TOKEN,
  jiraProjectKey: process.env.JIRA_PROJECT_KEY,
  jiraServiceDeskId: process.env.JIRA_SERVICE_DESK_ID,
  jiraTimeToFirstResponseKey: process.env.JIRA_TIME_TO_FIRST_RESPONSE_KEY,
  jiraTimeToSolutionKey: process.env.JIRA_TIME_TO_SOLUTION_KEY,

  username: process.env.USERNAME,
  password: process.env.PASSWORD,
}));
