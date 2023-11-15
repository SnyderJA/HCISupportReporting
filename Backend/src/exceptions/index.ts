import { InternalServerErrorException as InternalServerError } from '@nestjs/common';
import { CommonExceptionMessage } from 'src/constants/exception.constants';

export class InternalServerErrorException extends InternalServerError {
  constructor() {
    super(CommonExceptionMessage.InternalServerError);
  }
}
