import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import appConfig from './config';
import { AuthModule } from './modules/auth/auth.module';
import { JiraModule } from './modules/jira/jira.module';
import { DatabaseModule } from './modules/database/database.module';
import { UserMiddleware } from './middlewares';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      envFilePath: ['.env'],
    }),
    AuthModule,
    JiraModule,
    DatabaseModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UserMiddleware).forRoutes('jira');
  }
}
