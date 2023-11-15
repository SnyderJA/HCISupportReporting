import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBasicAuth, ApiTags } from '@nestjs/swagger';

@ApiBasicAuth()
@ApiTags('Auth')
@Controller('auth')
@UseGuards(AuthGuard('basic'))
export class AuthController {
  @Post('verify')
  @HttpCode(HttpStatus.OK)
  verify(): { message: string } {
    return {
      message: 'success',
    };
  }
}
