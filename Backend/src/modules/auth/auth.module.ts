import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { BasicStrategy } from './strategies/auth-basic.strategy';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';

@Module({
  imports: [PassportModule, ConfigModule],
  controllers: [AuthController],
  providers: [BasicStrategy],
})
export class AuthModule {}
